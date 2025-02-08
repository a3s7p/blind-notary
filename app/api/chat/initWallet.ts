import { CdpWalletProvider } from "@coinbase/agentkit";
import * as fs from "fs";

// Configure a file to persist the agent's CDP MPC Wallet Data
export const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Initialize a wallet with CDP Wallet Provider
 *
 * @returns Wallet provider object
 */

export async function initWallet() {
  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    cdpWalletData: (() => {
      if (fs.existsSync(WALLET_DATA_FILE)) {
        try {
          return fs.readFileSync(WALLET_DATA_FILE, "utf8");
        } catch (error) {
          // Continue without wallet data but warn
          console.warn("Could not read wallet data:", error);
        }
      }
    })(),
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);

  // Persist wallet data
  const exportedWallet = await walletProvider.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

  return walletProvider;
}
