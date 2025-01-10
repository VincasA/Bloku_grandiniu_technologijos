# išmaniosios sutarties ir decentralizuotos aplikacijos kūrimas (v0.1)

### Sutarties logika:

1. Sutarties sukūrimas:
Gamintojas (manufacturer) sukuria sutartį, nurodydamas mažmenininko (retailer) ir kurjerio (courier) adresus.

2. Užsakymo pateikimas:
Mažmenininkas pateikia užsakymą, nurodydamas produkto pavadinimą ir kiekį. Įvykis OrderSent praneša gamintojui apie užsakymą.

3. Kainų nustatymas:
Gamintojas nurodo užsakymo kainą ir siuntos kainą. Šios vertės perduodamos mažmenininkui per PriceSent įvykį.

4. Apmokėjimas:
Mažmenininkas atlieka apmokėjimą (užsakymo kaina + siuntos kaina). Lėšos laikomos sutartyje iki pristatymo.

5. Sąskaitos pateikimas:
Gamintojas siunčia sąskaitą faktūrą ir numatytą pristatymo datą per InvoiceSent įvykį.

6. Pristatymo patvirtinimas:
Kurjeris pažymi užsakymą kaip pristatytą. Įvykis OrderDelivered informuoja apie pristatymo užbaigimą.

7. Lėšų paskirstymas:
Mažmenininkas užbaigia procesą. Sutartis perveda užsakymo kainą gamintojui ir siuntos kainą kurjeriui.



### Kaip patikrinti išmanios sutarties veiksmingumą, naudojant Remix IDE:

1. Kompiliuoti sutarti

2. Suvesti Retailer ir Courier paskyrų adresus prie DEPLOY sekcijos.

3. Paspausti transact, naudojant Manufacturer paskyrą.

4. Su Retailer paskyra įvykdyti sendOrder funkciją įvedus duomenis (pvz.: product - smartphone ir quantity - 100) ir paspaudus transact.

5. Su Manufacturer paskyra įvykdyti setPrices funkciją, įvedus duomenis (pvz.: 5000000000000000000 prie price ir 1000000000000000000 prie shippingFee. Skaičiai yra tokie dideli, kadangi čia yra Wei Ethereum vienetai. ETH vienetais čia būtų 5ETH ir 1ETH). Paspausti transact.

6. Su Retailer paskyra įvykdyti payOrder funkciją, viršuje prie VALUE įvedus shipping price + price (praeitame žingsnyje 5 ETH + 1 ETH = 6 ETH). Paspausti payOrder.

7. Su Manufacturer paskyra paspausti sendInvoice ir prie deliveryDate įvesti pristatymo datą (pvz.: 1700000000 (Unix timestamp)) ir paspausti transact.

8. Naudojant Courier paskyrą, paspausti confirmDelivery.

9. Naudojant Retailer paskyrą, paspausti finalizeOrder.

Galiausiai matome, kad iš Retailer paskyros buvo pervesta 5 ETH Manufacturer paskyrai ir 1 ETH Courier paskyrai.

### Ganache testnet prieš testuojant sutartį:
![image](https://github.com/user-attachments/assets/4cda528e-0e6e-40cf-9fb8-d46ed9f52c95)

### Ganache testnet po sutarties testavimo:
![image](https://github.com/user-attachments/assets/cbc27ca4-24ee-4a51-93f5-ad03663f0ffc)

### Per Etherscan matome, kad sėkmingai buvo deployinta sutartis, naudojant Sepolia testnet:
![image](https://github.com/user-attachments/assets/f0ca0485-4ba0-4332-a8a8-71a221daca70)

## Instrukcijos, kaip diegti sutartį ir paleisti front-end

### 1. Reikalavimai

Prieš pradedant, įsitikinkite, kad turite įdiegtus šiuos įrankius:
- Node.js
- npm
- MetaMask (browser extension)
- Ganache

### 2. Klonuokite repozitoriją

Klonuokite repozitoriją į savo vietinį kompiuterį:

Parsisiuskite release "ketvirta_v0.1" is https://github.com/VincasA/Bloku_grandiniu_technologijos.git repozitorijos

Įeikite į safe-delivery-dapp folderį su "cd safe-delivery-dapp"

### 3. Įdiekite priklausomybes

Įdiekite reikalingus paketus:
"npm install"

### 4. Paleiskite Ganache

Paleiskite vietinį Ethereum blokų grandinės tinklą naudodami Ganache:

- GUI naudotojai: Atidarykite Ganache programą ir paleiskite naują darbo aplinką (workspace).
- CLI naudotojai: Vykdykite: "ganache" komandinėje eilutėje terminale.

Užsirašykite RPC URL (pagal nustatymą: http://127.0.0.1:7545) ir testinių paskyrų adresus su privačiais raktais.

### 5. Konfigūruokite Hardhat

Įsitikinkite, kad hardhat.config.js faile yra sukonfigūruotas Ganache tinklas.
Patikrinkite šią konfigūraciją:

require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.0",
    networks: {
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: ["PRIVATE_KEY_OF_DEPLOYER"], // Pakeiskite į privačią paskyros rakto reikšmę iš Ganache
        },
    },
};

Pakeiskite PRIVATE_KEY_OF_DEPLOYER į pirmos paskyros privatų raktą, matomą Ganache.

### 6. Sukompiliuokite sutartį

Kompiliuokite išmaniąją sutartį:
"npx hardhat compile" komandinėje eilutėje

### 7. Diekite sutartį

Įdiekite išmaniąją sutartį į Ganache:

"npx hardhat run scripts/deploy.js --network ganache"

Užsirašykite terminale atspausdintą sutarties adresą.

### 8. Atnaujinkite Front-End konfigūraciją

Atnaujinkite config.json failą projekto šakniniame kataloge įvesdami įdiegtos sutarties adresą:

{
    "contractAddress": "0xYourDeployedContractAddress"
}

Pakeiskite 0xYourDeployedContractAddress į faktinį įdiegtos sutarties adresą.

### 9. Paleiskite Front-End

Nueikite į src folderį ir paleiskite vietinį serverį:
"npx live-server"
Ši komanda atidarys front-end jūsų numatytoje naršyklėje. Jei taip neįvyksta, apsilankykite terminale parodytu adresu (pvz.: http://127.0.0.1:8080).

### 10. Prisijunkite piniginę ir sąveikaukite

1. Atidarykite front-end naršyklėje.
2. Spustelėkite Connect Wallet, kad prisijungtumėte MetaMask piniginę.
3. Įsitikinkite, kad MetaMask prisijungusi prie Ganache tinklo.
4. Sąveikaukite su išmaniąja sutartimi naudodami front-end sąsają:
    - Manufacturer: Nustatykite kainas, siųskite sąskaitas.
    - Retailer: Pateikite užsakymus, užbaikite operacijas.
    - Kurjeris: Patvirtinkite pristatymą.

