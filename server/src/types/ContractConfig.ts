import { Address } from "viem";

export interface ContractConfig {
  address: Address;
  abi: readonly any[];
}
