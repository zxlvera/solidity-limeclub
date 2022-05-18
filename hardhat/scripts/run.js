const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const squeezeContractFactory = await hre.ethers.getContractFactory("Squeeze");
  const squeezeContract = await squeezeContractFactory.deploy();

  await squeezeContract.deployed();

  console.log("Squeeze deployed to:", squeezeContract.address);
  console.log("Owner", owner.address);

  let squeezeCount;
  squeezeCount = await waveContract.getTotalSqueeze();

  let squeezeTxn = await squeezeContract.squeeze();
  await squeezeTxn.wait();

  squeezeCount = await squeezeContract.getTotalSqueeze();
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
