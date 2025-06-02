// scripts/mintToAccount.js
require("dotenv").config();
const { ethers } = require("ethers");
const config = require("../config"); 

async function main() {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl); // Ethers v6 JsonRpcProvider
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const TEST_TOKEN_ADDRESS = config.testTokenAddress;
    const SIMPLE_ACCOUNT_ADDRESS = config.simpleAccountAddress;

    const ERC20_ABI = [
        "function mint(address to, uint256 amount)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address account) view returns (uint256)" 
    ];

    // Token sözleşmesini signer ile bağlıyoruz ki mint işlemi yapılabilir olsun.
    const testTokenContract = new ethers.Contract(TEST_TOKEN_ADDRESS, ERC20_ABI, signer); 

    const mintAmount = ethers.parseUnits("1000", await testTokenContract.decimals()); // 1000 token mint ediyoruz

    console.log(`Minting ${ethers.formatUnits(mintAmount, await testTokenContract.decimals())} TestToken to SimpleAccount (${SIMPLE_ACCOUNT_ADDRESS})...`);
    const tx = await testTokenContract.mint(SIMPLE_ACCOUNT_ADDRESS, mintAmount);
    await tx.wait();
    console.log(" Mint işlemi başarılı! Transaction Hash:", tx.hash);

    // Bakiye kontrolünü tekrar deneyecek
    const simpleAccountTokenBalance = await testTokenContract.balanceOf(SIMPLE_ACCOUNT_ADDRESS);
    console.log(` SimpleAccount'taki güncel token bakiyesi: ${ethers.formatUnits(simpleAccountTokenBalance, await testTokenContract.decimals())}`);
}

main().catch(console.error);