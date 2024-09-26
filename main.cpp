#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>

using namespace std;

// Hash funkcija
string Hash(const string &input) {
    // Inicializacija 256 bitu busenai
    unsigned long long state[4] = {0x0123456789ABCDEF, 0xFEDCBA9876543210, 0x0011223344556677, 0x8899AABBCCDDEEFF};
    
    // Ciklas per simbolius
    for (char c : input) {
        unsigned long long byte = static_cast<unsigned long long>(c);

        // Maisymas naudojant XOR ir bitų perstūmimą
        state[0] ^= byte;
        state[1] ^= (byte << 8);
        state[2] ^= (byte << 16);
        state[3] ^= (byte << 24);

        // Stumdome bitus kiekviename cikle
        state[0] = (state[0] >> 1) | (state[0] << 63);
        state[1] = (state[1] >> 2) | (state[1] << 62);
        state[2] = (state[2] >> 3) | (state[2] << 61);
        state[3] = (state[3] >> 4) | (state[3] << 60);
    }

    // Paverciame busena i 64 simboliu hex
    stringstream hash;
    for (int i = 0; i < 4; i++) {
        hash << hex << setw(16) << setfill('0') << state[i];
    }
    
    return hash.str();
}

int main(int argc, char *argv[]) {
    string input;

    // Patikriname, ar yra iesties failas per komandine eilute
    if (argc > 1) {
        ifstream file(argv[1]);
        if (file) {
            stringstream buffer;
            buffer << file.rdbuf();
            input = buffer.str();
        } else {
            cerr << "Nepavyko atidaryti failo: " << argv[1] << endl;
            return 1;
        }
    } else {
        // Jei nera failo, paprasome ivesti duomenis ranka
        cout << "Iveskite teksta: ";
        getline(cin, input);
    }

    // Sukuriame maisa
    string result = Hash(input);

    // Isvedame rezultata
    cout << "Hash rezultatas: " << result << endl;

    return 0;
}
