const hre = require("hardhat");

async function main() {
  const squeezeContractFactory = await hre.ethers.getContractFactory(
    "SqueezePortal"
  );
  const squeezeContract = await squeezeContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  await squeezeContract.deployed();
  console.log("Squeeze deployed to:", squeezeContract.address);
  let contractBalance = await hre.ethers.provider.getBalance(
    squeezeContract.address
  );

  console.log(
    "Contract balance",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const squeezeTxn1 = await squeezeContract.squeeze("This is squeeze #1");
  await squeezeTxn1.wait();
  const squeezeTxn2 = await squeezeContract.squeeze("This is squeeze #2");
  await squeezeTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(
    squeezeContract.address
  );

  let squeezeCount = await squeezeContract.getTotalSqueezes();
  await squeezeCount.wait();
  console.log(squeezeCount);

  let allSqueezes = await squeezeContract.getAllSqueezes();
  await allSqueezes.wait();
  console.log(allSqueezes);
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
