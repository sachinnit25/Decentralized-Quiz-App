# 🚀 Getting Started with Decentralized Quiz App

Everything you need to complete the Level 1 and Level 2 requirements is now set up. Follow these steps to run and test the app.

## 1. Run the Frontend
Open your terminal in the `frontend` folder and run:
```bash
npm install
npm run dev
```
Once it's running, open the URL (usually `http://localhost:5173`).

## 2. Testing Level 1 Requirements
1.  **Connect Wallet**: Click the **"Connect Wallet"** button. Make sure you have the [Freighter Extension](https://www.freighter.app/) installed and set to **Testnet**.
2.  **View Balance**: Your XLM balance will automatically appear in the sidebar.
3.  **Send Transaction**: Click **"Send Test Transaction (0.1 XLM)"**. This will:
    *   Initiate a payment of 0.1 XLM to your own address.
    *   Show a pending notification.
    *   Provide a success message with a link to the transaction on **Stellar Expert**.

## 3. Smart Contract (Level 2)
The contract is located in the `contract/quiz-contract` folder.
*   To build: Run `deploy_contract.bat` in the root folder.
*   Once deployed, update the `CONTRACT_ID` in `frontend/src/App.tsx` (line 15).

---

### Folder Note
I have moved the contract logic to a new folder named `contract` (singular) as per the challenge requirements. Please use `contract/quiz-contract` for your work.
