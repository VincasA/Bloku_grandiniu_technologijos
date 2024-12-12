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
