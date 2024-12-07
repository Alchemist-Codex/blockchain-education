const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const net = require('net');

// Generate a random token for this session
const AUTH_TOKEN = Math.random().toString(36).substring(7);

// Check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

// Find an available port
async function findAvailablePort(startPort) {
  let port = startPort;
  while (await isPortInUse(port)) {
    port++;
  }
  return port;
}

async function setupProxy() {
  try {
    const port = await findAvailablePort(5002);
    
    app.use(cors());
    app.use(express.json());

    // Log requests
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // IPFS proxy
    const ipfsProxy = createProxyMiddleware({
      target: 'http://127.0.0.1:5001',
      changeOrigin: true,
      ws: true,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('authorization');
        proxyReq.removeHeader('www-authenticate');
      },
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['access-control-allow-origin'] = '*';
        proxyRes.headers['access-control-allow-methods'] = 'GET,POST,OPTIONS';
        proxyRes.headers['access-control-allow-headers'] = '*';
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
      console.error('Proxy Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    return new Promise((resolve) => {
      const server = app.listen(port, '127.0.0.1', () => {
        console.log(`Proxy server started on port ${port}`);
        resolve(port);
      });

      server.on('error', (err) => {
        console.error('Server error:', err);
      });
    });
  } catch (err) {
    console.error('Setup error:', err);
    throw err;
  }
}

async function startTunnel() {
  try {
    const port = await setupProxy();
    
    // Windows-compatible command
    const command = `npx localtunnel --port ${port} --subdomain blockchain-education-ipfs`;
    
    const tunnel = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Tunnel error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`Tunnel stderr: ${stderr}`);
      }
    });

    tunnel.stdout.on('data', (data) => {
      console.log('Tunnel output:', data);
      if (data.includes('your url is:')) {
        const url = data.split('your url is: ')[1].trim();
        console.log('\n=== IPFS Tunnel Started ===');
        console.log('Local URL: http://localhost:' + port);
        console.log('Tunnel URL:', url);
        console.log('\nUse this URL in your Vercel env:', url);
        console.log('===========================\n');
      }
    });

    tunnel.stderr.on('data', (data) => {
      console.error('Tunnel error:', data);
    });

    tunnel.on('close', async (code) => {
      console.log('Tunnel closed with code:', code);
      console.log('Restarting tunnel in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      startTunnel();
    });

  } catch (err) {
    console.error('Error:', err);
    console.log('Retrying in 5 seconds...');
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