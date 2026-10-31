/* Cron Trigger (lihat "triggers" di wrangler.jsonc): bersih-bersih rutin D1 dan R2,
 * plus memindah sedikit demi sedikit media base64 lama dari D1 ke R2. */
import { delBlobs, storyKey, migrateToR2, hasR2 } from "./blob.js";

const HOUR = 36e5;

async function cleanup(env) {
  const t = Date.now(), db = env.DB;
  const run = (sql, ...b) => db.prepare(sql).bind(...b).run().catch((e) => console.log("cron", sql.slice(0, 40), String(e)));
  await run("DELETE FROM sessions WHERE expires_at<?", t);
  await run("DELETE FROM tickets WHERE expires_at<?", t);
  // baris otp juga menyimpan jendela rate-limit 1 jam, jadi hapus hanya yang sudah lewat keduanya
  await run("DELETE FROM otp WHERE expires_at<? AND win_start<?", t - HOUR, t - HOUR);
  const gone = await db.prepare("SELECT id FROM stories WHERE kind='img' AND expires_at<?").bind(t).all().then((r) => r.results).catch(() => []);
  await delBlobs(env, gone.map((r) => storyKey(r.id)));
  await run("DELETE FROM stories WHERE expires_at<?", t);
  await run("DELETE FROM story_views WHERE story_id NOT IN (SELECT id FROM stories)");
  // penghitung harian/bulanan lama (d:YYYY-MM-DD:… / m:YYYY-MM:…) tidak dipakai lagi setelah lewat
  const day = new Date(t - 3 * 864e5).toISOString().slice(0, 10), mon = new Date(t - 62 * 864e5).toISOString().slice(0, 7);
  await run("DELETE FROM usage WHERE (month LIKE 'd:%' AND substr(month,3,10)<?) OR (month LIKE 'm:%' AND substr(month,3,7)<?)", day, mon);
}

export async function scheduled(event, env, ctx) {
  await cleanup(env);
  if (hasR2(env)) {
    const r = await migrateToR2(env, 100).catch((e) => ({ error: String(e) }));
    console.log("cron r2 migrate", JSON.stringify(r));
  }
}
