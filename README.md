išmaniosios sutarties ir
decentralizuotos aplikacijos kūrimas (v0.1)

Sutarties logika:

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



Kaip patikrinti išmanios sutarties veiksmingumą, naudojant Remix IDE:
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