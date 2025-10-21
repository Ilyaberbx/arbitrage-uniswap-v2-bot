import { strategiesFactoryService } from "./services/StrategiesFactoryService";

async function main() {
  const strategies = strategiesFactoryService.createStrategies();
  const promises = strategies.map(async (strategy) => {
    return strategy.tick();
  });

  while (true) {
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }
}

main().catch(console.error);
