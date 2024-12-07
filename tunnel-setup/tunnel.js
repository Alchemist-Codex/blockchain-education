const localtunnel = require('localtunnel');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

async function setupProxy() {
  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Simple request logger
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Direct proxy to IPFS
  const ipfsProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:5001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Remove authentication headers that might cause issues
      proxyReq.removeHeader('authorization');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Remove headers that might cause CORS issues
      proxyRes.headers['access-control-allow-origin'] = '*';
      delete proxyRes.headers['www-authenticate'];
    },
    pathRewrite: {
      '^/api/v0': '/api/v0'
    }
  });

  // Mount proxy
  app.use('/api/v0', ipfsProxy);

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return new Promise((resolve) => {
    const server = app.listen(5002, '127.0.0.1', () => {
      console.log('Proxy server started on port 5002');
      resolve(5002);
    });
  });
}

async function startTunnel() {
  try {
    const port = await setupProxy();
    
    const tunnel = await localtunnel({ 
      port,
      subdomain: 'blockchain-education-ipfs'
    });

    console.log('\n=== IPFS Tunnel Started ===');
    console.log('Local URL: http://localhost:5002');
    console.log('Tunnel URL:', tunnel.url);
    console.log('\nUse this URL in your Vercel env:', tunnel.url);
    console.log('===========================\n');

    tunnel.on('close', () => {
      console.log('Tunnel closed, restarting...');
      setTimeout(startTunnel, 1000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      setTimeout(startTunnel, 1000);
    });

  } catch (err) {
    console.error('Error:', err);
    setTimeout(startTunnel, 5000);
  }
}

// Check and install dependencies
try {
  require('express');
  require('http-proxy-middleware');
  require('cors');
} catch (err) {
  console.log('Installing dependencies...');
  require('child_process').execSync('npm install express http-proxy-middleware cors', {
    stdio: 'inherit'
  });
}

console.log('Starting IPFS tunnel...');
startTunnel();