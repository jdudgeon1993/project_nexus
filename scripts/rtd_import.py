#!/usr/bin/env python3
"""
RTD GTFS to Supabase Importer
Downloads RTD's GTFS feed and imports rail line data to Supabase

Requirements:
    pip install requests supabase

Usage:
    python rtd_import.py
"""

import os
import sys
import csv
import requests
import zipfile
import io
import traceback
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError as e:
    print(f"❌ Failed to import supabase library: {e}")
    print("Please install it with: pip install supabase")
    sys.exit(1)

# ============================================
# Configuration
# ============================================

# Get from environment variables (REQUIRED for GitHub Actions)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate credentials exist
if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERROR: Missing required environment variables!")
    print("   Please set SUPABASE_URL and SUPABASE_KEY")
    print("\nFor local testing, set them in your shell:")
    print("   export SUPABASE_URL=https://your-project.supabase.co")
    print("   export SUPABASE_KEY=your-service-role-key")
    print("\nFor GitHub Actions, set them as repository secrets.")
    sys.exit(1)

RTD_GTFS_URL = "https://www.rtd-denver.com/files/gtfs/google_transit.zip"

# Routes to import - Filter by route type
# GTFS route_type: 0 = Light rail, 1 = Subway, 2 = Commuter rail, 3 = Bus
TARGET_ROUTE_TYPES = [0, 1, 2, 3]  # Rail + bus

# Fallback schema mapping (used when tables are empty and we can't auto-detect)
FALLBACK_SCHEMA = {
    'rtd_routes': [
        'route_id', 'route_short_name', 'route_long_name', 'route_type',
        'route_color', 'route_text_color', 'route_desc', 'route_sort_order'
    ],
    'rtd_stops': [
        'stop_id', 'stop_code', 'stop_name', 'stop_desc', 'stop_lat', 'stop_lon',
        'zone_id', 'stop_url', 'location_type', 'parent_station',
        'wheelchair_boarding', 'platform_code'
    ],
    'rtd_trips': [
        'route_id', 'service_id', 'trip_id', 'trip_headsign', 'trip_short_name',
        'direction_id', 'block_id', 'shape_id', 'wheelchair_accessible',
        'bikes_allowed'
    ],
    'rtd_stop_times': [
        'trip_id', 'arrival_time', 'departure_time', 'stop_id', 'stop_sequence',
        'stop_headsign', 'pickup_type', 'drop_off_type', 'timepoint'
    ],
    'rtd_calendar': [
        'service_id', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
        'saturday', 'sunday', 'start_date', 'end_date'
    ],
    'rtd_calendar_dates': [
        'service_id', 'date', 'exception_type'
    ],
    'rtd_feed_info': [
        'feed_publisher_name', 'feed_publisher_url', 'feed_lang',
        'feed_start_date', 'feed_end_date', 'feed_version',
        'feed_contact_email', 'feed_contact_url', 'default_lang', 'feed_id'
    ],
    'rtd_shapes': [
        'shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence', 'shape_dist_traveled'
    ],
}

# ============================================
# Helper Functions
# ============================================

def download_gtfs():
    """Download and extract RTD GTFS ZIP file"""
    print("📥 Downloading RTD GTFS feed...")
    response = requests.get(RTD_GTFS_URL, timeout=120)
    response.raise_for_status()
    print(f"  Downloaded {len(response.content) / 1_000_000:.1f} MB")

    print("📦 Extracting GTFS files...")
    zip_file = zipfile.ZipFile(io.BytesIO(response.content))

    # Extract to memory
    gtfs_data = {}
    files_to_extract = [
        'routes.txt', 'stops.txt', 'trips.txt', 'stop_times.txt',
        'calendar.txt', 'calendar_dates.txt', 'feed_info.txt', 'shapes.txt'
    ]

    for filename in files_to_extract:
        if filename in zip_file.namelist():
            gtfs_data[filename] = zip_file.read(filename).decode('utf-8-sig')
        else:
            if filename in ('feed_info.txt', 'shapes.txt'):
                print(f"⚠️  Warning: {filename} not found (optional)")
            else:
                print(f"⚠️  Warning: {filename} not found in GTFS feed")

    return gtfs_data

def parse_csv(csv_text):
    """Parse CSV text into list of dictionaries"""
    if not csv_text:
        return []
    return list(csv.DictReader(io.StringIO(csv_text)))

def filter_routes(routes):
    """Filter to only rail routes (light rail, subway, commuter rail)"""
    filtered = []
    for r in routes:
        try:
            route_type = int(r.get('route_type', -1))
            if route_type in TARGET_ROUTE_TYPES:
                filtered.append(r)
        except (ValueError, TypeError):
            # Skip routes with invalid route_type
            continue
    return filtered

def filter_trips(trips, route_ids):
    """Filter trips to only those for target routes"""
    return [t for t in trips if t.get('route_id') in route_ids]

def pick_representative_trips(trips):
    """
    Keep only one trip per (route_id, direction_id). The app only needs a
    representative stop sequence per direction (live data covers the rest),
    so importing every trip/stop_time for ~150 bus routes would be wasteful.
    """
    seen = set()
    representative = []
    for t in trips:
        key = (t.get('route_id'), t.get('direction_id'))
        if key in seen:
            continue
        seen.add(key)
        representative.append(t)
    return representative

def filter_stop_times(stop_times, trip_ids):
    """Filter stop times to only those for target trips"""
    return [st for st in stop_times if st.get('trip_id') in trip_ids]

def filter_stops(stops, stop_times):
    """Filter stops to only those used by target routes"""
    stop_ids = set(st.get('stop_id') for st in stop_times)
    return [s for s in stops if s.get('stop_id') in stop_ids]

def filter_shapes(shapes, trips):
    """Filter shape points to only the shapes used by the representative trips"""
    shape_ids = set(t.get('shape_id') for t in trips if t.get('shape_id'))
    return [s for s in shapes if s.get('shape_id') in shape_ids]

def get_table_columns(supabase: Client, table: str):
    """Query Supabase to get the list of columns for a table"""
    try:
        # Try to query existing data to get column names
        result = supabase.table(table).select('*').limit(1).execute()

        # If there's data, get columns from the first record
        if result.data and len(result.data) > 0:
            columns = list(result.data[0].keys())
            print(f"    Auto-detected {len(columns)} columns from existing data")
            return columns

        # If no data exists, fall back to hardcoded schema
        if table in FALLBACK_SCHEMA:
            columns = FALLBACK_SCHEMA[table]
            print(f"    Using fallback schema with {len(columns)} columns")
            return columns

        print(f"    Warning: No schema available for {table}")
        return None

    except Exception as e:
        # If query fails, try fallback schema
        if table in FALLBACK_SCHEMA:
            columns = FALLBACK_SCHEMA[table]
            print(f"    Query failed, using fallback schema with {len(columns)} columns")
            return columns

        print(f"    Error: Could not get columns for {table}: {e}")
        return None

def clean_record(record: dict) -> dict:
    """Clean a record by converting empty strings to None"""
    cleaned = {}
    for key, value in record.items():
        # Convert empty strings to None (NULL in database)
        if value == '' or value is None:
            cleaned[key] = None
        else:
            cleaned[key] = value
    return cleaned

def filter_to_table_schema(data: list, table_columns: list, data_name: str = "records"):
    """Filter CSV data to only include columns that exist in the Supabase table"""
    if not data or not table_columns:
        return data

    # Get the fields from the first CSV record
    csv_fields = set(data[0].keys()) if data else set()
    table_fields = set(table_columns)

    # Exclude auto-generated ID columns
    table_fields.discard('id')
    table_fields.discard('created_at')
    table_fields.discard('updated_at')
    table_fields.discard('last_updated')

    # Find fields to keep and drop
    fields_to_keep = csv_fields & table_fields
    fields_to_drop = csv_fields - table_fields

    # Log what we're doing
    if fields_to_drop:
        print(f"    Dropping fields not in table: {', '.join(sorted(fields_to_drop))}")
    print(f"    Keeping {len(fields_to_keep)} fields: {', '.join(sorted(fields_to_keep))}")

    # Filter and clean each record
    filtered_data = []
    for record in data:
        filtered_record = {k: v for k, v in record.items() if k in fields_to_keep}
        # Clean the record (convert empty strings to None)
        cleaned_record = clean_record(filtered_record)
        filtered_data.append(cleaned_record)

    return filtered_data

def batch_insert(supabase: Client, table: str, data: list, batch_size: int = 500):
    """Insert data in batches to avoid timeout"""
    if not data:
        print(f"  No data to insert into {table}")
        return 0, 0

    total = len(data)
    print(f"  Inserting {total} records into {table}...")

    # Auto-detect table columns and filter data
    print(f"  Detecting table schema for {table}...")
    table_columns = get_table_columns(supabase, table)

    if table_columns:
        print(f"    Found {len(table_columns)} columns in {table}")
        data = filter_to_table_schema(data, table_columns, table)
    else:
        print(f"    Could not auto-detect schema, will try inserting as-is")

    failed_count = 0
    success_count = 0

    for i in range(0, total, batch_size):
        batch = data[i:i + batch_size]
        try:
            response = supabase.table(table).insert(batch).execute()
            success_count += len(batch)
            print(f"    ✓ Inserted {min(i + batch_size, total)}/{total}")
        except Exception as e:
            print(f"    ✗ Error inserting batch {i}-{i+batch_size}:")
            print(f"       Error type: {type(e).__name__}")
            print(f"       Error message: {str(e)}")

            # Show first record in batch for debugging
            if batch:
                print(f"       Sample record fields: {list(batch[0].keys())}")

            # Try inserting one by one to find problematic records
            print(f"    Attempting individual inserts for this batch...")
            for j, record in enumerate(batch):
                try:
                    supabase.table(table).insert(record).execute()
                    success_count += 1
                except Exception as e2:
                    failed_count += 1
                    record_id = record.get('route_id', record.get('trip_id', record.get('stop_id', 'unknown')))
                    if failed_count <= 5:  # Only show first 5 detailed errors
                        print(f"      ✗ Failed record {record_id}:")
                        print(f"         Error: {type(e2).__name__}: {str(e2)}")
                        if failed_count == 5:
                            print(f"      (Suppressing further detailed errors...)")

    print(f"  Summary: {success_count} succeeded, {failed_count} failed")
    return success_count, failed_count

def clear_table(supabase: Client, table: str, key_field: str = 'id'):
    """Clear all records from a table"""
    try:
        # Use gte with a value that captures all records
        if key_field in ['id', 'stop_sequence']:
            supabase.table(table).delete().gte(key_field, 0).execute()
        else:
            # For string keys, use not equal to empty string
            supabase.table(table).delete().neq(key_field, '').execute()
    except Exception as e:
        # If the table doesn't exist or is already empty, that's okay
        pass

# ============================================
# Main Import Process
# ============================================

def main():
    print("=" * 60)
    print("RTD GTFS → Supabase Importer")
    print("Routes: All Rail Lines (Light Rail + Commuter Rail)")
    print("=" * 60)
    print()

    # Initialize Supabase client
    print("🔌 Connecting to Supabase...")
    print(f"   URL: {SUPABASE_URL}")
    print(f"   Key: {SUPABASE_KEY[:20]}...")

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✓ Connected!\n")
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        traceback.print_exc()
        sys.exit(1)

    # Download GTFS data
    gtfs_data = download_gtfs()
    print("✓ GTFS data downloaded!\n")

    # Parse CSV files
    print("📊 Parsing GTFS files...")
    routes = parse_csv(gtfs_data.get('routes.txt', ''))
    stops = parse_csv(gtfs_data.get('stops.txt', ''))
    trips = parse_csv(gtfs_data.get('trips.txt', ''))
    stop_times = parse_csv(gtfs_data.get('stop_times.txt', ''))
    calendar = parse_csv(gtfs_data.get('calendar.txt', ''))
    calendar_dates = parse_csv(gtfs_data.get('calendar_dates.txt', ''))
    feed_info = parse_csv(gtfs_data.get('feed_info.txt', ''))
    shapes = parse_csv(gtfs_data.get('shapes.txt', ''))
    print("✓ Parsing complete!\n")

    # Filter to target routes
    print(f"  Parsed: {len(routes)} routes, {len(stops)} stops, {len(trips)} trips, {len(stop_times)} stop_times\n")

    print("🔍 Filtering to rail + bus routes...")
    filtered_routes = filter_routes(routes)
    route_ids = set(r['route_id'] for r in filtered_routes)
    route_names = ', '.join(sorted(r.get('route_short_name', 'Unknown') for r in filtered_routes))
    print(f"  Found {len(filtered_routes)} rail routes: {route_names}")

    all_trips_for_routes = filter_trips(trips, route_ids)
    print(f"  Found {len(all_trips_for_routes)} total trips for these routes")

    # Only keep one representative trip per route+direction — the app uses this
    # purely to derive an ordered stop list per direction; live GTFS-RT covers
    # actual arrivals. This keeps stop_times manageable once buses are included.
    filtered_trips = pick_representative_trips(all_trips_for_routes)
    trip_ids = set(t['trip_id'] for t in filtered_trips)
    print(f"  Reduced to {len(filtered_trips)} representative trips (1 per route+direction)")

    filtered_stop_times = filter_stop_times(stop_times, trip_ids)
    print(f"  Found {len(filtered_stop_times)} stop times")

    filtered_shapes = filter_shapes(shapes, filtered_trips)
    print(f"  Found {len(filtered_shapes)} shape points")

    filtered_stops = filter_stops(stops, filtered_stop_times)
    print(f"  Found {len(filtered_stops)} unique stops")

    # rtd_trips.service_id has a foreign key to rtd_calendar, so we must still
    # import the calendar rows referenced by our representative trips (even
    # though the app itself doesn't read calendar data).
    service_ids = set(t['service_id'] for t in filtered_trips)
    filtered_calendar = [c for c in calendar if c.get('service_id') in service_ids]
    filtered_calendar_dates = [d for d in calendar_dates if d.get('service_id') in service_ids]

    # Add timestamp to feed_info
    if feed_info:
        for record in feed_info:
            record['last_updated'] = datetime.utcnow().isoformat()
        print(f"  Found feed_info with version: {feed_info[0].get('feed_version', 'unknown')}\n")
    else:
        print(f"  No feed_info found (version tracking unavailable)\n")

    # Clear existing RTD data
    print("🗑️  Clearing existing RTD data...")
    try:
        # Delete in correct order (respect foreign keys)
        print("  Clearing rtd_stop_times...")
        clear_table(supabase, 'rtd_stop_times', 'trip_id')
        print("  Clearing rtd_trips...")
        clear_table(supabase, 'rtd_trips', 'trip_id')
        print("  Clearing rtd_shapes...")
        clear_table(supabase, 'rtd_shapes', 'shape_id')
        print("  Clearing rtd_calendar_dates...")
        clear_table(supabase, 'rtd_calendar_dates', 'service_id')
        print("  Clearing rtd_calendar...")
        clear_table(supabase, 'rtd_calendar', 'service_id')
        print("  Clearing rtd_stops...")
        clear_table(supabase, 'rtd_stops', 'stop_id')
        print("  Clearing rtd_routes...")
        clear_table(supabase, 'rtd_routes', 'route_id')
        # Don't clear feed_info - we want to keep version history
        print("✓ Cleared existing data\n")
    except Exception as e:
        print(f"⚠️  Warning during cleanup: {e}\n")

    # Insert data into Supabase
    print("💾 Importing data to Supabase...")

    total_success = 0
    total_failed = 0

    # 0. Feed Info (version tracking - insert first to track this import)
    if feed_info:
        print("0️⃣ Feed Info (Version Tracking)")
        success, failed = batch_insert(supabase, 'rtd_feed_info', feed_info)
        total_success += success
        total_failed += failed

    # 1. Routes (no dependencies)
    print("\n1️⃣ Routes")
    success, failed = batch_insert(supabase, 'rtd_routes', filtered_routes)
    total_success += success
    total_failed += failed

    # 2. Stops (no dependencies)
    print("\n2️⃣ Stops")
    success, failed = batch_insert(supabase, 'rtd_stops', filtered_stops)
    total_success += success
    total_failed += failed

    # 3. Calendar (no dependencies)
    print("\n3️⃣ Calendar")
    success, failed = batch_insert(supabase, 'rtd_calendar', filtered_calendar)
    total_success += success
    total_failed += failed

    # 4. Calendar Dates (depends on calendar)
    print("\n4️⃣ Calendar Dates")
    if filtered_calendar_dates:
        success, failed = batch_insert(supabase, 'rtd_calendar_dates', filtered_calendar_dates)
        total_success += success
        total_failed += failed
    else:
        print("  (No calendar date exceptions found)")

    # 5. Trips (depends on routes and calendar)
    print("\n5️⃣ Trips")
    success, failed = batch_insert(supabase, 'rtd_trips', filtered_trips)
    total_success += success
    total_failed += failed

    # 6. Stop Times (depends on trips and stops)
    print("\n6️⃣ Stop Times")
    success, failed = batch_insert(supabase, 'rtd_stop_times', filtered_stop_times)
    total_success += success
    total_failed += failed

    # 7. Shapes (no dependencies)
    print("\n7️⃣ Shapes")
    if filtered_shapes:
        success, failed = batch_insert(supabase, 'rtd_shapes', filtered_shapes)
        total_success += success
        total_failed += failed
    else:
        print("  (No shape points found)")

    print("\n" + "=" * 60)
    if total_failed == 0:
        print("✅ Import Complete!")
    else:
        print("⚠️  Import Complete with Errors")
    print("=" * 60)

    print(f"\nImport Summary:")
    print(f"  ✓ Successfully imported: {total_success} records")
    print(f"  ✗ Failed to import: {total_failed} records")

    print(f"\nBreakdown:")
    if feed_info:
        print(f"  • Feed version: {feed_info[0].get('feed_version', 'unknown')}")
    print(f"  • {len(filtered_routes)} routes (rail + bus)")
    print(f"  • {len(filtered_stops)} stops")
    print(f"  • {len(filtered_trips)} trips")
    print(f"  • {len(filtered_stop_times)} stop times")
    print(f"  • {len(filtered_shapes)} shape points")
    print(f"  • {len(filtered_calendar)} calendar entries")
    print(f"  • {len(filtered_calendar_dates)} calendar exceptions")
    print(f"\nLast updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    if total_failed > 0:
        print(f"\n⚠️  WARNING: {total_failed} records failed to import!")
        print("Check the error messages above for details.")
        print("Common issues:")
        print("  • Tables may not exist in Supabase")
        print("  • Column names may not match GTFS field names")
        print("  • Data type mismatches")
        sys.exit(1)
    else:
        print("\n🎉 Ready to use! Your schedule app can now query Supabase.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Import cancelled by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
