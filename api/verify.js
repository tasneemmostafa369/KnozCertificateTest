export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sspId = req.query.sspId;

  if (!sspId) {
    return res.status(400).json({ error: 'Bad Request: Missing sspId' });
  }

  const username = process.env.KNOZ_API_USERNAME;
  const password = process.env.KNOZ_API_PASSWORD;

  if (!username || !password) {
    console.error('Server configuration error: Missing credentials in .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 1. Login to get the token
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

    if (!token) {
      return res.status(500).json({ error: 'Failed to retrieve token' });
    }

    // 2. Fetch the certificate details
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
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
