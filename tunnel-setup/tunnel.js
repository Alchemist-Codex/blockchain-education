const localtunnel = require('localtunnel');
const fs = require('fs');

async function startTunnel() {
  try {
    // Use a fixed subdomain for consistency
    const tunnel = await localtunnel({ 
      port: 5001,
      subdomain: 'blockchain-education-ipfs'  // This will give you a consistent URL
    });

    console.log('\n=== IPFS Tunnel Started ===');
    console.log('Tunnel URL:', tunnel.url);
    console.log('\nMake sure this URL matches your Vercel env variable VITE_IPFS_ENDPOINT');
    console.log('Keep this terminal open to maintain the tunnel connection');
    console.log('\nVercel deployment should use:', tunnel.url);
    console.log('===========================\n');

    // Handle tunnel events
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

// Start the tunnel
console.log('Starting IPFS tunnel...');
startTunnel();