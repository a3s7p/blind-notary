import { CdpWalletProvider } from "@coinbase/agentkit";

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
      const walletData = process.env["CDP_WALLET_DATA"];

      if (walletData) {
        return walletData;
      } else {
        // Continue without wallet data but warn
        console.warn("Could not read wallet data:");
      }
    })(),
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
  return walletProvider;
}
