import { strategiesFactoryService } from "./services/StrategiesFactoryService";

async function main() {
  const strategies = strategiesFactoryService.createStrategies();

  try {
    const promises = strategies.map(async (strategy) => {
      return strategy.tick();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
}

main().catch(console.error);
