const hre = require("hardhat");
const fs = require('fs');

async function main() {
  try {
    console.log("Starting deployment...");

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Check nonce
    const nonce = await ethers.provider.getTransactionCount(deployer.address);
    console.log("Current nonce:", nonce);

    // Deploy contract
    console.log("Deploying AcademicCredentials contract...");
    const AcademicCredentials = await ethers.getContractFactory("AcademicCredentials");
    const contract = await AcademicCredentials.deploy();
    
    console.log("Waiting for deployment...");
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("Contract deployed to:", contractAddress);

    // Update .env file
    console.log("Updating environment files...");
    const envContent = `
PRIVATE_KEY=60edc3236511017a6aba96f7c1fab68c9c419ac2673c90349e4de5fa78330759
VITE_CONTRACT_ADDRESS=${contractAddress}
VITE_NETWORK_ID=1337
VITE_NETWORK_NAME=Ganache
VITE_RPC_URL=http://localhost:7545
`;

    fs.writeFileSync('.env', envContent);
    console.log("Environment files updated!");
    
  } catch (error) {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  }); 