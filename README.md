# Blockchain-Based Academic Credential System  
A decentralized platform to securely store, manage, and verify academic credentials using blockchain technology. The system empowers students with ownership of their records, streamlines the verification process for institutions, and ensures tamper-proof documentation.

---

## **Table of Contents**  
1. [Features](#features)  
2. [Technologies Used](#technologies-used)  
3. [Setup and Installation](#setup-and-installation)  
4. [How It Works](#how-it-works)  
5. [Local Testing](#local-testing)  
6. [Deployment](#deployment)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Docker Image](#docker)  

---

## **Features**  
- **Decentralized Credential Storage:** Tamper-proof storage of academic credentials using blockchain.  
- **Student Ownership:** Students can upload and control access to their records.  
- **Cross-Border Verification:** Institutions and verifiers can validate credentials globally in seconds.  
- **Transparent and Secure:** Eliminates credential fraud and ensures data integrity.  
- **Scalable Solution:** Adaptable to different educational institutions worldwide.  

---

## **Technologies Used**  
### **Frontend:**  
- Vite (React)  
- Tailwind CSS  
- ethers.js for blockchain interactions  

### **Backend:**  
- Smart Contracts (Solidity)  
- Ethereum Blockchain (Goerli or Polygon Mumbai testnet)  

### **Tools:**  
- Ganache for local blockchain simulation  
- MetaMask for wallet interactions  
- Vercel for frontend deployment  

---

## **Setup and Installation**  
### Prerequisites:  
1. Node.js installed ([Download Node.js](https://nodejs.org/))  
2. MetaMask extension in your browser ([Install MetaMask](https://metamask.io/))  
3. Ganache for local blockchain testing ([Download Ganache](https://trufflesuite.com/ganache/))  

### Steps:  
1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/ritaban06/blockchain-education.git
   cd blockchain-education
   ```
2. **Install Dependencies:**  
   ```bash
   npm install
     ```

3. **Start the Frontend Development Server:**  
   ```bash
   npm run dev
   ```
4. **Run Ganache:**  
   - Launch Ganache to simulate a local Ethereum blockchain.  

---

## **How It Works**  
1. **Students and Institutions:**  
   - Upload credentials by entering details (e.g., Student ID, metadata) and attaching the file.  
   - The system generates a hash of the file and stores it on the blockchain.  

2. **Verifiers:**  
   - Input the Student ID and credential hash to verify the authenticity.  
   - The system validates the hash using the blockchain.  

3. **User Roles:**  
   - **Students:** Upload and share credentials securely.  
   - **Institutions:** Issue and manage credentials.  
   - **Verifiers:** Authenticate credentials quickly and globally.  

---

## **Local Testing**  
1. **Connect MetaMask to Ganache:**  
   - Add a custom RPC URL and chain ID from Ganache.  
   - Import accounts from Ganache into MetaMask for testing.  

2. **Deploy the Smart Contract Locally:**  
   - Use Truffle or Hardhat to deploy the Solidity contract on Ganache.  
   - Copy the contract address into the frontend configuration.  

3. **Run the Project:**  
   ```bash
   npm run dev
   ```
4. **Test Credential Upload and Verification:**  
   - Upload a credential through the frontend interface.  
   - Verify it using the Student ID and hash.  

---

## **Deployment**  
### **Frontend:**  
- Build and deploy the frontend on Vercel:  
  ```bash
  npm run build
  vercel deploy
  ```

### **Backend:**  
- Deploy the smart contract to a free blockchain testnet (e.g., Polygon Mumbai):  
  ```bash
  truffle migrate --network mumbai
  ```
- Update the frontend with the testnet contract address.  

---

## **Contributing**  
Contributions are welcome! Follow these steps to contribute:  
1. Fork the repository.  
2. Create a new branch (`feature/your-feature-name`).  
3. Commit your changes (`git commit -m 'Add your feature'`).  
4. Push to the branch (`git push origin feature/your-feature-name`).  
5. Open a Pull Request.  

---

## **License**  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  

--- 

## Docker

[Docker Image](docker pull ritaban06/academic-chain)

---
