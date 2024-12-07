const localtunnel = require('localtunnel');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// Create Express server with proxy
async function setupProxy() {
  // Enable CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Proxy middleware configuration
  const proxyMiddleware = createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v0': '/api/v0'  // keep the API path
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
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
  app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
  });

  return port;
}

async function startTunnel() {
  try {
    // Start the proxy first
    const proxyPort = await setupProxy();

    // Create tunnel to the proxy instead of directly to IPFS
    const tunnel = await localtunnel({ 
      port: proxyPort,
      subdomain: 'blockchain-education-ipfs'
    });

    console.log('\n=== IPFS Tunnel Started ===');
    console.log('Tunnel URL:', tunnel.url);
    console.log('\nMake sure this URL matches your Vercel env variable VITE_IPFS_ENDPOINT');
    console.log('Keep this terminal open to maintain the tunnel connection');
    console.log('\nVercel deployment should use:', tunnel.url);
    console.log('===========================\n');

    tunnel.on('close', () => {
      console.log('\nTunnel closed, attempting to restart...');
      setTimeout(startTunnel, 1000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      console.log('Attempting to restart tunnel...');
      setTimeout(startTunnel, 1000);
    });

  } catch (err) {
    console.error('Failed to create tunnel:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(startTunnel, 5000);
  }
}

// Install required dependencies
console.log('Checking dependencies...');
try {
  require('express');
  require('http-proxy-middleware');
  require('cors');
} catch (err) {
  console.error('\nMissing dependencies. Installing...');
  require('child_process').execSync('npm install express http-proxy-middleware cors', {
    stdio: 'inherit'
  });
  console.log('Dependencies installed successfully!\n');
}

// Start the tunnel
console.log('Starting IPFS tunnel with proxy...');
startTunnel();