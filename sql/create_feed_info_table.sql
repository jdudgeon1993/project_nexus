-- ============================================
-- RTD Feed Info Table
-- Tracks GTFS feed versions and import timestamps
-- ============================================

-- Create the feed_info table
CREATE TABLE IF NOT EXISTS rtd_feed_info (
    id BIGSERIAL PRIMARY KEY,
    feed_publisher_name TEXT,
    feed_publisher_url TEXT,
    feed_lang TEXT,
    feed_start_date TEXT,
    feed_end_date TEXT,
    feed_version TEXT,
    feed_contact_email TEXT,
    feed_contact_url TEXT,
    default_lang TEXT,
    feed_id TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for quick version lookups (most recent first)
CREATE INDEX IF NOT EXISTS idx_feed_version
ON rtd_feed_info(feed_version, last_updated DESC);

-- Create index for timestamp lookups
CREATE INDEX IF NOT EXISTS idx_last_updated
ON rtd_feed_info(last_updated DESC);

-- Add table comment
COMMENT ON TABLE rtd_feed_info IS 'Tracks GTFS feed versions and import timestamps for version control and staleness detection';

-- Add column comments
COMMENT ON COLUMN rtd_feed_info.feed_version IS 'GTFS feed version identifier from RTD';
COMMENT ON COLUMN rtd_feed_info.feed_start_date IS 'Date when this feed version becomes active';
COMMENT ON COLUMN rtd_feed_info.feed_end_date IS 'Date when this feed version expires';
COMMENT ON COLUMN rtd_feed_info.last_updated IS 'Timestamp when this record was imported';

-- ============================================
-- Query Examples
-- ============================================

-- Get the most recent GTFS version
-- SELECT feed_version, feed_start_date, feed_end_date, last_updated
-- FROM rtd_feed_info
-- ORDER BY last_updated DESC
-- LIMIT 1;

-- Check if data is stale (more than 7 days old)
-- SELECT
--     feed_version,
--     last_updated,
--     NOW() - last_updated AS age,
--     CASE
--         WHEN NOW() - last_updated > INTERVAL '7 days' THEN 'STALE'
--         ELSE 'FRESH'
--     END AS status
-- FROM rtd_feed_info
-- ORDER BY last_updated DESC
-- LIMIT 1;

-- View import history
-- SELECT feed_version, last_updated
-- FROM rtd_feed_info
-- ORDER BY last_updated DESC
-- LIMIT 10;
