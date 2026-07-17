import { Pool } from 'pg';

let pool: Pool | null = null;

// Returns null when BOOKINGS_DB_URL is not configured — callers must fail open
// (never block a lead because the capacity counter is unavailable).
export function getPool(): Pool | null {
  const url = process.env.BOOKINGS_DB_URL;
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}
