const GATEWAY_URL = 'rose-hollow-mollusk-554.mypinata.cloud';
const GATEWAY_TOKEN = import.meta.env.VITE_GATEWAY_KEY;
const PUBLIC_GATEWAY = 'https://ipfs.io/ipfs/';

export const pinataService = {
  async main(cid) {
    try {
      console.log('Starting fetch from gateway:', new Date().toISOString());
      
      // Try public gateway first
      const response = await fetch(`${PUBLIC_GATEWAY}${cid}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }

      const metadata = await response.json();
      console.log('Received metadata:', new Date().toISOString());

      if (!metadata) {
        throw new Error('No metadata found');
      }

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