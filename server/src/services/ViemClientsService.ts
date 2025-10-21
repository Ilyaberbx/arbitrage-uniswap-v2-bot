import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
} from "viem";
import { configsService } from "../services/ConfigsService";
import { privateKeyToAccount } from "viem/accounts";
export class ViemClientsService {
  private publicClients: Record<string, PublicClient> = {};
  private walletClients: Record<string, WalletClient> = {};

  public getPublicClient(chainName: string): PublicClient {
    const chain = configsService.getChain(chainName);
    if (!chain) {
      throw new Error(`Chain '${chainName}' not found`);
    }

    if (this.publicClients[chainName]) {
      return this.publicClients[chainName];
    }

    const client = createPublicClient({
      chain: chain.viemChain,
      transport: http(chain.rpcUrl),
    });

    this.publicClients[chainName] = client;
    return client;
  }

  public getWalletClient(chainName: string): WalletClient {
    const chain = configsService.getChain(chainName);
    if (!chain) {
      throw new Error(`Chain '${chainName}' not found`);
    }

    if (this.walletClients[chainName]) {
      return this.walletClients[chainName];
    }

    const account = privateKeyToAccount(chain.walletPrivateKey);

    if (!account) {
      throw new Error(`Account not found for chain '${chainName}'`);
    }

    const client = createWalletClient({
      account: account,
      chain: chain.viemChain,
      transport: http(chain.rpcUrl),
    });

    this.walletClients[chainName] = client;
    return client;
  }
}

export const viemClientsService = new ViemClientsService();
