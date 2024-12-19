# Maišos funkcijos realizacija (v0.1)

## Idėja
Ši maišos funkcija yra sukurta naudojant XOR operacijas ir bitų perstūmimą. Maišas yra sukurtas iš fiksuoto dydžio (256 bitų) būsenos, kurią modifikuojame pagal įvesties duomenis. Bitų perstūmimas padeda užtikrinti lavinos efektą. Galutinis rezultatas pateikiamas kaip 64 simbolių hex stringas.

### Žingsniai:
1. Inicializuojama 256 bitų būsenos masyvas.
2. Kiekvienas įvesties simbolis paverčiamas į ASCII reikšmę.
3. Vykdoma XOR operacija ir bitų perstūmimai kiekviename simbolyje.
4. Būsena sujungiama į 64 simbolių hex stringą.

## Naudojimas
- Programos kompiliavimas 'g++ -std=c++11 -o  program main.cpp'
- Failo įvestis: `./program <input_file>`
- Rankinė įvestis: `./program` ir tada įvesti tekstą per komandinę eilutę.
