const GATEWAY_URL = 'rose-hollow-mollusk-554.mypinata.cloud';
const GATEWAY_TOKEN = import.meta.env.VITE_GATEWAY_KEY;

// Multiple IPFS gateways for redundancy
const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://dweb.link/ipfs/',
  'https://ipfs.fleek.co/ipfs/'
];

// Different CORS proxies in case one fails
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors.eu.org/'
];

export const pinataService = {
  async main(cid) {
    try {
      console.log('Starting fetch from gateway:', new Date().toISOString());
      
      let metadata = null;
      let lastError = null;

      // Try each combination of gateway and proxy with timeout
      for (const gateway of GATEWAYS) {
        for (const proxy of CORS_PROXIES) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(
              `${proxy}${encodeURIComponent(`${gateway}${cid}`)}`, 
              {
                signal: controller.signal,
                headers: {
                  'Accept': 'application/json'
                }
              }
            );

            clearTimeout(timeoutId);

            if (response.ok) {
              metadata = await response.json();
              break;
            }
          } catch (error) {
            console.warn(`Gateway ${gateway} with proxy ${proxy} failed:`, error);
            lastError = error;
            continue;
          }
        }
        if (metadata) break;
      }

      // If all proxies fail, try direct Pinata gateway
      if (!metadata) {
        try {
          const response = await fetch(`https://${GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${GATEWAY_TOKEN}`);
          if (response.ok) {
            metadata = await response.json();
          }
        } catch (error) {
          console.warn('Pinata gateway failed:', error);
          lastError = error;
        }
      }

      if (!metadata) {
        throw lastError || new Error('Failed to fetch metadata from all gateways');
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