import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sspId = req.query.sspId as string;
  const token = req.cookies.verification_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing verification token' });
  }

  if (!sspId) {
    return res.status(400).json({ error: 'Bad Request: Missing sspId' });
  }

  try {
    const detailsRes = await fetch(`https://knoz-api.knoz.online/api/Monitor/Assigned-Student-Course-Details?SSPId=${sspId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!detailsRes.ok) {
      return res.status(detailsRes.status).json({ error: 'Failed to fetch certificate details' });
    }

    const detailsData = await detailsRes.json();
    return res.status(200).json(detailsData);
  } catch (error) {
    console.error('Proxy Fetch Details Error:', error);
    return res.status(500).json({ error: 'Failed to fetch details internally' });
  }
}
