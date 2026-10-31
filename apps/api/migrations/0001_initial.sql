-- Skema D1 "kakeibo-chat" persis seperti di produksi (diambil dari sqlite_master, 2026-10-31).
-- Semua pakai IF NOT EXISTS, jadi aman di-apply ke database live yang tabelnya sudah ada.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, lang TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free', invite TEXT UNIQUE NOT NULL, created_at INTEGER NOT NULL, plan_until INTEGER);
CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS otp (
  email TEXT PRIMARY KEY, hash TEXT NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
  sent_at INTEGER NOT NULL, win_start INTEGER NOT NULL, sends INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS tickets (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, peer_id TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS usage (user_id TEXT NOT NULL, month TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, month));
CREATE TABLE IF NOT EXISTS contacts (user_id TEXT NOT NULL, peer_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, peer_id));
CREATE TABLE IF NOT EXISTS avatars (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, peer_id TEXT NOT NULL, mime TEXT NOT NULL, w INTEGER, h INTEGER, data TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS stories (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, kind TEXT NOT NULL, text TEXT, bg TEXT, mime TEXT, w INTEGER, h INTEGER, data TEXT, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS stories_user ON stories(user_id, expires_at);
CREATE TABLE IF NOT EXISTS story_views (story_id TEXT NOT NULL, viewer_id TEXT NOT NULL, ts INTEGER NOT NULL, PRIMARY KEY (story_id, viewer_id));
CREATE TABLE IF NOT EXISTS chat_groups (id TEXT PRIMARY KEY, name TEXT NOT NULL, owner_id TEXT NOT NULL, invite TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS chat_group_members (group_id TEXT NOT NULL, user_id TEXT NOT NULL, joined_at INTEGER NOT NULL, PRIMARY KEY (group_id, user_id));
CREATE INDEX IF NOT EXISTS chat_gm_user ON chat_group_members(user_id);
CREATE TABLE IF NOT EXISTS group_meta (group_id TEXT PRIMARY KEY, avatar TEXT, descr TEXT, descr_lang TEXT, descr_ts INTEGER);
CREATE TABLE IF NOT EXISTS group_desc_tr (group_id TEXT NOT NULL, lang TEXT NOT NULL, ts INTEGER NOT NULL, text TEXT NOT NULL, PRIMARY KEY (group_id, lang));
CREATE TABLE IF NOT EXISTS chat_last (room TEXT PRIMARY KEY, uid TEXT, name TEXT, kind TEXT, text TEXT, ts INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS chat_unread (user_id TEXT NOT NULL, room TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (user_id, room));
CREATE TABLE IF NOT EXISTS push_subs (endpoint TEXT PRIMARY KEY, user_id TEXT NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL, ua TEXT, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS push_user ON push_subs(user_id);
CREATE TABLE IF NOT EXISTS plan_requests (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, plan TEXT NOT NULL, note TEXT, status TEXT NOT NULL, created_at INTEGER NOT NULL, decided_at INTEGER);
CREATE TABLE IF NOT EXISTS study_cache (key TEXT PRIMARY KEY, data TEXT NOT NULL, created_at INTEGER NOT NULL);
