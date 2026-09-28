import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env file if available
try {
  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
  }
} catch (e) {
  // Ignore if already loaded or not supported
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use((req, res, next) => { console.log(req.method, req.url); next(); });

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

app.all('/api/proxy/*', async (req, res) => {
  const baseUrl = (process.env.KNOZ_API_BASE_URL || '').replace(/\/+$/, '');

  if (!baseUrl) {
    console.error('Server configuration error: Missing KNOZ_API_BASE_URL in Environment Variables');
    return res.status(500).json({ error: 'Server configuration error: Missing API Base URL' });
  }

  const subPath = req.params[0] || req.path.replace(/^\/api\/proxy\/?/, '');
  const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `${baseUrl}/api/${subPath}${queryString}`;

  try {
    const headers = {};
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'];
    }
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    } else if (req.method !== 'GET' && req.method !== 'HEAD') {
      headers['content-type'] = 'application/json';
    }

    const options = {
      method: req.method,
      headers: headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const proxyRes = await fetch(targetUrl, options);
    const contentType = proxyRes.headers.get('content-type') || '';

    res.status(proxyRes.status);
    if (contentType.includes('application/json')) {
      const data = await proxyRes.json();
      return res.json(data);
    } else {
      const text = await proxyRes.text();
      return res.send(text);
    }
  } catch (err) {
    console.error(`Proxy error forwarding to ${targetUrl}:`, err);
    return res.status(500).json({ error: 'Internal server proxy error' });
  }
});

app.get('/api/verify', async (req, res) => {
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
    console.error('Server configuration error: Missing credentials or KNOZ_API_BASE_URL in Environment');
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
});

app.get(['/certificates/Verification/:sspId', '/certificates/verification/:sspId'], (req, res) => {
  res.redirect(302, `https://knoz-verification.vercel.app/${req.params.sspId}`);
});

app.use(express.static(path.join(__dirname, 'dist/knoz-academy/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/knoz-academy/browser/index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:3000');
});
