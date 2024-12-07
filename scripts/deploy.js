const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");

    // Get the contract factory
    const AcademicCredentials = await hre.ethers.getContractFactory("AcademicCredentials");
    
    // Deploy the contract
    console.log("Deploying AcademicCredentials...");
    const academicCredentials = await AcademicCredentials.deploy();
    // Wait for the deployment transaction to be mined
    await academicCredentials.waitForDeployment();

    // Get the deployed contract address
    const address = await academicCredentials.getAddress();
    console.log(`AcademicCredentials deployed to: ${address}`);

    // Get deployer address
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Contract deployed by: ${deployer.address}`);

    // Register the deployer as an institution (for testing purposes)
    console.log("Registering deployer as institution...");
    const tx = await academicCredentials.registerInstitution(deployer.address);
    await tx.wait();
    console.log("Deployer registered as institution");

    // Log important information for frontend configuration
    console.log("\n=== Deployment Information ===");
    console.log("Contract Address:", address);
    console.log("Owner Address:", deployer.address);
    console.log("Network:", hre.network.name);
    console.log("=== Save these addresses for your frontend .env! ===\n");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 