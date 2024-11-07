#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <memory>
#include <cmath>
#include <unordered_map>
#include <cstdlib>
#include <random>
#include <algorithm>
#include <chrono>

using namespace std;

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

class User {
public:
    string name;
    string public_key;
    int balance;

    User(const string &name, const string &public_key, int balance)
        : name(name), public_key(public_key), balance(balance) {}

    static vector<User> generateUsers(int count) {
        vector<User> users;
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> balance_dist(100, 1000000);

        for (int i = 0; i < count; ++i) {
            stringstream ss;
            ss << "User" << i;
            string name = ss.str();
            string public_key = Hash(name);
            int balance = balance_dist(gen);
            users.emplace_back(name, public_key, balance);
        }
        return users;
    }
};

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

    bool isValid() const {
        return transaction_id == generateTransactionID();
    }

private:
    string generateTransactionID() const {
        stringstream ss;
        ss << sender << receiver << amount;
        return Hash(ss.str());
    }
};

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

    bool mineBlock(int maxAttempts, chrono::seconds maxTime) {
        string target(difficulty_target, '0');
        auto start = chrono::steady_clock::now();
        for (int attempts = 0; attempts < maxAttempts; ++attempts) {
            if (hash.substr(0, difficulty_target) == target) {
                cout << "Block mined: " << hash << endl;
                return true;
            }
            nonce++;
            hash = calculateHash();

            if (chrono::steady_clock::now() - start > maxTime) {
                return false;
            }
        }
        return false;
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
                hash_list.push_back(hash_list.back()); // Duplikuoti jei nelyginis skaicius
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

class Blockchain {
public:
    Blockchain(int difficulty) : difficulty(difficulty) {
        createGenesisBlock();
    }

    void addBlock(vector<User>& users) {
        // Generuoti 5 kandidatinius blokus ir bandyti iskasti juos
        vector<Block> candidates;
        for (int i = 0; i < 5; ++i) {
            vector<Transaction> block_transactions = selectRandomTransactions(100);
            candidates.emplace_back(chain.size(), chain.back().hash, block_transactions, difficulty);
        }

        int attemptCount = 100000;
        chrono::seconds maxTime(5);

        bool mined = false;
        while (!mined) {
            // Atsitiktinai pasirinkti kandidatini bloka
            int random_index = rand() % candidates.size();
            Block& candidate = candidates[random_index];

            mined = candidate.mineBlock(attemptCount, maxTime);

            if (mined) {
                chain.push_back(candidate);
                updateBalancesAndRemoveTransactions(candidate.transactions, users);
            } else {
                cout << "Mining failed for candidate. Increasing attempts/time." << endl;
                attemptCount += 50000;  // Padidinti bandymus kitam kartui
                maxTime += chrono::seconds(2);  // Padidinti laiko limita
            }
        }
    }

    void generateRandomTransactions(vector<User>& users, int count) {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> user_dist(0, users.size() - 1);
        uniform_int_distribution<> amount_dist(1, 5000);

        for (int i = 0; i < count; ++i) {
            int sender_idx, receiver_idx;
            do {
                sender_idx = user_dist(gen);
                receiver_idx = user_dist(gen);
            } while (sender_idx == receiver_idx);

            int amount = amount_dist(gen);
            if (users[sender_idx].balance >= amount) {  // Balance patikrinimas
                Transaction tx(users[sender_idx].public_key, users[receiver_idx].public_key, amount);
                if (tx.isValid()) {
                    pending_transactions.push_back(tx);
                }
            }
        }
    }

    void processTransactions(vector<User>& users) {
        while (!pending_transactions.empty()) {
            addBlock(users);
        }
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
    vector<Transaction> pending_transactions;

    void createGenesisBlock() {
        vector<Transaction> initial_transactions;
        Block genesis(0, "0", initial_transactions, difficulty);
        chain.push_back(genesis);
    }

    vector<Transaction> selectRandomTransactions(int count) {
        vector<Transaction> selected;
        shuffle(pending_transactions.begin(), pending_transactions.end(), mt19937(random_device()()));
        int n = min(count, (int)pending_transactions.size());
        for (int i = 0; i < n; ++i) {
            selected.push_back(pending_transactions[i]);
        }
        pending_transactions.erase(pending_transactions.begin(), pending_transactions.begin() + n);
        return selected;
    }

    void updateBalancesAndRemoveTransactions(const vector<Transaction>& transactions, vector<User>& users) {
        for (const auto& tx : transactions) {
            auto sender_it = find_if(users.begin(), users.end(), [&tx](const User& u) { return u.public_key == tx.sender; });
            auto receiver_it = find_if(users.begin(), users.end(), [&tx](const User& u) { return u.public_key == tx.receiver; });

            if (sender_it != users.end() && receiver_it != users.end() && sender_it->balance >= tx.amount) {
                sender_it->balance -= tx.amount;
                receiver_it->balance += tx.amount;
            }
        }
    }
};

// Main funkcija
int main() {
    Blockchain blockchain(2);  // Difficulty nustatymas
    vector<User> users = User::generateUsers(1000);  // Generuoti 1000 vartotoju
    blockchain.generateRandomTransactions(users, 10000);  // Generuoti 10000 transakciju

    blockchain.processTransactions(users);  // Kasti blokus iki kol visos transakcijos yra atliktos
    blockchain.printBlockchain();

    return 0;
}
