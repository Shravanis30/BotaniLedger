const hre = require("hardhat");

async function main() {
  console.log("Deploying BotaniLedger...");
  const BotaniLedger = await hre.ethers.getContractFactory("BotaniLedger");
  const botaniLedger = await BotaniLedger.deploy();

  await botaniLedger.waitForDeployment();
  const address = await botaniLedger.getAddress();

  console.log(`BotaniLedger deployed to: ${address}`);
  
  // Example: Granting roles to initial addresses
  // const [deployer, farmer, lab, manufacturer] = await hre.ethers.getSigners();
  // const FARMER_ROLE = await botaniLedger.FARMER_ROLE();
  // await botaniLedger.grantRole(FARMER_ROLE, farmer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
