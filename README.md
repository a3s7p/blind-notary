# Blind Notary

Blind Notary AI agent to enable in-band identity, communication, analysis, and signing between the signatories of confidential documents

## Extended description

Web2 eSigning solutions are widespread and convenient, but rely on trust through central authority and cannot offer universal privacy and traceability.
Web3 provides many ways to sign information and prove authenticity securely, but using web3-native approaches causes friction with web3-naive counterparties.
Both approaches only cover the most essential part of what goes into a typical transaction, creating the potential for data leaks by counterparties communicating out of band.

Enter Blind Notary, a simple and user-friendly tool which should:

- Prepare a document for signing and store the template without violating privacy
- Ensure that network fees and such can be arranged in advance to eliminate friction
- Notify other signatories, granting access to document content and metadata in-band
- Offer AI agent interface to provide clarity and mediate doubts while keeping data private
- Offer a built-in secure communication channel to ensure negotiations do not leak details out of band
- Obtain digital signatures, keeping the entire signing flow traceable

This project was made during the [ETHGlobal Agentic Ethereum](https://ethglobal.com/events/agents) hackathon.

While not in scope during the hackathon, it should be possible to ensure that Blind Notary complies with applicable regulation on electronic signatures in EU (eIDAS) and US (ESIGN/UETA) jurisdictions later on by providing standard certificates of completion.

### Stack

It currently integrates LangChain.js/LangGraph, Nillion, Coinbase CDP/AgentKit on Base chain, OpenAI, Gaia & Hyperbolic as inference source, Vercel AI SDK, Next.js and local RAG pipeline.

The chat context/history including uploaded files is stored encrypted on Nillion nilDB using their wrappers lib for increased privacy and a simple custom codec to enable storing any binary data there.

The agent is a ReAct paradigm agent driven by LangChain/LangGraph and integrated with Coinbase CDP & AgentKit on Base for future payment processing (esp. something like paying for its own inference needs) and local RAG + auxiliary tools (PDF parser, chunker, embedding, vector store pipeline).

Currently only the LLM inference calls are external (with choice of OpenAI as reference implementation, Hyperbolic or Gaia AVS as decentralized AI platforms; other APIs would be trivial to add, especially if OpenAI-compatible; nilAI or Galadriel looks interesting for TEE/verifiable inference).

The rest of the agent runs on-premise thanks to LangChain.

The UI is Next.js with shadcn/ui and Vercel AI SDK for the client-server communication.
Initial UI scaffold iteration was done with v0.
Since it uses LangChain and the Vercel AI SDK it should always be trivial to extend.
Possible future developments: more customized & performant nilDB-based checkpointer and vector-store, more focus on cryptographic traceability, TEE and other on-chain verification.

The overarching idea for Blind Notary is to be as stateless/ephemeral as possible but provide a complete solution and produce concrete artifacts which are independently verifiable outside of the "privacy bubble".
In line with the stateless/ephemeral paradigm it currently does not store any persistent state server-side other than saving state in nilDB which is MPC-encrypted.
The minimum of state necessary is client-driven. Has dark mode too I guess. 

## Developer setup

If needed, [install Node.js](https://nodejs.org/en/download/package-manager) first.

To install dependencies: run `pnpm install` or `npm install`.

To launch: `pnpm dev` or `npm dev`.

To view: open [http://localhost:3000](http://localhost:3000) with your browser.
