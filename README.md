# Arbitrage Uniswap V2 Bot

Automated flash swap arbitrage bot for Uniswap V2 compatible decentralized exchanges. The system consists of a Solidity smart contract for executing on-chain flash swap arbitrage and a TypeScript server for monitoring opportunities and transaction execution.

## Overview

This bot identifies and executes profitable arbitrage opportunities between Uniswap V2 compatible DEX pairs by:
1. Monitoring price differences between liquidity pools trading the same token pairs
2. Calculating optimal arbitrage amounts using mathematical optimization
3. Executing flash swap arbitrage through an on-chain smart contract
4. Ensuring profit requirements are met before transaction confirmation

## Architecture

### Smart Contracts (Foundry)

The Solidity implementation handles the on-chain execution of arbitrage through flash swaps.

**Core Contract**: `ArbitrageBotUniswapV2.sol`
- Executes flash swap arbitrage between two Uniswap V2 pairs
- Uses flash loans to perform atomic arbitrage without upfront capital
- Implements profit validation to ensure trades meet minimum profit thresholds
- Emits profit events for tracking and analytics

**Key Features**:
- Flash swap mechanism for capital-efficient arbitrage
- Owner-only execution to prevent unauthorized access
- Configurable minimum profit requirements
- Automatic profit withdrawal to caller address
- Gas-optimized Uniswap V2 formula implementation

**Deployment**:
- Currently deployed on Arbitrum at `0x3691D652b6d8A6650FB35b8Ea028C88470C0E690`
- Deployment script: `foundry/script/UniswapV2BotDeployer.s.sol`

### TypeScript Server

The off-chain monitoring and execution engine built with Node.js and viem.

**Core Components**:

1. **ArbitrageMath** (`server/src/utils/ArbitrageMath.ts`)
   - Calculates optimal arbitrage amounts using quadratic formula
   - Normalizes token decimals for accurate cross-pair comparisons
   - Determines swap direction based on reserve ratios
   - Validates pair compatibility and profitability

2. **ArbitrageV2Strategy** (`server/src/strategies/ArbitrageV2Strategy.ts`)
   - Main execution strategy for V2 arbitrage
   - Orchestrates pair monitoring and opportunity detection
   - Triggers flash swap execution when opportunities are found

3. **FlashSwapArbitrageService** (`server/src/services/FlashSwapArbitrageService.ts`)
   - Scans pairs for arbitrage opportunities
   - Simulates transactions before execution
   - Submits arbitrage transactions to the smart contract

4. **PairsService** (`server/src/services/PairsService.ts`)
   - Fetches pair reserves and metadata using multicall
   - Retrieves token information (decimals, symbols)
   - Provides real-time liquidity data

5. **BigMath** (`server/src/utils/BigMath.ts`)
   - Precision mathematics for bigint operations
   - Implements sqrt, multiply, divide with 18 decimal precision
   - Handles decimal normalization and conversion

**Supported Chains**:
- Ethereum (Mainnet)
- Polygon
- Arbitrum

**Monitored Pairs** (Arbitrum):
- USDC/WETH (SushiSwap)
- USDC/WETH (Camelot)

## Mathematical Model

The bot calculates the optimal arbitrage amount using the following approach:

Given two Uniswap V2 pairs with reserves `(reserveAIn, reserveAOut)` and `(reserveBIn, reserveBOut)`, the optimal arbitrage amount `amountIn` is derived from solving the quadratic equation:

```
a * x^2 + b * x + c = 0
```

Where:
- `a = k^2`
- `b = 2 * k * reservesIn`
- `c = reservesIn^2 - (oneMinusFee^2 * reservesIn * reservesOut)`
- `k = oneMinusFee * reserveBIn + oneMinusFee^2 * reserveAOut`
- `oneMinusFee = 997/1000` (accounting for 0.3% Uniswap fee)

The optimal amount maximizes profit while accounting for slippage and trading fees across both pairs.

## Project Structure

```
arbitrage-uniswap-v2-bot/
├── foundry/                          # Smart contract development
│   ├── src/
│   │   └── ArbitrageBotUniswapV2.sol # Main arbitrage contract
│   ├── script/
│   │   └── UniswapV2BotDeployer.s.sol # Deployment script
│   ├── test/
│   │   ├── ArbitrageBotUniswapV2.test.sol
│   │   └── e-2-e/
│   │       └── ArbitrumBotUniswapV2.test.sol
│   └── lib/                          # Dependencies
│       ├── forge-std/
│       ├── openzeppelin-contracts/
│       ├── v2-core/
│       └── v2-periphery/
│
└── server/                           # TypeScript monitoring server
    ├── src/
    │   ├── constants/               # Configuration constants
    │   │   ├── AbiConstants.ts
    │   │   ├── ArbitrageV2Constants.ts
    │   │   └── ChainConstants.ts
    │   ├── services/               # Core services
    │   │   ├── ConfigsService.ts
    │   │   ├── FlashSwapArbitrageService.ts
    │   │   ├── PairsService.ts
    │   │   ├── StrategiesFactoryService.ts
    │   │   └── ViemClientsService.ts
    │   ├── strategies/             # Arbitrage strategies
    │   │   ├── ArbitrageV2Strategy.ts
    │   │   └── IArbitrageStrategy.ts
    │   ├── types/                  # TypeScript types
    │   ├── utils/                  # Utility functions
    │   │   ├── ArbitrageMath.ts
    │   │   └── BigMath.ts
    │   └── index.ts                # Entry point
    └── test/
        └── ArbitrageMath.test.ts
```

## Setup and Installation

### Prerequisites

- Node.js (v18+)
- Foundry (for smart contract development)
- Git

### Smart Contract Setup

```bash
cd foundry

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run end-to-end tests
forge test --match-contract ArbitrumBotUniswapV2Test

# Deploy to network
forge script script/UniswapV2BotDeployer.s.sol:UniswapV2BotDeployer --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

### Server Setup

```bash
cd server

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run in development mode
npm run dev

# Build TypeScript
npm run build
```

### Environment Variables

Create a `.env` file in the server directory:

```env
EVM_WALLET_PRIVATE_KEY=<your_private_key>
```

## Usage

### Running the Bot

```bash
cd server
npm run dev
```

The bot will:
1. Initialize strategies for configured chain pairs
2. Fetch current reserves from DEX pairs
3. Calculate optimal arbitrage amounts
4. Execute profitable opportunities through the smart contract
5. Log transaction hashes and results

### Adding New Trading Pairs

Edit `server/src/constants/ArbitrageV2Constants.ts`:

```typescript
export const ARBITRUM_V2_PAIRS: TradingPair[] = [
  {
    address: "0x...",
    name: "TOKEN0/TOKEN1 (DEX_NAME)",
  },
  // Add more pairs
];
```

### Adding New Chains

1. Add chain configuration in `server/src/constants/ChainConstants.ts`
2. Deploy the smart contract to the new chain
3. Add contract address in `server/src/constants/ArbitrageV2Constants.ts`
4. Create strategy configuration for the new chain

## Smart Contract Interface

### flashSwapArbitrage

```solidity
function flashSwapArbitrage(
    address pair0,      // First DEX pair address
    address pair1,      // Second DEX pair address
    bool isZeroForOne,  // Swap direction (token0 to token1 or vice versa)
    uint256 amountIn,   // Input amount for arbitrage
    uint256 minProfit   // Minimum profit requirement
) external onlyOwner
```

### Events

```solidity
event ProfitMade(
    address indexed caller,
    address indexed token,
    uint256 profit
);
```

## Testing

### Smart Contract Tests

```bash
cd foundry
forge test -vvv
```

**Test Coverage**:
- Unit tests for flash swap execution
- Integration tests with mock pairs
- End-to-end tests on forked Arbitrum network

### Server Tests

```bash
cd server
npm test
```

**Test Coverage**:
- ArbitrageMath calculations
- Reserve normalization
- Optimal amount computation
- Swap direction logic

## Security Considerations

1. **Owner-Only Execution**: Smart contract functions are restricted to the contract owner
2. **Profit Validation**: Transactions revert if minimum profit is not met
3. **Reentrancy Protection**: Flash swap callback validates sender and pair addresses
4. **Private Key Management**: Private keys should be stored securely, not hardcoded
5. **Gas Optimization**: Contract uses efficient Uniswap V2 formulas to minimize gas costs

## Known Limitations

1. **Price Impact**: Large trades may experience significant slippage
2. **MEV Competition**: Vulnerable to front-running by MEV bots
3. **Gas Costs**: Profitability depends on gas prices and transaction costs
4. **Network Latency**: Off-chain monitoring has inherent delays
5. **Limited Pairs**: Currently monitors a small subset of available pairs

## Future Improvements

- [ ] Implement Flashbots integration for MEV protection
- [ ] Add support for Uniswap V3 concentrated liquidity
- [ ] Implement multi-hop arbitrage across 3+ pools
- [ ] Add real-time mempool monitoring
- [ ] Implement dynamic gas price optimization
- [ ] Add profit tracking and analytics dashboard
- [ ] Support for more DEX protocols (Curve, Balancer, etc.)
- [ ] Implement automatic pair discovery
- [ ] Add WebSocket subscriptions for real-time reserve updates

## License

MIT

## Resources

- [Uniswap V2 Documentation](https://docs.uniswap.org/contracts/v2/overview)
- [Foundry Book](https://book.getfoundry.sh/)
- [Viem Documentation](https://viem.sh/)
- [Flash Swaps Explained](https://docs.uniswap.org/contracts/v2/guides/smart-contract-integration/using-flash-swaps)

## Disclaimer

This software is provided for educational purposes only. Use at your own risk. The authors are not responsible for any financial losses incurred through the use of this bot. Always test thoroughly on testnets before deploying to mainnet.

