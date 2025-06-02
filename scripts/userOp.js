require("dotenv").config();
const { ethers } = require("ethers");
const { SimpleAccountAPI, HttpRpcClient } = require("@account-abstraction/sdk");
//USerOperation ile token transferi yapacağız
async function main() {
    console.log("Script başladı!");
    //Alchemy Sepolia ağına bağlanıyoruz
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Cüzdan oluşturulur ve provider'a bağlanır

    const entryPointAddress = process.env.ENTRY_POINT;
    const bundlerUrl = process.env.BUNDLER_URL;

    const SIMPLE_ACCOUNT_ADDRESS = "0xE5445A7AacE30FF969ff8A3FDf4f4ee542ea101E";
    const TEST_TOKEN_ADDRESS = "0xd0759d7BeeC8F38f697Bc1f78D71F04052519F34";

    //simpleAccountın bakiyesini kontrol ediyoruz
    console.log("-Bakiye Kontrolü Başladı -");
    const simpleAccountEthBalance = await provider.getBalance(SIMPLE_ACCOUNT_ADDRESS);
    //Token Sözleşmesi için gerekli fonksiyonlar
    const ERC20_ABI = [
        "function balanceOf(address account) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function transfer(address to, uint256 amount) returns (bool)"
    ];
    const token = new ethers.Contract(TEST_TOKEN_ADDRESS, ERC20_ABI, provider);
    const [symbol, decimals, tokenBalance] = await Promise.all([ //token bilgilerini ve bakiyeyi aldık
        token.symbol(),
        token.decimals(),
        token.balanceOf(SIMPLE_ACCOUNT_ADDRESS)
    ]);

    console.log(`SimpleAccount ETH: ${ethers.utils.formatEther(simpleAccountEthBalance)} ETH`);
    console.log(`SimpleAccount ${symbol}: ${ethers.utils.formatUnits(tokenBalance, decimals)} ${symbol}`);
    console.log("-Bakiye Kontrolü Bitti-");
    // Eğer SimpleAccount'ta yeterli TestToken yoksa hata veriyoruz
    if (tokenBalance.lt(ethers.utils.parseUnits("10", decimals))) {
        console.error("HATA: SimpleAccount'ta yeterli TestToken bulunmuyor.");
        return;
    }

    const network = await provider.getNetwork();
    const bundler = new HttpRpcClient(bundlerUrl, entryPointAddress, network.chainId);

    const accountAPI = new SimpleAccountAPI({ //UserOp işlemleri için nesen oluşturuyoruz
        provider,
        entryPointAddress,
        owner: signer,
        accountAddress: SIMPLE_ACCOUNT_ADDRESS,
        bundler
    });

    const nonce = await accountAPI.getNonce().catch(() => 0);
    console.log("SimpleAccount Nonce:", nonce);

    const recipient = "0x4855F49aa6D506A152fF4Dc42647cA8933dccDa4";
    const amount = ethers.utils.parseUnits("10", decimals);

    const encoded = token.interface.encodeFunctionData("transfer", [recipient, amount]);
    const callData = await accountAPI.encodeExecute(TEST_TOKEN_ADDRESS, 0, encoded);

    const userOp = { // UserOperation nesnesi oluşturuyoruz
        sender: SIMPLE_ACCOUNT_ADDRESS,
        nonce,
        initCode: "0x",
        callData,
        callGasLimit: ethers.BigNumber.from(1_000_000),
        verificationGasLimit: ethers.BigNumber.from(800_000),
        preVerificationGas: ethers.BigNumber.from(200_000),
        maxFeePerGas: await provider.getGasPrice(),
        maxPriorityFeePerGas: ethers.utils.parseUnits("1", "gwei"),
        paymasterAndData: "0x",  // burada sıfır geçiyoruz, default paymaster kullanılsın
        signature: "0x"
    };

    console.log(" Oluşturulan UserOp:");
    console.dir(userOp, { depth: null });

    const signedUserOp = await accountAPI.signUserOp(userOp); //UserOp imzalıyoruz
    console.log(" İmzalanmış UserOp:");
    console.dir(signedUserOp, { depth: null });

    console.log(" UserOp gönderiliyor...");
    const userOpHash = await bundler.sendUserOpToBundler(signedUserOp);
    console.log(` Gönderildi. UserOp Hash: ${userOpHash}`);

    console.log(" Receipt bekleniyor...");
    const receipt = await bundler.getUserOpReceipt(userOpHash, 60_000);
    console.log(" İşlem tamamlandı:", receipt);

    if (receipt?.receipt?.transactionHash) {
        console.log(` https://sepolia.etherscan.io/tx/${receipt.receipt.transactionHash}`);
    } else if (receipt?.transactionHash) {
        console.log(` https://sepolia.etherscan.io/tx/${receipt.transactionHash}`);
    } else {
        console.log(" İşlem on-chain'e düşmedi.");
    }
}

main().catch(console.error);
