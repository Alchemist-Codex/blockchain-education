const localtunnel = require('localtunnel');

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ 
      port: 5001,
      subdomain: 'blockchain-education'
    });

    console.log('Tunnel URL:', tunnel.url);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });

  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
}

startTunnel();