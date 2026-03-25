import { DatabaseSync } from "node:sqlite";

import { dirname, fromFileUrl, join } from "@std/path";

const ROOT = dirname(fromFileUrl(import.meta.url));

const DATA_DIR = join(ROOT, "..", "data");

const DB_PATH = join(DATA_DIR, "sourceflow.db");

let dbInstance = null;

/**
 * Initialises the SQLite database, creates tables if they don't exist,
 * seeds the statuses lookup table, and returns the shared database instance.
 * @returns {DatabaseSync} The open database connection.
 */
export function getDb() {
  if (dbInstance) return dbInstance;

  Deno.mkdirSync(DATA_DIR, { recursive: true });

  const db = new DatabaseSync(DB_PATH);

  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS statuses (
      status_id INTEGER PRIMARY KEY AUTOINCREMENT,
      status_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS requests (
      request_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      item_name TEXT NOT NULL,
      brand TEXT,
      budget_gbp REAL,
      size TEXT,
      colour TEXT,
      request_password TEXT NOT NULL,
      status_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (status_id) REFERENCES statuses(status_id)
    );

    CREATE TABLE IF NOT EXISTS request_notes (
      note_id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL,
      note_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE
    );
  `);

  const countRow = db.prepare("SELECT COUNT(*) AS count FROM statuses").get();

  if ((countRow?.count ?? 0) === 0) {
    const insert = db.prepare("INSERT INTO statuses (status_name) VALUES (?)");
    ["New", "In Progress", "Sourced", "Completed"].forEach((status) => insert.run(status));
  }

  dbInstance = db;
  return dbInstance;
}

/**
 * Returns the absolute file-system path to the SQLite database file.
 * @returns {string} Absolute path to sourceflow.db.
 */
export function getDbPath() {
  return DB_PATH;
}

/**
 * Resolves a status name string (e.g. "In Progress") to its numeric primary key.
 * Throws if the status name is not found in the statuses table.
 * @param {string} statusName - Human-readable status name.
 * @returns {number} The matching status_id.
 */
export function getStatusIdByName(statusName) {
  const db = getDb();
  const row = db.prepare(
    "SELECT status_id FROM statuses WHERE status_name = ?",
  ).get(statusName);

  if (!row) throw new Error(`Unknown status: ${statusName}`);
  return row.status_id;
}

/**
 * Returns all requests joined with their current status name, ordered newest first.
 * @returns {object[]} Array of request row objects.
 */
export function listRequests() {
  const db = getDb();

  return db.prepare(`
    SELECT
      r.request_id,
      r.customer_name,
      r.customer_email,
      r.item_name,
      r.brand,
      r.budget_gbp,
      r.size,
      r.colour,
      s.status_name,
      r.created_at,
      r.updated_at
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    ORDER BY r.request_id DESC
  `).all();
}

/**
 * Fetches a single request by its primary key, joined with its status name.
 * Returns undefined if no matching row is found.
 * @param {number} requestId - The request_id to look up.
 * @returns {object|undefined} The request row, or undefined if not found.
 */
export function getRequestById(requestId) {
  const db = getDb();

  return db.prepare(`
    SELECT
      r.request_id,
      r.customer_name,
      r.customer_email,
      r.item_name,
      r.brand,
      r.budget_gbp,
      r.size,
      r.colour,
      s.status_name,
      r.created_at,
      r.updated_at
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    WHERE r.request_id = ?
  `).get(requestId);
}

/**
 * Inserts a new request row with status "New" and returns the created record.
 * @param {object} payload - Fields: customer_name, customer_email, item_name, brand,
 *   budget_gbp, size, colour, request_password.
 * @returns {object} The newly created request row.
 */
export function createRequest(payload) {
  const db = getDb();
  const now = new Date().toISOString();
  const statusId = getStatusIdByName("New");

  const result = db.prepare(`
    INSERT INTO requests (
      customer_name,
      customer_email,
      item_name,
      brand,
      budget_gbp,
      size,
      colour,
      request_password,
      status_id,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    payload.customer_name,
    payload.customer_email,
    payload.item_name,
    payload.brand,
    payload.budget_gbp,
    payload.size,
    payload.colour,
    payload.request_password,
    statusId,
    now,
    now,
  );

  return getRequestById(result.lastInsertRowid);
}

/**
 * Checks whether the supplied plain-text password matches the stored password
 * for the given request. Returns false if the request does not exist.
 * @param {number} requestId - The request to authenticate against.
 * @param {string} password - Plain-text password to verify.
 * @returns {boolean} True if the password matches, false otherwise.
 */
export function verifyRequestPassword(requestId, password) {
  const db = getDb();

  const row = db.prepare(`
    SELECT request_password
    FROM requests
    WHERE request_id = ?
  `).get(requestId);

  if (!row) return false;
  return row.request_password === password;
}

/**
 * Changes the status of a request and updates the updated_at timestamp.
 * Returns the updated request row.
 * @param {number} requestId - ID of the request to update.
 * @param {string} statusName - New status name (must exist in the statuses table).
 * @returns {object} The updated request row.
 */
export function updateRequestStatus(requestId, statusName) {
  const db = getDb();
  const statusId = getStatusIdByName(statusName);
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE requests
    SET status_id = ?, updated_at = ?
    WHERE request_id = ?
  `).run(statusId, now, requestId);

  return getRequestById(requestId);
}

/**
 * Permanently deletes a request row. Associated notes are removed automatically
 * via the ON DELETE CASCADE foreign key on request_notes.
 * @param {number} requestId - ID of the request to delete.
 */
export function deleteRequest(requestId) {
  const db = getDb();
  db.prepare("DELETE FROM requests WHERE request_id = ?").run(requestId);
}

/**
 * Inserts a new note for the given request with the current timestamp.
 * @param {number} requestId - ID of the parent request.
 * @param {string} noteText - Text content of the note.
 */
export function addNote(requestId, noteText) {
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO request_notes (request_id, note_text, created_at)
    VALUES (?, ?, ?)
  `).run(requestId, noteText, now);
}

/**
 * Returns all notes for a given request, ordered newest first.
 * @param {number} requestId - ID of the parent request.
 * @returns {object[]} Array of note row objects.
 */
export function listNotesForRequest(requestId) {
  const db = getDb();

  return db.prepare(`
    SELECT
      note_id,
      note_text,
      created_at
    FROM request_notes
    WHERE request_id = ?
    ORDER BY note_id DESC
  `).all(requestId);
}

/**
 * Aggregates dashboard summary statistics: total, new, in-progress, and completed
 * request counts, plus the five most recent requests.
 * @returns {{ total: number, newCount: number, inProgress: number, completed: number, recent: object[] }}
 */
export function getDashboardSummary() {
  const db = getDb();

  const total = db.prepare(`SELECT COUNT(*) AS count FROM requests`).get()?.count ?? 0;

  const newCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    WHERE s.status_name = 'New'
  `).get()?.count ?? 0;

  const inProgress = db.prepare(`
    SELECT COUNT(*) AS count
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    WHERE s.status_name = 'In Progress'
  `).get()?.count ?? 0;

  const completed = db.prepare(`
    SELECT COUNT(*) AS count
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    WHERE s.status_name = 'Completed'
  `).get()?.count ?? 0;

  const recent = db.prepare(`
    SELECT
      r.request_id,
      r.customer_name,
      r.item_name,
      s.status_name,
      r.created_at
    FROM requests r
    JOIN statuses s ON s.status_id = r.status_id
    ORDER BY r.request_id DESC
    LIMIT 5
  `).all();

  return {
    total,
    newCount,
    inProgress,
    completed,
    recent,
  };
}
