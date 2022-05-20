const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", accountBalance.toString());

  const squeezeContractFactory = await hre.ethers.getContractFactory(
    "SqueezePortal"
  );
  const squeezeContract = await squeezeContractFactory.deploy();
  await squeezeContract.deployed();

  console.log("Squeeze deployed to:", squeezeContract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
