import { PinataSDK } from 'pinata';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const GATEWAY_URL = 'rose-hollow-mollusk-554.mypinata.cloud';

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: GATEWAY_URL,
});

export const pinataService = {
  async main(cid) {
    try {
      console.log('Starting fetch from gateway:', new Date().toISOString());
      
      // Get the data directly from Pinata gateway
      const metadata = await pinata.gateways.get(cid);
      console.log('Received metadata:', new Date().toISOString());

      if (!metadata) {
        throw new Error('No metadata found');
      }

      // Create a signed URL for the image that will be valid for 30 minutes
      let imageUrl = '';
      if (metadata.imageHash) {
        imageUrl = await pinata.gateways.createSignedURL({
          cid: metadata.imageHash,
          expires: 1800 // 30 minutes
        });
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