import { SolanaAdapter } from "fxn-protocol-sdk";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

async function getSubscriptionRequests() {
    dotenv.config();

    let b = bs58.decode(process.env.DEVNET_SECRET_KEY! as string);
    let secretKey = new Uint8Array(b);
    const keypair = Keypair.fromSecretKey(secretKey);
    const wallet = new Wallet(keypair);

    const connection = new Connection(process.env.ANCHOR_PROVIDER_URL!, "confirmed");
    const provider = new AnchorProvider(connection, wallet);
    const adapter = new SolanaAdapter(provider);

    try {

        const subscriptionRequests = await adapter.getSubscriptionRequests(wallet.publicKey);
        console.log("Agent subscription requests: ", subscriptionRequests);

    } catch (error) {
        console.error(error);
    }
};

getSubscriptionRequests();