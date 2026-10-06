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

app.get('/api/branding', (req, res) => {
  res.json({
    academyNameAr: process.env.ACADEMY_NAME_AR || 'أكاديمية كنوز',
    academyNameEn: process.env.ACADEMY_NAME_EN || 'Knoz Academy',
    logoUrl: process.env.ACADEMY_LOGO_URL || '/assets/logo.jpeg',
    signatureUrl: process.env.ACADEMY_SIGNATURE_URL || '/assets/Signature.png',
    signatoryNameAr: process.env.ACADEMY_SIGNATORY_NAME_AR || '',
    signatoryNameEn: process.env.ACADEMY_SIGNATORY_NAME_EN || '',
    signatoryTitleAr: process.env.ACADEMY_SIGNATORY_TITLE_AR || 'المدير الأكاديمي',
    signatoryTitleEn: process.env.ACADEMY_SIGNATORY_TITLE_EN || 'Academic Director',
    primaryColor: process.env.ACADEMY_PRIMARY_COLOR || '#0F392B',
    secondaryColor: process.env.ACADEMY_SECONDARY_COLOR || '#C8A559'
  });
});

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
