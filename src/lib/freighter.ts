import {
  connectWallet as sdkConnectWallet,
  getPublicKey as sdkGetPublicKey,
  isConnected as sdkIsConnected,
  isFreighterInstalled as sdkIsFreighterInstalled,
  signTransaction as sdkSignTransaction,
} from "@sorotip/sdk";

const isBrowser = typeof window !== "undefined";

/** SSR-safe check for whether the Freighter extension is installed. Always `false` on the server. */
export async function isFreighterInstalled(): Promise<boolean> {
  if (!isBrowser) return false;
  return sdkIsFreighterInstalled();
}

/** SSR-safe check for whether this site has permission to access Freighter. Always `false` on the server. */
export async function isConnected(): Promise<boolean> {
  if (!isBrowser) return false;
  return sdkIsConnected();
}

/** Prompts the user to connect Freighter. Throws if called on the server. */
export async function connectWallet(): Promise<string> {
  if (!isBrowser) {
    throw new Error("connectWallet() can only be called in the browser.");
  }
  return sdkConnectWallet();
}

/** Returns the connected wallet's public key. Throws if called on the server. */
export async function getPublicKey(): Promise<string> {
  if (!isBrowser) {
    throw new Error("getPublicKey() can only be called in the browser.");
  }
  return sdkGetPublicKey();
}

/** Signs a transaction XDR via Freighter. Throws if called on the server. */
export async function signTransaction(
  transactionXdr: string,
  opts?: { networkPassphrase?: string; address?: string },
): Promise<string> {
  if (!isBrowser) {
    throw new Error("signTransaction() can only be called in the browser.");
  }
  return sdkSignTransaction(transactionXdr, opts);
}
