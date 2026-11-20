const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function handleRequest(req, res) {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(BASE_DIR, reqPath);
  if (!filePath.startsWith(BASE_DIR)) {
    console.log(`[403] ${req.method} ${req.url}`);
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`[404] ${req.method} ${req.url} -> ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    console.log(`[200] ${req.method} ${req.url} (${contentType})`);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server1 = http.createServer(handleRequest);
server1.listen(3000, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:3000/ and http://127.0.0.1:3000/`);
});

const server2 = http.createServer(handleRequest);
server2.listen(8080, '0.0.0.0', () => {
  console.log(`Server also listening on http://localhost:8080/ and http://127.0.0.1:8080/`);
});
