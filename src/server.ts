import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
dotenv.config();

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.set('trust proxy', true); // Trust the proxy to handle x-forwarded-host correctly
app.use(express.json()); // Add JSON body parser for API
app.use(cookieParser()); // Parse cookies
const angularApp = new AngularNodeAppEngine();

/**
 * Custom API for Verification Login (Server-Side Proxy)
 * This hides the sensitive credentials from the browser.
 */
app.post('/api/verification-login', async (req, res): Promise<void> => {
  const username = process.env['VERIFICATION_API_USERNAME'];
  const password = process.env['VERIFICATION_API_PASSWORD'];

  if (!username || !password) {
    console.error('Server configuration error: Missing credentials in .env');
    res.status(500).json({ error: 'Server configuration error' });
    return;
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
      res.status(loginRes.status).json({ error: 'Failed to authenticate with external service' });
      return;
    }

    const data = await loginRes.json();
    
    // Send the token in an HttpOnly cookie so it's not accessible to JS
    const token = data?.record?.token;
    if (token) {
      res.cookie('verification_token', token, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });
    }

    // Do NOT send the token in the JSON response
    res.json({ success: true, message: 'Verified successfully' });
  } catch (error) {
    console.error('Proxy Verification Login Error:', error);
    res.status(500).json({ error: 'Verification failed internally' });
  }
});

/**
 * Custom API for Fetching Certificate Details
 * Reads the HttpOnly cookie and sends the Bearer token securely.
 */
app.get('/api/verification-details', async (req, res): Promise<void> => {
  const sspId = req.query['sspId'];
  const token = req.cookies['verification_token'];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing verification token' });
    return;
  }

  if (!sspId) {
    res.status(400).json({ error: 'Bad Request: Missing sspId' });
    return;
  }

  try {
    const detailsRes = await fetch(`https://knoz-api.knoz.online/api/Monitor/Assigned-Student-Course-Details?SSPId=${sspId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!detailsRes.ok) {
      res.status(detailsRes.status).json({ error: 'Failed to fetch certificate details' });
      return;
    }

    const detailsData = await detailsRes.json();
    res.json(detailsData);
  } catch (error) {
    console.error('Proxy Fetch Details Error:', error);
    res.status(500).json({ error: 'Failed to fetch details internally' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
