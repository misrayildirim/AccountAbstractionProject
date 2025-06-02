require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Cüzdan oluşturulur ve provider'a bağlanır

        // Mint edilecek token ve alıcı adresleri
    const TEST_TOKEN_ADDRESS = "0xd0759d7BeeC8F38f697Bc1f78D71F04052519F34";
    const SIMPLE_ACCOUNT_ADDRESS = "0xE5445A7AacE30FF969ff8A3FDf4f4ee542ea101E";

    const tokenAbi = [
        "function mint(address to, uint256 amount) public",
        "function decimals() public view returns (uint8)"
    ];
    
    const token = new ethers.Contract(TEST_TOKEN_ADDRESS, tokenAbi, signer);
    const decimals = await token.decimals(); // Tokenun ondalık basamak sayısını alıyoruz
    const amount = ethers.utils.parseUnits("1000", decimals);   // 1000 token mint edilecek(ondalık basamağa göre)

    const tx = await token.mint(SIMPLE_ACCOUNT_ADDRESS, amount);
    console.log("Mint işlemi gönderildi. Tx hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Mint işlemi tamamlandı. Receipt:", receipt.transactionHash);
}

main().catch(console.error);
