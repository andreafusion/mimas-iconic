export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const booking = body.data || body.bookingData || {};

  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;

  if (!apiKey || !listId) {
    return res.status(500).json({ error: 'Server not configured (missing env vars)' });
  }

  if (!booking.email || !booking.name || !booking.phone || !booking.date || !booking.time || !booking.serviceName) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  // 1) Guardar / notificar via EmailOctopus (como “registro”)
  const r = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: booking.email,
      status: 'SUBSCRIBED',
      tags: ['booking', booking.service || 'service-unknown'],
      fields: {
        FirstName: String(booking.name).split(' ')[0] || '',
        LastName: String(booking.name).split(' ').slice(1).join(' ') || '',
        Service: booking.serviceName || '',
        AppointmentDate: booking.date || '',
        AppointmentTime: booking.time || '',
        Phone: booking.phone || '',
        Notes: booking.notes || ''
      }
    })
  });

  const data = await r.json().catch(() => null);
  if (!r.ok) return res.status(r.status).json({ error: 'EmailOctopus error', details: data });

  // 2) (Opcional) webhook extra (Make/Zapier) si lo configuras
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'booking', data: booking, timestamp: new Date().toISOString() })
    }).catch(() => {});
  }

  return res.status(200).json({ ok: true });
}
