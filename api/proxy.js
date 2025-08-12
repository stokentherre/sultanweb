import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Missing url param' });
    }

    // Validate URL (basic check)
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid url param' });
    }

    // Fetch target URL with original headers (except Host, etc.)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProxyServer/1.0)',
        Accept: 'application/json',
      },
    });

    // Forward status code and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') return; // avoid encoding issues
      res.setHeader(key, value);
    });

    // Stream the response body
    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
