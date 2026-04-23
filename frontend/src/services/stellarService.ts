import freighter from "@stellar/freighter-api";
const { isConnected, signTransaction } = freighter;
import * as StellarSdk from "stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export const connectWallet = async () => {
  if (await isConnected()) {
    const { address } = await freighter.getAddress();
    if (address) return address;
    throw new Error("Could not retrieve wallet address.");
  } else {
    throw new Error("Freighter wallet not found or not connected.");
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

export const sendXLM = async (to: string, amount: string) => {
  const { address: publicKey } = await freighter.getAddress();
  if (!publicKey) throw new Error("Wallet not connected.");
  
  const account = await server.loadAccount(publicKey);
  
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: to,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .setTimeout(30)
    .build();

  const result = await signTransaction(transaction.toXDR(), {
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  const signedXdr = typeof result === 'string' ? result : (result as any).signedTxXdr;

  return await server.submitTransaction(StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET));
};

export const invokeContract = async (contractId: string, functionName: string, args: StellarSdk.xdr.ScVal[] = []) => {
  const { address: publicKey } = await freighter.getAddress();
  if (!publicKey) throw new Error("Wallet not connected.");

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

  const result = await signTransaction(transaction.toXDR(), {
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  const signedXdr = typeof result === 'string' ? result : (result as any).signedTxXdr;

  return await server.submitTransaction(StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET));
};

export { server };
