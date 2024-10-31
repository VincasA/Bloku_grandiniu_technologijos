#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <memory>
#include <cmath>

using namespace std;

// Maišos funkcija
string Hash(const string &input) {
    unsigned long long state[4] = {0x0123456789ABCDEF, 0xFEDCBA9876543210, 0x0011223344556677, 0x8899AABBCCDDEEFF};
    for (char c : input) {
        unsigned long long byte = static_cast<unsigned long long>(c);
        state[0] ^= byte;
        state[1] ^= (byte << 8);
        state[2] ^= (byte << 16);
        state[3] ^= (byte << 24);
        state[0] = (state[0] >> 1) | (state[0] << 63);
        state[1] = (state[1] >> 2) | (state[1] << 62);
        state[2] = (state[2] >> 3) | (state[2] << 61);
        state[3] = (state[3] >> 4) | (state[3] << 60);
    }
    stringstream hash;
    for (int i = 0; i < 4; i++) {
        hash << hex << setw(16) << setfill('0') << state[i];
    }
    return hash.str();
}

// Transakcijos klasė
class Transaction {
public:
    string transaction_id;
    string sender;
    string receiver;
    int amount;

    Transaction(const string& sender, const string& receiver, int amount)
        : sender(sender), receiver(receiver), amount(amount) {
        transaction_id = generateTransactionID();
    }

private:
    string generateTransactionID() {
        stringstream ss;
        ss << sender << receiver << amount << time(0);
        return Hash(ss.str());
    }
};

// Bloko klasė
class Block {
public:
    int index;
    string prev_block_hash;
    string hash;
    time_t timestamp;
    int version;
    string merkle_root_hash;
    int nonce;
    int difficulty_target;
    vector<Transaction> transactions;

    Block(int idx, const string& prev_hash, const vector<Transaction>& txs, int difficulty)
        : index(idx), prev_block_hash(prev_hash), transactions(txs), nonce(0), difficulty_target(difficulty) {
        timestamp = time(0);
        version = 1;
        merkle_root_hash = calculateMerkleRoot();
        hash = calculateHash();
    }

    void mineBlock() {
        string target(difficulty_target, '0');
        while (hash.substr(0, difficulty_target) != target) {
            nonce++;
            hash = calculateHash();
        }
        cout << "Block mined: " << hash << endl;
    }

private:
    string calculateHash() const {
        stringstream ss;
        ss << index << prev_block_hash << timestamp << version << merkle_root_hash << nonce << difficulty_target;
        return Hash(ss.str());
    }

    string calculateMerkleRoot() {
        if (transactions.empty()) return "";

        vector<string> hash_list;
        for (const auto& tx : transactions) {
            hash_list.push_back(tx.transaction_id);
        }

        while (hash_list.size() > 1) {
            if (hash_list.size() % 2 != 0) {
                hash_list.push_back(hash_list.back()); // Duplikatas, jei nelyginis skaičius
            }

            vector<string> new_hash_list;
            for (size_t i = 0; i < hash_list.size(); i += 2) {
                new_hash_list.push_back(Hash(hash_list[i] + hash_list[i + 1]));
            }
            hash_list = new_hash_list;
        }
        return hash_list.front();
    }
};

// Blokų grandinės klasė
class Blockchain {
public:
    Blockchain(int difficulty) : difficulty(difficulty) {
        createGenesisBlock();
    }

    void addBlock(vector<Transaction>& transactions) {
        Block new_block(chain.size(), chain.back().hash, transactions, difficulty);
        new_block.mineBlock();
        chain.push_back(new_block);
    }

    void printBlockchain() const {
        for (const auto& block : chain) {
            cout << "Block Index: " << block.index << "\n";
            cout << "Previous Hash: " << block.prev_block_hash << "\n";
            cout << "Hash: " << block.hash << "\n";
            cout << "Timestamp: " << block.timestamp << "\n";
            cout << "Version: " << block.version << "\n";
            cout << "Merkle Root Hash: " << block.merkle_root_hash << "\n";
            cout << "Nonce: " << block.nonce << "\n";
            cout << "Difficulty: " << block.difficulty_target << "\n";
            cout << "Transactions:\n";
            for (const auto& tx : block.transactions) {
                cout << "  ID: " << tx.transaction_id << ", Sender: " << tx.sender
                     << ", Receiver: " << tx.receiver << ", Amount: " << tx.amount << "\n";
            }
            cout << "------------------------\n";
        }
    }

private:
    vector<Block> chain;
    int difficulty;

    void createGenesisBlock() {
        vector<Transaction> initial_transactions;
        Block genesis(0, "0", initial_transactions, difficulty);
        chain.push_back(genesis);
    }
};

// Pagrindinė programa
int main() {
    Blockchain blockchain(2);  // Difficulty nustatymas

    // Transakcijų ir vartotojų generavimas analogiškai kaip anksčiau
    vector<Transaction> transactions;
    transactions.emplace_back("UserA", "UserB", 100);
    transactions.emplace_back("UserC", "UserD", 50);

    blockchain.addBlock(transactions);
    blockchain.printBlockchain();
    return 0;
}