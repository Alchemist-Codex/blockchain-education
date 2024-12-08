const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const pinataService = {
  async getMetadata(hash) {
    try {
      const response = await fetch(`https://api.pinata.cloud/data/pinList?status=pinned&hashContains=${hash}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Pinata');
      }

      const data = await response.json();
      if (data.rows && data.rows.length > 0) {
        const metadata = data.rows[0].metadata;
        return metadata;
      }
      
      throw new Error('Content not found on Pinata');
    } catch (error) {
      console.error('Pinata service error:', error);
      throw error;
    }
  }
}; 