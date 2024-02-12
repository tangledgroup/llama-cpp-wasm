const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

const host = '0.0.0.0';
const port = 8080;

// Path to your certificate and key files
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Middleware to set required headers for SharedArrayBuffer access
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Serve static files from the 'public' directory
app.use(express.static('.'));

// Create an HTTPS server with your custom certificate and key
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, host, () => {
  console.log(`HTTPS server listening at https://${host}:${port}`);
});
