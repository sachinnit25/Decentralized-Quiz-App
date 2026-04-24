# 🧠 Decentralized Quiz App (Stellar Soroban)

A premium, blockchain-powered quiz application built on **Stellar Soroban**. This app allows for trustless quiz creation, participation, and verifiable scoring.

## 🌟 Level 1 Features (Implemented)
- ✅ **Freighter Wallet Integration**: Secure connection to the Stellar network.
- ✅ **Real-time XLM Balance**: Automatically fetches and displays your testnet balance.
- ✅ **XLM Transaction Flow**: Integrated testing button to send payments with real-time on-chain feedback.
- ✅ **Premium UI/UX**: Dark-themed, responsive design with smooth animations and state management.

## 🛠️ Project Structure
- `/contract/quiz-contract`: The Soroban smart contract (Rust).
- `/frontend`: The React + Vite + TypeScript web application.
- `deploy_contract.bat`: Automation script for building and deploying the contract.

## 🚀 Quick Start
1.  Navigate to `/frontend` and run `npm install`.
2.  Start the dev server with `npm run dev`.
3.  Connect your Freighter wallet (set to Testnet).
4.  Use the "Send Test Transaction" button to verify Level 1 requirements.

## 📝 Smart Contract Functions
- `initialize(admin: Address)`: Set up the contract admin.
- `create_quiz(question, options, correct_answer)`: Admin only.
- `submit_answer(user, quiz_index, answer)`: Users participate and earn points.
- `get_score(user)`: Query on-chain user performance.

---
Built for the Stellar Soroban Challenge.
