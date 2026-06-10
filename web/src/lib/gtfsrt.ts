import protobuf from 'protobufjs';

// GTFS-Realtime v2 schema (https://gtfs.org/realtime/reference/)
const GTFS_RT_PROTO = `
syntax = "proto2";
package transit_realtime;

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
}

message FeedHeader {
  required string gtfs_realtime_version = 1;
  enum Incrementality {
    FULL_DATASET = 0;
    DIFFERENTIAL = 1;
  }
  optional Incrementality incrementality = 2;
  optional uint64 timestamp = 3;
  optional string feed_version = 4;
}

message FeedEntity {
  required string id = 1;
  optional bool is_deleted = 2;
  optional TripUpdate trip_update = 3;
  optional VehiclePosition vehicle = 4;
  optional Alert alert = 5;
}

message TripUpdate {
  required TripDescriptor trip = 1;
  repeated StopTimeUpdate stop_time_update = 2;
  optional VehicleDescriptor vehicle = 3;
  optional uint64 timestamp = 4;
  optional int32 delay = 5;
  message TripProperties {
    optional string trip_id = 1;
    optional string start_date = 2;
    optional string start_time = 3;
    optional string shape_id = 4;
    optional string trip_headsign = 5;
    optional string trip_short_name = 6;
  }
  optional TripProperties trip_properties = 6;
}

message StopTimeUpdate {
  optional uint32 stop_sequence = 1;
  optional StopTimeEvent arrival = 2;
  optional StopTimeEvent departure = 3;
  optional string stop_id = 4;
  enum ScheduleRelationship {
    SCHEDULED = 0;
    SKIPPED = 1;
    NO_DATA = 2;
    UNSCHEDULED = 3;
  }
  optional ScheduleRelationship schedule_relationship = 5;
}

message StopTimeEvent {
  optional int32 delay = 1;
  optional int64 time = 2;
  optional int32 uncertainty = 3;
}

message VehiclePosition {
  optional TripDescriptor trip = 1;
  optional Position position = 2;
  optional uint32 current_stop_sequence = 3;
  optional VehicleStopStatus current_status = 4;
  optional uint64 timestamp = 5;
  enum CongestionLevel {
    UNKNOWN_CONGESTION_LEVEL = 0;
    RUNNING_SMOOTHLY = 1;
    STOP_AND_GO = 2;
    CONGESTION = 3;
    SEVERE_CONGESTION = 4;
  }
  optional CongestionLevel congestion_level = 6;
  optional string stop_id = 7;
  optional VehicleDescriptor vehicle = 8;
  enum OccupancyStatus {
    EMPTY = 0;
    MANY_SEATS_AVAILABLE = 1;
    FEW_SEATS_AVAILABLE = 2;
    STANDING_ROOM_ONLY = 3;
    CRUSHED_STANDING_ROOM_ONLY = 4;
    FULL = 5;
    NOT_ACCEPTING_PASSENGERS = 6;
    NO_DATA_AVAILABLE = 7;
    NOT_BOARDABLE = 8;
  }
  optional OccupancyStatus occupancy_status = 9;
  optional uint32 occupancy_percentage = 10;
}

enum VehicleStopStatus {
  INCOMING_AT = 0;
  STOPPED_AT = 1;
  IN_TRANSIT_TO = 2;
}

message Position {
  optional float latitude = 1;
  optional float longitude = 2;
  optional float bearing = 3;
  optional double odometer = 4;
  optional float speed = 5;
}

message TripDescriptor {
  optional string trip_id = 1;
  optional string start_time = 2;
  optional string start_date = 3;
  enum ScheduleRelationship {
    SCHEDULED = 0;
    ADDED = 1;
    UNSCHEDULED = 2;
    CANCELED = 3;
    DUPLICATED = 5;
    DELETED = 6;
  }
  optional ScheduleRelationship schedule_relationship = 4;
  optional string route_id = 5;
  optional uint32 direction_id = 6;
}

message VehicleDescriptor {
  optional string id = 1;
  optional string label = 2;
  optional string license_plate = 3;
}

message Alert {
  repeated TimeRange active_period = 1;
  repeated EntitySelector informed_entity = 2;
  optional TranslatedString header_text = 3;
  optional TranslatedString description_text = 4;
}

message TimeRange {
  optional uint64 start = 1;
  optional uint64 end = 2;
}

message EntitySelector {
  optional string route_id = 1;
  optional string stop_id = 2;
  optional TripDescriptor trip = 3;
}

message TranslatedString {
  repeated Translation translation = 1;
}

message Translation {
  required string text = 1;
  optional string language = 2;
}
`;

let feedMessageType: protobuf.Type | null = null;

async function getFeedMessageType(): Promise<protobuf.Type> {
  if (!feedMessageType) {
    const root = protobuf.parse(GTFS_RT_PROTO).root;
    feedMessageType = root.lookupType('transit_realtime.FeedMessage');
  }
  return feedMessageType;
}

export interface ParsedFeed {
  header: { gtfsRealtimeVersion: string; timestamp?: number };
  entity: any[];
}

export async function decodeFeed(buffer: ArrayBuffer): Promise<ParsedFeed> {
  const FeedMessage = await getFeedMessageType();
  const message = FeedMessage.decode(new Uint8Array(buffer));
  return FeedMessage.toObject(message, { longs: Number, enums: String, defaults: true }) as ParsedFeed;
}

export interface ServiceAlert {
  id: string;
  header: string;
  description: string;
  routeIds: string[];
}

/**
 * Returns currently-active alerts that apply to the given route/stop/trip.
 * RTD's informedEntity uses the GTFS `route_id` (e.g. an internal ID), NOT the
 * rail line letter (route_short_name) — callers must pass the actual route_id.
 */
export function getActiveAlerts(
  alertsFeed: ParsedFeed | null,
  filter: { routeId?: string; stopId?: string; tripId?: string } = {},
): ServiceAlert[] {
  if (!alertsFeed?.entity) return [];

  const now = Math.floor(Date.now() / 1000);

  return alertsFeed.entity
    .filter((entity) => {
      const alert = entity.alert;
      if (!alert) return false;

      // RTD's feed includes empty placeholder alerts with no header/description text
      // and an activePeriod.end of 0 (which would otherwise be treated as "never ends").
      if (!alert.headerText?.translation?.length && !alert.descriptionText?.translation?.length) {
        return false;
      }

      const informed: any[] = alert.informedEntity || [];
      const matchesFilter =
        informed.length === 0 ||
        !(filter.routeId || filter.stopId || filter.tripId) ||
        informed.some((ie) => {
          if (filter.routeId && ie.routeId === filter.routeId) return true;
          if (filter.stopId && ie.stopId === filter.stopId) return true;
          if (filter.tripId && ie.trip?.tripId === filter.tripId) return true;
          return false;
        });
      if (!matchesFilter) return false;

      const periods: any[] = alert.activePeriod || [];
      if (periods.length === 0) return true;
      return periods.some((p) => {
        const start = Number(p.start || 0);
        const end = p.end ? Number(p.end) : Infinity;
        return now >= start && now <= end;
      });
    })
    .map((entity) => {
      const alert = entity.alert;
      const informed: any[] = alert.informedEntity || [];
      return {
        id: entity.id,
        header: alert.headerText?.translation?.[0]?.text || 'Service Alert',
        description: alert.descriptionText?.translation?.[0]?.text || '',
        routeIds: [...new Set(informed.map((ie) => ie.routeId).filter(Boolean))] as string[],
      };
    });
}

export interface TripDelayResult {
  delaySeconds: number | null;
  matchTier: 'trip_id' | 'route_time' | 'none';
}

/** Multi-tier match: exact trip_id, then route+direction+time within +/- windowMinutes. */
export function getTripDelay(
  tripUpdatesFeed: ParsedFeed | null,
  train: { trip_id: string; route_id?: string; direction_id?: number; departure_time?: string },
  windowMinutes = 10,
): TripDelayResult {
  const entities = tripUpdatesFeed?.entity;
  if (!entities) return { delaySeconds: null, matchTier: 'none' };

  let match = entities.find((e) => e.tripUpdate?.trip?.tripId === train.trip_id);
  if (match) {
    return { delaySeconds: match.tripUpdate.delay ?? null, matchTier: 'trip_id' };
  }

  if (train.route_id && train.direction_id !== undefined && train.departure_time) {
    const trainMinutes = timeToMinutes(train.departure_time);
    match = entities.find((e) => {
      const trip = e.tripUpdate?.trip;
      if (!trip) return false;
      if (trip.routeId !== train.route_id) return false;
      if (Number(trip.directionId) !== train.direction_id) return false;

      const stopTimes = e.tripUpdate?.stopTimeUpdate || [];
      return stopTimes.some((stu: any) => {
        const time = stu.departure?.time ?? stu.arrival?.time;
        if (!time) return false;
        const rtMinutes = new Date(Number(time) * 1000).getHours() * 60 + new Date(Number(time) * 1000).getMinutes();
        return Math.abs(rtMinutes - trainMinutes) <= windowMinutes;
      });
    });
    if (match) {
      return { delaySeconds: match.tripUpdate.delay ?? null, matchTier: 'route_time' };
    }
  }

  return { delaySeconds: null, matchTier: 'none' };
}

export interface UpcomingArrival {
  stopId: string;
  time: number; // unix seconds
  delaySeconds: number | null;
  tripId: string;
}

/** Live predicted arrivals per stop for a route, derived from Trip Updates (no static schedule needed). */
export function getUpcomingArrivalsByStop(
  tripUpdatesFeed: ParsedFeed | null,
  routeId: string,
  limitPerStop = 3,
): Record<string, UpcomingArrival[]> {
  const entities = tripUpdatesFeed?.entity;
  if (!entities) return {};

  const now = Math.floor(Date.now() / 1000);
  const byStop: Record<string, UpcomingArrival[]> = {};

  for (const e of entities) {
    const trip = e.tripUpdate?.trip;
    if (!trip || trip.routeId !== routeId) continue;

    const tripDelay = e.tripUpdate.delay ?? null;
    for (const stu of e.tripUpdate.stopTimeUpdate || []) {
      const time = Number(stu.arrival?.time ?? stu.departure?.time);
      if (!time || time < now) continue;
      const stopId = stu.stopId;
      if (!stopId) continue;

      const delaySeconds = stu.arrival?.delay ?? stu.departure?.delay ?? tripDelay;
      (byStop[stopId] ??= []).push({ stopId, time, delaySeconds, tripId: trip.tripId });
    }
  }

  for (const stopId of Object.keys(byStop)) {
    byStop[stopId].sort((a, b) => a.time - b.time);
    byStop[stopId] = byStop[stopId].slice(0, limitPerStop);
  }

  return byStop;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h % 24) * 60 + m;
}
