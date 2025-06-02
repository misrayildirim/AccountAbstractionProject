module.exports = {
    rpcUrl: process.env.ALCHEMY_SEPOLIA_URL,
    entryPointAddress: "0x0576a174D229E3cFA37253523E645A78A0C91B57", // Sepolia EntryPoint adresi
    bundlerUrl: process.env.BUNDLER_URL,
    // Deploy edilmiş gerçek adresleriniz
    paymasterAddress: "0x1099B311bd33899380B3FC9c32583F681B2B7A40", // Paymaster adresiniz
    simpleAccountAddress: "0xE5445A7AacE30FF969ff8A3FDf4f4ee542ea101E", // SimpleAccount adresiniz
    testTokenAddress: "0xdC9a21A14977f5b882283Ac2B2Da96F6FF579E08", // TestToken adresiniz
    accountFactoryAddress: "0x0000000000000000000000000000000000000000", // Factory kullanmadığımız için boş
};