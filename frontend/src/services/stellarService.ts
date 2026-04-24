import freighter from "@stellar/freighter-api";
import * as StellarSdk from "stellar-sdk";

// --- Custom Error Types (Requirement 1: 3 error types handled) ---
export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }
}

export class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractError";
  }
}

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RPC_URL = "https://soroban-testnet.stellar.org"; 
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Helper to ensure we have a string address
const getAddressString = (val: any): string => {
  if (typeof val === 'string') return val;
  if (val && val.address) return val.address;
  if (val && typeof val.toString === 'function') return val.toString();
  return "";
};

/**
 * Connects to the Stellar wallet (Freighter).
 */
export const connectWallet = async () => {
  try {
    if (!await freighter.isConnected()) {
      throw new WalletError("Freighter wallet not found.");
    }
    const res = await freighter.requestAccess();
    const address = getAddressString(res);
    if (address) return address;
    throw new WalletError("User denied access or no account found.");
  } catch (error: any) {
    if (error instanceof WalletError) throw error;
    throw new WalletError(error.message || "Failed to connect wallet.");
  }
};

export const getXLMBalance = async (publicKey: string) => {
  try {
    const address = getAddressString(publicKey);
    const account = await server.loadAccount(address);
    const nativeBalance = account.balances.find((b: any) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};

/**
 * Invokes a function on a Soroban smart contract.
 */
export const invokeContract = async (
  contractId: string,
  functionName: string,
  args: StellarSdk.xdr.ScVal[] = []
) => {
  try {
    const res = await freighter.requestAccess();
    const publicKey = getAddressString(res);
    if (!publicKey) throw new WalletError("Wallet not connected.");

    const account = await server.loadAccount(publicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: "10000",
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.invokeHostFunction({
          func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
            new StellarSdk.xdr.InvokeContractArgs({
              contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
              functionName: functionName,
              args: args,
            })
          ),
          auth: [],
        })
      )
      .setTimeout(30)
      .build();

    const result = await freighter.signTransaction(transaction.toXDR(), {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    const signedXdr = typeof result === "string" ? result : (result as any).signedTxXdr;
    if (!signedXdr) throw new TransactionError("Transaction signing failed.");

    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    const response = await server.submitTransaction(tx);
    return response;
  } catch (error: any) {
    if (error instanceof WalletError || error instanceof TransactionError) throw error;
    throw new ContractError(error.message || "Contract invocation failed.");
  }
};

/**
 * Sends a native XLM transaction on the Stellar Testnet.
 */
export const sendXLMTransaction = async (destination: string, amount: string) => {
  try {
    const res = await freighter.requestAccess();
    const publicKey = getAddressString(res);
    const destString = getAddressString(destination);
    
    if (!publicKey) throw new WalletError("Wallet not connected.");

    const account = await server.loadAccount(publicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destString,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(30)
      .build();

    const result = await freighter.signTransaction(transaction.toXDR(), {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    const signedXdr = typeof result === "string" ? result : (result as any).signedTxXdr;
    if (!signedXdr) throw new TransactionError("Transaction signing failed.");

    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    const response = await server.submitTransaction(tx);
    return response;
  } catch (error: any) {
    if (error instanceof WalletError || error instanceof TransactionError) throw error;
    throw new TransactionError(error.message || "XLM Transfer failed.");
  }
};

export { server };
