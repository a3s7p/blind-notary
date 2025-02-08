import {
  AgentKit,
  wethActionProvider,
  pythActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { initWallet } from "./initWallet";

/**
 * Initialize AgentKit
 *
 * @returns Agent LangChain tools array
 */

export async function initAgentKit() {
  const walletProvider = await initWallet();

  const apiKeyName = process.env.CDP_API_KEY_NAME;
  const apiKeyPrivateKey = process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider({ apiKeyName, apiKeyPrivateKey }),
      cdpWalletActionProvider({ apiKeyName, apiKeyPrivateKey }),
    ],
  });

  const tools = await getLangChainTools(agentKit);
  console.log(
    "Available tools:",
    tools.map((v) => v.name),
  );
  return tools;
}
