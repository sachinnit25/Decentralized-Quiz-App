# 🧠 Decentralized Quiz App (Stellar Soroban)

A premium, blockchain-powered quiz application built on **Stellar Soroban**. This app allows for trustless quiz creation, participation, and verifiable scoring on the Stellar Testnet.

## 🌟 Key Features
- ✅ **Freighter Wallet Integration**: Secure connection to the Stellar network.
- ✅ **On-Chain Quizzes**: Create and store quiz questions directly on the Soroban smart contract.
- ✅ **Verifiable Scoring**: Answers are submitted to the contract, and scores are updated on-chain.
- ✅ **Real-time XLM Balance**: Automatically fetches and displays your testnet balance.
- ✅ **Premium UI/UX**: Modern dark-themed design with smooth transitions and state management.

## 🛠️ Project Structure
- `/contract/quiz-contract`: The Soroban smart contract (Rust).
- `/frontend`: The React + Vite + TypeScript web application.
- `deploy_contract.bat`: Automation script for building and deploying the contract.

## 🚀 Quick Start

### 1. Smart Contract (Development)
Navigate to `/contract/quiz-contract` and run:
```bash
# Run the test suite (3+ tests)
cargo test
```

### 2. Frontend
Navigate to `/frontend` and run:
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 3. Usage
1.  Connect your **Freighter Wallet** (set to Testnet).
2.  Use the **Create** tab to deploy a new quiz to the blockchain.
3.  Use the **Play** tab to answer quizzes and earn points.
4.  Monitor your **Score** which is fetched directly from the smart contract.

## 🔗 Submission Links
- **Live Demo**: [https://frontend-eta-seven-24.vercel.app](https://frontend-eta-seven-24.vercel.app)
- **Demo Video**: [https://youtu.be/BKkdJhKS5W4](https://youtu.be/BKkdJhKS5W4)

### 🌐 Vercel Deployment Instructions
1.  Install the Vercel CLI: `npm i -g vercel`.
2.  Navigate to the `frontend/` directory.
3.  Run `vercel` and follow the prompts (or use `vercel --prod` for instant deployment).
4.  The provided `vercel.json` ensures all routes redirect correctly for the React SPA.

## 📸 Test Execution Screenshot
Below is the output of the smart contract tests showing 4 tests passing:

```text
running 4 tests
test test::test_initialize ... ok
test test::test_create_quiz ... ok
test test::test_submit_answer ... ok
test test::test_invalid_quiz_index - should panic ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered;
```

## 🧪 Smart Contract Tests
The project includes a comprehensive test suite in `src/test.rs` covering:
- `test_initialize`: Verifies admin setup.
- `test_create_quiz`: Verifies quiz creation and storage.
- `test_submit_answer`: Verifies correct scoring logic.
- `test_invalid_quiz_index`: Verifies error handling for out-of-bounds access.

## 📝 Contract API
- `initialize(admin: Address)`: Set up the contract admin.
- `create_quiz(question, options, correct_answer)`: Admin only function to add quizzes.
- `submit_answer(user, quiz_index, answer)`: Users participate and update their on-chain score.
- `get_score(user)`: Query user performance.
- `get_quizzes()`: Fetch all active quizzes.

---
Built for the Stellar Soroban Challenge.

// Project finalized and deployed to Vercel.
