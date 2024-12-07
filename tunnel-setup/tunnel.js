const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

// Generate a random token for this session
const AUTH_TOKEN = Math.random().toString(36).substring(7);

async function setupProxy() {
  app.use(cors());
  app.use(express.json());

  // Log requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Basic auth middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    
    // Skip auth for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // IPFS proxy with authentication
  const ipfsProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:5001',
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      // Remove problematic headers
      proxyReq.removeHeader('authorization');
      proxyReq.removeHeader('www-authenticate');
      
      // Add custom headers
      proxyReq.setHeader('X-Custom-Auth', 'true');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Set CORS headers
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-methods'] = 'GET,POST,OPTIONS';
      proxyRes.headers['access-control-allow-headers'] = '*';
      
      // Remove auth headers that might cause issues
      delete proxyRes.headers['www-authenticate'];
      delete proxyRes.headers['proxy-authenticate'];
    },
    pathRewrite: {
      '^/api/v0': '/api/v0'
    }
  });

  // Mount proxy
  app.use('/api/v0', ipfsProxy);

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Proxy Error:', err);
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
    
    // Use debug mode with localtunnel
    const tunnel = exec(
      `export DEBUG="localtunnel:*" && npx localtunnel --port ${port} --subdomain blockchain-education-ipfs`, 
      {
        env: {
          ...process.env,
          DEBUG: 'localtunnel:*'
        }
      }
    );

    tunnel.stdout.on('data', (data) => {
      console.log('Tunnel output:', data);
      if (data.includes('your url is:')) {
        const url = data.split('your url is: ')[1].trim();
        console.log('\n=== IPFS Tunnel Started ===');
        console.log('Local URL: http://localhost:5002');
        console.log('Tunnel URL:', url);
        console.log('\nUse this URL in your Vercel env:', url);
        console.log('===========================\n');
      }
    });

    tunnel.stderr.on('data', (data) => {
      console.error('Tunnel error:', data);
    });

    tunnel.on('close', (code) => {
      console.log('Tunnel closed with code:', code);
      console.log('Restarting tunnel...');
      setTimeout(startTunnel, 1000);
    });

  } catch (err) {
    console.error('Error:', err);
    setTimeout(startTunnel, 5000);
  }
}

// Install dependencies if needed
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