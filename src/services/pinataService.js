const GATEWAY_URL = 'rose-hollow-mollusk-554.mypinata.cloud';
const GATEWAY_TOKEN = import.meta.env.VITE_GATEWAY_KEY;
const PUBLIC_GATEWAY = 'https://ipfs.io/ipfs/';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export const pinataService = {
  async main(cid) {
    try {
      console.log('Starting fetch from gateway:', new Date().toISOString());
      
      // Try multiple gateway options with CORS proxy
      const gateways = [
        // Option 1: Public IPFS gateway with CORS proxy
        `${CORS_PROXY}${encodeURIComponent(`${PUBLIC_GATEWAY}${cid}`)}`,
        // Option 2: Pinata gateway with token
        `https://${GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${GATEWAY_TOKEN}`,
        // Option 3: Cloudflare IPFS gateway
        `https://cloudflare-ipfs.com/ipfs/${cid}`
      ];

      let metadata = null;
      let error = null;

      // Try each gateway until one works
      for (const gateway of gateways) {
        try {
          const response = await fetch(gateway, {
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            metadata = await response.json();
            break;
          }
        } catch (e) {
          error = e;
          console.warn(`Gateway ${gateway} failed:`, e);
          continue;
        }
      }

      if (!metadata) {
        throw error || new Error('Failed to fetch metadata from all gateways');
      }

      console.log('Received metadata:', new Date().toISOString());

      // Use Pinata gateway for images since they're loaded directly by img tag
      let imageUrl = '';
      if (metadata.imageHash) {
        imageUrl = `https://${GATEWAY_URL}/ipfs/${metadata.imageHash}?pinataGatewayToken=${GATEWAY_TOKEN}`;
      }

      return {
        credentialType: metadata.credentialType,
        institution: metadata.institution,
        issueDate: metadata.issueDate,
        studentName: metadata.studentName,
        studentAddress: metadata.studentAddress,
        issuerAddress: metadata.issuerAddress,
        imageHash: metadata.imageHash,
        imageUrl: imageUrl
      };

    } catch (error) {
      console.error('Pinata service error:', error);
      throw error;
    }
  }
};