CREATE TABLE learning_records (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  day INTEGER NOT NULL,
  payload TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX records_by_day ON learning_records(day, kind, created_at);
