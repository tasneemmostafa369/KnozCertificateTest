const SSP_ALPHA_TO_DIGIT = {
  'A': '0', 'B': '1', 'C': '2', 'D': '3', 'E': '4',
  'F': '5', 'G': '6', 'H': '7', 'I': '8', 'J': '9'
};

function decodeSspId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // If already purely digits (e.g. numeric ID)
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  // Validate cipher format rules
  if (/^\d/.test(trimmed)) return null; // Starts with num
  if (/[a-zA-Z]$/.test(trimmed)) return null; // Ends with alpha
  if (/[a-zA-Z]{2,}/.test(trimmed)) return null; // Alpha + Alpha
  if (/\d{2,}/.test(trimmed)) return null; // Num + Num
  if (trimmed.length % 2 !== 0) return null; // Must be even pairs

  let extracted = '';
  for (let i = 0; i < trimmed.length; i += 2) {
    const alpha = trimmed[i].toUpperCase();
    const digit = trimmed[i + 1];

    if (!(alpha in SSP_ALPHA_TO_DIGIT)) return null;
    if (!/^\d$/.test(digit)) return null;
    if (SSP_ALPHA_TO_DIGIT[alpha] !== digit) return null;

    extracted += digit;
  }

  return extracted;
}

export default async function handler(req, res) {
  const rawSspId = req.query.sspId;

  if (!rawSspId) {
    return res.status(400).json({ error: 'Bad Request: Missing sspId' });
  }

  const sspId = decodeSspId(rawSspId);
  if (!sspId) {
    return res.status(400).json({ error: 'Bad Request: Invalid or corrupted sspId format', invalid: true });
  }

  const username = process.env.KNOZ_API_USERNAME;
  const password = process.env.KNOZ_API_PASSWORD;
  const baseUrl = (process.env.KNOZ_API_BASE_URL || '').replace(/\/+$/, '');

  if (!username || !password || !baseUrl) {
    console.error('Server configuration error: Missing credentials or KNOZ_API_BASE_URL in Environment Variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 1. Login to get the token
    const loginRes = await fetch(`${baseUrl}/api/Auth/login`, {
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
    const detailsRes = await fetch(`${baseUrl}/api/Monitor/Assigned-Student-Course-Details?SSPId=${sspId}`, {
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
