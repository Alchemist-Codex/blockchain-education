const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export const pinataService = {
  async main(metadataCid) {
    try {
      console.log('Fetching metadata CID:', metadataCid);
      
      // Directly fetch the metadata content
      const response = await fetch(`${PINATA_GATEWAY}${metadataCid}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metadata from Pinata gateway');
      }

      const metadata = await response.json();
      console.log('Fetched metadata:', metadata);
      
      return {
        credentialType: metadata.credentialType,
        institution: metadata.institution,
        issueDate: metadata.issueDate,
        studentName: metadata.studentName,
        studentAddress: metadata.studentAddress,
        issuerAddress: metadata.issuerAddress,
        imageHash: metadata.imageHash,
        imageUrl: metadata.imageUrl,
        metadataHash: metadataCid
      };

    } catch (error) {
      console.error('Pinata service error:', error);
      throw error;
    }
  }
}; 