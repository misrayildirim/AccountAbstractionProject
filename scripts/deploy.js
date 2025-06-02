const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // TestToken deploy (SADELEŞTİRİLDİ: initial supply yok!)
  const TestToken = await ethers.getContractFactory("TestToken");
const testToken = await TestToken.deploy("TestUSDC", "tUSDC", deployer.address);
await testToken.waitForDeployment();
console.log("TestToken deployed to:", await testToken.getAddress());


  // EntryPoint adresi (sabittir)
  const ENTRY_POINT = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
  console.log("EntryPoint Address:", ENTRY_POINT);

  // SimpleAccount deploy
  const SimpleAccount = await ethers.getContractFactory("SimpleAccount");
  const simpleAccount = await SimpleAccount.deploy(ENTRY_POINT);
  await simpleAccount.waitForDeployment();
  console.log("SimpleAccount deployed to:", await simpleAccount.getAddress());

  // Paymaster deploy
  const PaymasterContract = await ethers.getContractFactory("Paymaster");
  const paymaster = await PaymasterContract.deploy(ENTRY_POINT); // IEntryPoint type olarak

  await paymaster.waitForDeployment();
  console.log("Paymaster deployed to:", await paymaster.getAddress());

  // Paymaster'a 0.001 ETH gönderiliyor
  const tx = await deployer.sendTransaction({
    to: await paymaster.getAddress(),
    value: ethers.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Paymaster funded with 0.001 ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
