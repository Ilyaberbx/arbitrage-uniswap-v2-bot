import { flashSwapService } from './services/FlashSwapService'
import { configManager } from './config/ConfigManager'

async function main() {
  console.log('📋 Available Chains:')
  const chains = configManager.getAllChains()
  chains.forEach((chain) => {
    console.log(`  - ${chain.name} (ID: ${chain.chainId})`)
  })
}
if (require.main === module) {
  main().catch(console.error)
}

export { flashSwapService, configManager }
