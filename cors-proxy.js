// cors-proxy.js

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: 'Missing url query param' });

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');
    const body = await response.text();

    res.set('content-type', contentType);
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target URL' });
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy running on port ${PORT}`);
});
