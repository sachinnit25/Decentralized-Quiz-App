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

/**
 * Connects to the Stellar wallet (Freighter).
 * Structured to be easily extensible for multi-wallet support.
 */
export const connectWallet = async () => {
  try {
    if (await freighter.isConnected()) {
      const { address } = await freighter.getAddress();
      if (address) return address;
      throw new WalletError("Could not retrieve wallet address.");
    } else {
      throw new WalletError("Freighter wallet not found or not connected.");
    }
  } catch (error: any) {
    if (error instanceof WalletError) throw error;
    throw new WalletError(error.message || "Failed to connect wallet.");
  }
};

export const getXLMBalance = async (publicKey: string) => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b: any) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};

/**
 * Invokes a function on a Soroban smart contract.
 * (Requirement 3: Contract called from the frontend)
 */
export const invokeContract = async (
  contractId: string,
  functionName: string,
  args: StellarSdk.xdr.ScVal[] = []
) => {
  try {
    const { address: publicKey } = await freighter.getAddress();
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
    if (!signedXdr) throw new TransactionError("Transaction signing failed or was rejected.");

    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    const response = await server.submitTransaction(tx);
    
    if (!response.successful) {
      throw new TransactionError("Transaction failed during submission.");
    }

    return response;
  } catch (error: any) {
    if (error instanceof WalletError || error instanceof TransactionError) throw error;
    throw new ContractError(error.message || "Contract invocation failed.");
  }
};

/**
 * Fetches contract events for real-time integration.
 * (Requirement 6: Real-time event integration)
 */
export const getContractEvents = async (contractId: string) => {
    try {
        const rpc = new StellarSdk.rpc.Server(RPC_URL);
        const latestLedger = await rpc.getLatestLedger();
        const events = await rpc.getEvents({
            startLedger: latestLedger.sequence - 100,
            filters: [
                {
                    type: "contract",
                    contractIds: [contractId]
                }
            ]
        });
        return events.events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

/**
 * Sends a native XLM transaction on the Stellar Testnet.
 * (Requirement: Level 1 - Send an XLM transaction)
 */
export const sendXLMTransaction = async (destination: string, amount: string) => {
  try {
    const { address: publicKey } = await freighter.getAddress();
    if (!publicKey) throw new WalletError("Wallet not connected.");

    const account = await server.loadAccount(publicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
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
    
    if (!response.successful) {
      throw new TransactionError("Transaction failed during submission.");
    }

    return response;
  } catch (error: any) {
    if (error instanceof WalletError || error instanceof TransactionError) throw error;
    throw new TransactionError(error.message || "XLM Transfer failed.");
  }
};

export { server };
