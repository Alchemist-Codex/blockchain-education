const localtunnel = require('localtunnel');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

async function setupProxy() {
  // Enable CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Add OPTIONS handling
  app.options('*', cors());

  // Basic auth middleware (optional)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  // Proxy middleware configuration
  const proxyMiddleware = createProxyMiddleware({
    target: 'http://127.0.0.1:5001',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/api/v0': '/api/v0'
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      delete proxyRes.headers['www-authenticate'];
    },
    onError: function(err, req, res) {
      console.error('Proxy Error:', err);
      res.status(500).send('Proxy Error');
    }
  });

  // Use the proxy middleware
  app.use('/api/v0', proxyMiddleware);

  // Start the proxy server
  const port = 5002;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server running on port ${port}`);
  });

  return port;
}

async function startTunnel() {
  try {
    const proxyPort = await setupProxy();
    
    const tunnel = await localtunnel({ 
      port: proxyPort,
      subdomain: 'blockchain-education-ipfs'
    });

    console.log('\n=== IPFS Tunnel Started ===');
    console.log('Tunnel URL:', tunnel.url);
    console.log('Proxy Port:', proxyPort);
    console.log('\nVercel env should be:', tunnel.url);
    console.log('===========================\n');

    tunnel.on('close', () => {
      console.log('\nTunnel closed, restarting...');
      setTimeout(startTunnel, 1000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      setTimeout(startTunnel, 1000);
    });

  } catch (err) {
    console.error('Failed to create tunnel:', err);
    setTimeout(startTunnel, 5000);
  }
}

// Install dependencies if needed
console.log('Checking dependencies...');
try {
  require('express');
  require('http-proxy-middleware');
  require('cors');
} catch (err) {
  console.error('\nInstalling dependencies...');
  require('child_process').execSync('npm install express http-proxy-middleware cors', {
    stdio: 'inherit'
  });
  console.log('Dependencies installed!\n');
}

console.log('Starting IPFS tunnel with proxy...');
startTunnel();