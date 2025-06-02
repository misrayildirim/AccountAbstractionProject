module.exports = {
    rpcUrl: process.env.ALCHEMY_SEPOLIA_URL,
    entryPointAddress: "0", // Sepolia EntryPoint adresi
    bundlerUrl: process.env.BUNDLER_URL,
    // Deploy edilmiş gerçek adresleriniz
    paymasterAddress: "0x", // Paymaster adresiniz
    simpleAccountAddress: "0x", // SimpleAccount adresiniz
    testTokenAddress: "0x", // TestToken adresiniz
    accountFactoryAddress: "0x0000000000000000000000000000000000000000", // Factory kullanmadığımız için boş
};
