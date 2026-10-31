/* Penyimpanan file biner (foto chat, voice note, story) di R2.
 * Baris lama yang masih menyimpan base64 di kolom `data` D1 tetap terbaca (fallback),
 * dan bisa dipindah ke R2 lewat POST /api/admin/r2/migrate. Kalau binding FILES belum ada,
 * semuanya jalan seperti dulu (base64 di D1), jadi deploy tidak memutus fitur. */

export const hasR2 = (env) => !!env.FILES;
export const mediaKey = (id) => "media/" + id;
export const storyKey = (id) => "stories/" + id;

export const b64ToBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export async function putBlob(env, key, b64, mime) {
  await env.FILES.put(key, b64ToBytes(b64), { httpMetadata: { contentType: mime } });
}

// isi file sebagai byte (dipakai transkripsi voice note)
export async function blobBytes(env, key, legacy) {
  if (legacy) return b64ToBytes(legacy);
  if (!hasR2(env)) return null;
  const o = await env.FILES.get(key);
  return o ? new Uint8Array(await o.arrayBuffer()) : null;
}

// respons HTTP untuk file; null = tidak ada
export async function blobResponse(env, key, legacy, mime, cache) {
  const headers = { "content-type": mime, "cache-control": cache };
  if (legacy) return new Response(b64ToBytes(legacy), { headers });
  if (!hasR2(env)) return null;
  const o = await env.FILES.get(key);
  if (!o) return null;
  return new Response(o.body, { headers: { ...headers, etag: o.httpEtag } });
}

export async function delBlobs(env, keys) {
  if (!hasR2(env) || !keys.length) return;
  for (let i = 0; i < keys.length; i += 1000) await env.FILES.delete(keys.slice(i, i + 1000));
}

// pindahkan base64 lama dari D1 ke R2, per batch
export async function migrateToR2(env, limit) {
  if (!hasR2(env)) return { error: "r2" };
  const n = Math.max(1, Math.min(200, parseInt(limit) || 50));
  let media = 0, stories = 0;
  const m = (await env.DB.prepare("SELECT id,mime,data FROM media WHERE data<>'' LIMIT ?").bind(n).all()).results;
  for (const r of m) {
    await putBlob(env, mediaKey(r.id), r.data, r.mime);
    await env.DB.prepare("UPDATE media SET data='' WHERE id=?").bind(r.id).run();
    media++;
  }
  const s = (await env.DB.prepare("SELECT id,mime,data FROM stories WHERE kind='img' AND data<>'' LIMIT ?").bind(n).all()).results;
  for (const r of s) {
    await putBlob(env, storyKey(r.id), r.data, r.mime);
    await env.DB.prepare("UPDATE stories SET data='' WHERE id=?").bind(r.id).run();
    stories++;
  }
  const left = await env.DB.prepare("SELECT (SELECT COUNT(*) FROM media WHERE data<>'') + (SELECT COUNT(*) FROM stories WHERE kind='img' AND data<>'') AS n").first();
  return { ok: true, media, stories, left: left.n };
}
