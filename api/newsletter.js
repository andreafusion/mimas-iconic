export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const email = (body.email || '').trim();

  if (!email) return res.status(400).json({ error: 'Missing email' });

  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;

  if (!apiKey || !listId) {
    return res.status(500).json({ error: 'Server not configured (missing env vars)' });
  }

  const r = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: email,
      status: 'SUBSCRIBED',
      tags: ['iconic-duality', 'website-popup']
    })
  });

  const data = await r.json().catch(() => null);
  if (!r.ok) return res.status(r.status).json({ error: 'EmailOctopus error', details: data });

  return res.status(200).json({ ok: true });
}
