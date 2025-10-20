import { createPublicClient, http, PublicClient } from "viem";
import { configManager } from "../config/ConfigManager";

export class ViemClientsService {
  private clients: Record<string, PublicClient> = {};

  public getClient(chainName: string): PublicClient {
    const chain = configManager.getChain(chainName);
    if (!chain) {
      throw new Error(`Chain '${chainName}' not found`);
    }

    if (this.clients[chainName]) {
      return this.clients[chainName];
    }

    const client = createPublicClient({
      chain: chain.viemChain,
      transport: http(chain.rpcUrl),
    });

    this.clients[chainName] = client;
    return client;
  }
}

export const viemClientsService = new ViemClientsService();
