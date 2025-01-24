import { SolanaAdapter } from "fxn-protocol-sdk";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

async function registerAgent() {
    dotenv.config();

    let b = bs58.decode(process.env.DEVNET_SECRET_KEY! as string);
    let secretKey = new Uint8Array(b);
    const keypair = Keypair.fromSecretKey(secretKey);
    const wallet = new Wallet(keypair);

    const connection = new Connection(process.env.ANCHOR_PROVIDER_URL!, "confirmed");
    const provider = new AnchorProvider(connection, wallet);
    const adapter = new SolanaAdapter(provider);

    const agentParams = {
        name: process.env.AGENT_NAME!,
        description: process.env.AGENT_DESCRIPTION!,
        restrict_subscriptions: false,
        capabilities: process.env.AGENT_CAPABILITIES!.split(','),
        fee: Number(process.env.AGENT_FEE!)
    };

    try {
        const registrationSignature = await adapter.registerAgent(agentParams);
        console.log("Agent registration signature: ", registrationSignature);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const agentDetails = await adapter.getAgentDetails(keypair.publicKey);
        console.log("Agent details: ", agentDetails);

    } catch (error) {
        console.error(error);
    }
};

registerAgent();