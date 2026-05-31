const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists inside data directory
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'glia.db');
const db = new DatabaseSync(DB_PATH);

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,                  -- 'movie', 'series', 'book'
    title TEXT NOT NULL,
    image_url TEXT,                      -- Local path (/uploads/...) or external URL
    synopsis TEXT,
    genre TEXT,
    rating INTEGER,                      -- 1 to 5 stars, NULL if not rated
    view_count INTEGER DEFAULT 0,        -- Number of times watched/read
    platform TEXT,                       -- Netflix, HBO Max, Prime Video, Disney+, Jellyfin, Other, None
    current_time_minutes INTEGER DEFAULT 0, -- Minutaje actual for movies/series
    total_time_minutes INTEGER DEFAULT 0,   -- Total duration for movies/series (optional)
    season INTEGER DEFAULT 1,            -- Current season (series)
    episode INTEGER DEFAULT 1,           -- Current episode (series)
    total_pages INTEGER DEFAULT 0,       -- Total pages (books)
    current_page INTEGER DEFAULT 0,      -- Current page (books)
    status TEXT NOT NULL,                -- 'want_to_watch'/'want_to_read', 'watching'/'reading', 'watched'/'read', 'rewatching'/'rereading'
    seasons_info TEXT,                   -- JSON list of episodes per season (series)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration to add seasons_info if table already exists
try {
  db.exec("ALTER TABLE items ADD COLUMN seasons_info TEXT;");
} catch (e) {
  // column already exists, which is fine
}

// Helper to run query and return all results
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

// Helper to run query and return single row
function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

// Helper to run insert/update/delete
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

const dbHelper = {
  getAllItems: () => {
    return all('SELECT * FROM items ORDER BY updated_at DESC');
  },

  getItemById: (id) => {
    return get('SELECT * FROM items WHERE id = ?', [id]);
  },

  addItem: (item) => {
    const sql = `
      INSERT INTO items (
        type, title, image_url, synopsis, genre, rating, view_count,
        platform, current_time_minutes, total_time_minutes, season, episode,
        total_pages, current_page, status, seasons_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      item.type,
      item.title,
      item.image_url || null,
      item.synopsis || '',
      item.genre || '',
      item.rating || null,
      item.view_count || 0,
      item.platform || null,
      item.current_time_minutes || 0,
      item.total_time_minutes || 0,
      item.season || 1,
      item.episode || 1,
      item.total_pages || 0,
      item.current_page || 0,
      item.status,
      item.seasons_info || null
    ];
    const result = run(sql, params);
    return { id: result.lastInsertRowid, ...item };
  },

  updateItem: (id, item) => {
    const sql = `
      UPDATE items SET
        type = ?, title = ?, image_url = ?, synopsis = ?, genre = ?, rating = ?, view_count = ?,
        platform = ?, current_time_minutes = ?, total_time_minutes = ?, season = ?, episode = ?,
        total_pages = ?, current_page = ?, status = ?, seasons_info = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      item.type,
      item.title,
      item.image_url || null,
      item.synopsis || '',
      item.genre || '',
      item.rating !== undefined ? item.rating : null,
      item.view_count || 0,
      item.platform || null,
      item.current_time_minutes || 0,
      item.total_time_minutes || 0,
      item.season || 1,
      item.episode || 1,
      item.total_pages || 0,
      item.current_page || 0,
      item.status,
      item.seasons_info || null,
      id
    ];
    const result = run(sql, params);
    return result.changes > 0 ? { id, ...item } : null;
  },

  deleteItem: (id) => {
    // If the item had a local uploaded image, we could delete it, but keeping it is safe as well.
    // Let's first get the item so we know if there is a local image we want to clean up.
    const item = get('SELECT image_url FROM items WHERE id = ?', [id]);
    if (item && item.image_url && item.image_url.startsWith('/uploads/')) {
      const filename = path.basename(item.image_url);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete local image: ${filePath}`, err);
        }
      }
    }
    const result = run('DELETE FROM items WHERE id = ?', [id]);
    return result.changes > 0;
  },

  getStats: () => {
    const total = get('SELECT COUNT(*) as count FROM items').count;
    const movies = get("SELECT COUNT(*) as count FROM items WHERE type = 'movie'").count;
    const series = get("SELECT COUNT(*) as count FROM items WHERE type = 'series'").count;
    const books = get("SELECT COUNT(*) as count FROM items WHERE type = 'book'").count;

    const watching = get("SELECT COUNT(*) as count FROM items WHERE status IN ('watching', 'rewatching')").count;
    const reading = get("SELECT COUNT(*) as count FROM items WHERE status IN ('reading', 'rereading')").count;
    
    return {
      total,
      movies,
      series,
      books,
      watching,
      reading
    };
  },

  UPLOADS_DIR
};

module.exports = dbHelper;
