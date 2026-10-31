-- Cloud backup data keuangan (isi file di R2: backups/<user_id>/<id>.json)
CREATE TABLE IF NOT EXISTS backups (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, size INTEGER NOT NULL, tx INTEGER NOT NULL DEFAULT 0, device TEXT, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS backups_user ON backups(user_id, created_at);
-- Penanda media yang sudah dipindah ke R2: kolom data dikosongkan (''); index bantu untuk cron migrasi
CREATE INDEX IF NOT EXISTS media_owner_time ON media(owner_id, created_at);
