/* Cloud backup data keuangan (opsional, dipicu user dari menu Backup & Restore).
 * Isi backup (JSON yang sama dengan file "Download Backup") disimpan di R2: backups/<user>/<id>.json,
 * daftar & metadata di D1 tabel `backups`. Yang disimpan hanya backup yang user kirim sendiri. */

const BACKUP_MAX = 8e6; // ~8 MB JSON (foto profil/struk ikut di dalamnya)
const KEEP = { free: 3, premium: 15, plus: 30 };
const PER_DAY = 20;
const key = (uid, id) => "backups/" + uid + "/" + id + ".json";

let ready = null;
function ensureBackups(env) {
  if (!ready) ready = env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS backups (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, size INTEGER NOT NULL, tx INTEGER NOT NULL DEFAULT 0, device TEXT, created_at INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS backups_user ON backups(user_id, created_at)")
  ]).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

const pubB = (r) => ({ id: r.id, size: r.size, tx: r.tx, device: r.device || "", ts: r.created_at });

export async function backupRoute(env, me, req, u, body, { json, usedN, bumpN, dayKey, effPlan }) {
  if (!env.FILES) return json({ error: "notfound" }, 404);
  await ensureBackups(env);
  const k = req.method + " " + u.pathname;
  if (k === "GET /api/backup") {
    const { results } = await env.DB.prepare("SELECT * FROM backups WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(me.id).all();
    return json({ backups: results.map(pubB), keep: KEEP[effPlan(me)] || KEEP.free });
  }
  if (k === "POST /api/backup") {
    const d = body.data;
    if (!d || typeof d !== "object" || d.app !== "japan-work-ledger") return json({ error: "backup" }, 400);
    const text = JSON.stringify(d);
    if (text.length > BACKUP_MAX) return json({ error: "limit", what: "backup", max: BACKUP_MAX }, 413);
    if (await usedN(env, me.id, dayKey("backup")) >= PER_DAY) return json({ error: "limit", what: "backupday" }, 429);
    const id = crypto.randomUUID().slice(0, 12), t = Date.now();
    const tx = Array.isArray(d.transactions) ? d.transactions.length : 0, device = String(body.device || "").slice(0, 60);
    await env.FILES.put(key(me.id, id), text, { httpMetadata: { contentType: "application/json" }, customMetadata: { user: me.id } });
    await env.DB.prepare("INSERT INTO backups(id,user_id,size,tx,device,created_at) VALUES(?,?,?,?,?,?)").bind(id, me.id, text.length, tx, device, t).run();
    await bumpN(env, me.id, dayKey("backup"));
    // simpan N terbaru saja sesuai paket
    const keep = KEEP[effPlan(me)] || KEEP.free;
    const { results: old } = await env.DB.prepare("SELECT id FROM backups WHERE user_id=? ORDER BY created_at DESC LIMIT -1 OFFSET ?").bind(me.id, keep).all();
    if (old.length) {
      await env.FILES.delete(old.map((r) => key(me.id, r.id)));
      await env.DB.batch(old.map((r) => env.DB.prepare("DELETE FROM backups WHERE id=? AND user_id=?").bind(r.id, me.id)));
    }
    return json({ backup: pubB({ id, size: text.length, tx, device, created_at: t }) });
  }
  if (k === "POST /api/backup/delete") {
    const id = String(body.id || "");
    const r = await env.DB.prepare("DELETE FROM backups WHERE id=? AND user_id=? RETURNING id").bind(id, me.id).first();
    if (r) await env.FILES.delete(key(me.id, id));
    return json({ ok: !!r });
  }
  if (req.method === "GET" && u.pathname.startsWith("/api/backup/")) {
    const id = u.pathname.slice(12);
    const r = await env.DB.prepare("SELECT id FROM backups WHERE id=? AND user_id=?").bind(id, me.id).first();
    const o = r && await env.FILES.get(key(me.id, id));
    if (!o) return json({ error: "notfound" }, 404);
    return new Response(o.body, { headers: { "content-type": "application/json", "cache-control": "private, no-store" } });
  }
  return json({ error: "notfound" }, 404);
}
