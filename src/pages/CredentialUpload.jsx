import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../contexts/Web3Context'
import { toast } from 'react-hot-toast'
import { ipfsService } from '../services/ipfsService'
import BlockchainVideo from '../components/BlockchainVideo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * CredentialUpload Component
 * Handles the upload and issuance of academic credentials to the blockchain
 */

function generateShortFriendlyId(prefix = "user") {
  const words = ["brave", "bright", "calm", "clever", "kind", "swift", "lion", "fox", "hawk", "owl"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const uniquePart = Math.random().toString(36).substring(2, 5); // 3-char random alphanumeric
  return `${prefix}-${randomWord}-${uniquePart}`;
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy to clipboard');
    console.error('Failed to copy:', err);
  }
};

const CredentialUpload = () => {
  const { account, contract } = useWeb3();
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    credentialType: '',
    institution: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.file) {
      toast.error('Please upload a certificate file first');
      return;
    }
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!contract) {
      toast.error('Smart contract not initialized');
      return;
    }

    try {
      setIsSubmitting(true);
      const { hash, url } = await ipfsService.uploadImage(formData.file);
      const metadata = {
        studentName: formData.studentName,
        studentAddress: formData.studentAddress,
        credentialType: formData.credentialType,
        institution: formData.institution,
        imageHash: hash,
        imageUrl: url,
        issueDate: new Date().toISOString()
      };

      // Upload metadata to IPFS
      const metadataHash = await ipfsService.uploadJSON(metadata);

      // Generate certificate hash
      const certificateString = JSON.stringify(metadata);
      const encoder = new TextEncoder();
      const data = encoder.encode(certificateString);
      const certificateHash = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(certificateHash));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Record on blockchain
      const tx = await contract.issueCredential(
        formData.studentAddress,
        hashHex,
        hash,
        metadataHash
      );

      await tx.wait();
      toast.success('Certificate issued successfully!');
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error(`Failed to issue certificate: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* Your JSX code for rendering the form */}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CredentialUpload 