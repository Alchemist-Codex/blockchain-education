const hre = require("hardhat");

/**
 * Main deployment function for the AcademicCredentials smart contract
 */
async function main() {
  try {
    console.log("Starting deployment...");

    // Get the contract factory for AcademicCredentials
    const AcademicCredentials = await hre.ethers.getContractFactory("AcademicCredentials");
    
    // Deploy the contract to the network
    console.log("Deploying AcademicCredentials...");
    const academicCredentials = await AcademicCredentials.deploy();
    // Wait until the deployment transaction is confirmed
    await academicCredentials.waitForDeployment();

    // Retrieve the deployed contract's address
    const address = await academicCredentials.getAddress();
    console.log(`AcademicCredentials deployed to: ${address}`);

    // Get the address of the account that deployed the contract
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Contract deployed by: ${deployer.address}`);

    // For testing purposes, register the deployer as an institution
    console.log("Registering deployer as institution...");
    const tx = await academicCredentials.registerInstitution(deployer.address);
    await tx.wait(); // Wait for the registration transaction to be confirmed
    console.log("Deployer registered as institution");

    // Output important deployment information for frontend configuration
    console.log("\n=== Deployment Information ===");
    console.log("Contract Address:", address);
    console.log("Owner Address:", deployer.address);
    console.log("Network:", hre.network.name);
    console.log("=== Save these addresses for your frontend .env! ===\n");

  } catch (error) {
    // Log any errors that occur during deployment and exit with error code
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Execute the deployment script
main()
  .then(() => process.exit(0)) // Exit successfully if deployment succeeds
  .catch((error) => {
    console.error(error);
    process.exit(1); // Exit with error code if deployment fails
  }); 