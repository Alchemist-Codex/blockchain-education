// Dedicated Pinata gateway URL and authentication token
const GATEWAY_URL = 'rose-hollow-mollusk-554.mypinata.cloud';
const GATEWAY_TOKEN = import.meta.env.VITE_GATEWAY_KEY;

// Array of public IPFS gateways for fallback and redundancy
const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://dweb.link/ipfs/',
  'https://ipfs.fleek.co/ipfs/'
];

// Array of CORS proxy services to handle cross-origin requests
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors.eu.org/'
];

export const pinataService = {
  async uploadImage(file) {
    // Logic to upload image to IPFS
  },
  async uploadJSON(metadata) {
    // Logic to upload JSON metadata to IPFS
  },
  async main(cid) {
    try {
      console.log('Starting fetch from gateway:', new Date().toISOString());
      
      let metadata = null;
      let lastError = null;

      // Iterate through each gateway and proxy combination
      for (const gateway of GATEWAYS) {
        for (const proxy of CORS_PROXIES) {
          try {
            // Set up request timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            // Attempt to fetch metadata using current gateway and proxy
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
            // Log failure and continue to next combination
            console.warn(`Gateway ${gateway} with proxy ${proxy} failed:`, error);
            lastError = error;
            continue;
          }
        }
        if (metadata) break;
      }

      // Fallback to dedicated Pinata gateway if all public gateways fail
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

      // Throw error if all attempts fail
      if (!metadata) {
        throw lastError || new Error('Failed to fetch metadata from all gateways');
      }

      console.log('Received metadata:', new Date().toISOString());

      // Construct image URL using dedicated Pinata gateway for reliable access
      let imageUrl = '';
      if (metadata.imageHash) {
        imageUrl = `https://${GATEWAY_URL}/ipfs/${metadata.imageHash}?pinataGatewayToken=${GATEWAY_TOKEN}`;
      }

      // Return structured credential metadata with image URL
      return {
        credentialType: metadata.credentialType,
        institution: metadata.institution,
        issueDate: metadata.issueDate,
        studentName: metadata.studentName,
        studentAddress: metadata.studentAddress,
        issuerAddress: metadata.issuerAddress,
        imageHash: metadata.imageHash,
        imageUrl: imageUrl,
        originalFileName: metadata.originalFileName
      };

    } catch (error) {
      console.error('Pinata service error:', error);
      throw error;
    }
  }
};