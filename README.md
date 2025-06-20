from pathlib import Path

readme_content = """
# 🧠 Akıllı Hesap Soyutlaması (Smart Account Abstraction) Projesi

Bu proje, Ethereum Sepolia test ağında **Akıllı Hesap Soyutlaması (ERC-4337)** konseptlerini keşfetmek ve uygulamak için tasarlanmıştır. Bu proje ile kullanıcıların özel anahtarlarla doğrudan etkileşime girmesine gerek kalmadan, çeşitli doğrulama mantıkları ve çoklu imza yetenekleriyle güçlendirilmiş esnek ve programlanabilir hesaplar oluşturulması hedeflenmektedir.

---

## 🌟 Özellikler

- ✅ **ERC-4337 Uyumluluğu**: Ethereum'un Hesap Soyutlama standardı ile tam uyumluluk.
- 🔐 **Basit Hesap Desteği**: Temel akıllı hesap işlevselliğinin entegrasyonu.
- 🧪 **Test Ağı Entegrasyonu**: Sepolia ağı üzerinde dağıtım ve test kolaylığı.
- 🔗 **Alchemy ve Etherspot Entegrasyonu**: Güvenilir RPC ve Bundler hizmetleri ile sorunsuz etkileşim.
- 💸 **Token Etkileşimleri**: Test token'ları ile işlem yapabilme yeteneği.

---

## ⚙️ Kurulum

Projeyi yerel makinenizde kurmak ve çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın:

```bash
git clone <proje-depo-url'si>
cd <proje-klasoru>



### 2.Bağımlılıkları Yükleyin:
npm install

Ortam Değişkenlerini Ayarlayın:
Proje kök dizininde .env adında bir dosya oluşturun ve gerekli ortam değişkenlerini aşağıdaki gibi ekleyin. Bu dosyanın içeriğini asla herkese açık bir yerde paylaşmayın veya Git'e yüklemeyin

ALCHEMY_SEPOLIA_URL=# Kendi Alchemy URL'niz
PRIVATE_KEY=0x... # Cüzdanınızın özel anahtarı (test amaçlı)
ENTRY_POINT=
BUNDLER_URL=https: Kendi Etherspot URL'niz
ETHERSCAN_API_KEY= # Kendi Etherscan API Anahtarınız
ACCOUNT_FACTORY_ADDRESS=
SIMPLE_ACCOUNT_ADDRESS=
TEST_TOKEN_ADDRESS=
RECIPIENT_ADDRESS=

🛠️ Kullanım
Projenin çeşitli bölümlerini çalıştırmak için ilgili komutları kullanın. Örneğin:

Bash
# Compile Etmek için
npx hardhat compile

# Örnek bir script'i çalıştırmak için (Meta Transaction)
node scripts/userOp.js

# Deploy edebilmek için 
npx hardhat run scripts/deploy.js --network sepolia#
