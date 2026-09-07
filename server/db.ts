import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const UPLOADS_DIR = join(import.meta.dir, "uploads", "resumes");
mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database("resume.sqlite", { create: true });

db.run(`
  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    companyName TEXT,
    jobTitle TEXT,
    jobDescription TEXT,
    resumePath TEXT,
    feedback TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log("✅ SQLite Database initialized successfully!");

export { db };
