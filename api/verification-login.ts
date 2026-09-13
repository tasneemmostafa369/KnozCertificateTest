import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const username = process.env.VERIFICATION_API_USERNAME;
  const password = process.env.VERIFICATION_API_PASSWORD;

  if (!username || !password) {
    console.error('Server configuration error: Missing credentials in .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const loginRes = await fetch('https://knoz-api.knoz.online/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail: username,
        password: password,
        appType: 0
      })
    });

    if (!loginRes.ok) {
      return res.status(loginRes.status).json({ error: 'Failed to authenticate with external service' });
    }

    const data = await loginRes.json();
    
    const token = data?.record?.token;
    if (token) {
      res.setHeader('Set-Cookie', `verification_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600000; Path=/`);
    }

    return res.status(200).json({ success: true, message: 'Verified successfully' });
  } catch (error) {
    console.error('Proxy Verification Login Error:', error);
    return res.status(500).json({ error: 'Verification failed internally' });
  }
}
