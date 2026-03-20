import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data/db.sqlite");

const db = new Database(dbPath);

// create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_address TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;
