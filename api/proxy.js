export default async function handler(req, res) {
  const baseUrl = (process.env.KNOZ_API_BASE_URL || '').replace(/\/+$/, '');

  if (!baseUrl) {
    console.error('Server configuration error: Missing KNOZ_API_BASE_URL in Environment Variables');
    return res.status(500).json({ error: 'Server configuration error: Missing API Base URL' });
  }

  // Extract path after /api/proxy/
  let subPath = '';
  if (req.query && req.query.path) {
    subPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  } else {
    const match = req.url.match(/\/api\/proxy\/(.+?)(\?|$)/);
    subPath = match ? match[1] : '';
  }

  // Strip query param 'path' if present from query string forwarded to target
  let queryString = '';
  if (req.url && req.url.includes('?')) {
    const searchParams = new URLSearchParams(req.url.slice(req.url.indexOf('?') + 1));
    searchParams.delete('path');
    const remainingQuery = searchParams.toString();
    if (remainingQuery) {
      queryString = `?${remainingQuery}`;
    }
  }

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

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
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
}
