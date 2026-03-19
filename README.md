# Decentralized-Quiz-App
# 🧠 Decentralized Quiz App (Soroban Smart Contract)

## 📖 Project Description

The Decentralized Quiz App is a blockchain-powered application built on Soroban (Stellar Smart Contracts) that enables users to participate in quizzes in a fully trustless and transparent environment.

Unlike traditional quiz platforms, this system stores quiz data and user scores directly on-chain, ensuring immutability, fairness, and verifiability without relying on centralized servers.

---

## ⚙️ What It Does

- Allows an admin to create quizzes directly on the blockchain.
- Enables users to attempt quizzes using their wallet address.
- Automatically checks answers and updates scores.
- Stores all quiz and scoring data securely and permanently.

---

## 🚀 Features

- 🧩 Fully decentralized quiz platform  
- 🔐 Secure user authentication via wallet signatures  
- 📊 Transparent scoring system  
- 👤 User-specific performance tracking  
- 📝 On-chain quiz storage  
- ⚡ Lightweight and efficient Soroban smart contract  
- 🛡️ Tamper-proof records  

---

## 🧠 How It Works

1. The contract is deployed and initialized with an admin account.
2. The admin creates quiz questions with multiple options.
3. Users retrieve available quizzes.
4. Users submit their answers.
5. The smart contract verifies answers and updates scores.
6. Users can query their scores anytime.

---

## 🛠️ Tech Stack

- **Blockchain:** Stellar  
- **Smart Contracts:** Soroban  
- **Language:** Rust  
- **SDK:** soroban-sdk  

---

## 📦 Contract Functions

### `initialize(admin: Address)`
Initializes the contract with an admin.

### `create_quiz(question, options, correct_answer)`
Allows admin to create a quiz.

### `get_quizzes()`
Fetches all quizzes.

### `submit_answer(user, quiz_index, answer)`
Allows a user to submit an answer and updates score.

### `get_score(user)`
Returns the score of a user.

### `get_admin()`
Returns the admin address.

---

## 🔗 Deployed Smart Contract Link
🔗 https://stellar.expert/explorer/testnet/tx/de89eae40ef8a4944547fcd38c5a70ecb2e20904f5ef36c1e1640c0d97e08e79

🔗 https://lab.stellar.org/r/testnet/contract/CCZUUOVXLGOL3PEYCDQIXLXFNVL4JTYPYF2HXZ264JPVIIKVHMSNFDUW


> ⚠️ Replace with your deployed contract address:
CCZUUOVXLGOL3PEYCDQIXLXFNVL4JTYPYF2HXZ264JPVIIKVHMSNFDUW
