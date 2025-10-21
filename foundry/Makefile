include .env

PHONY: deploy

deploy-anvil:	
	@forge script script/UniswapV2BotDeployer.s.sol:UniswapV2BotDeployer --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --verify -vvvv

deploy-ethereum:	
	@forge script script/UniswapV2BotDeployer.s.sol:UniswapV2BotDeployer --rpc-url ${ETH_MAINNET_URL} --broadcast --account uniswapV2Bot --verify -vvvv

deploy-arbitrum:	
	@forge script script/UniswapV2BotDeployer.s.sol:UniswapV2BotDeployer --rpc-url ${ARBITRUM_MAINNET_URL} --broadcast --account uniswapV2Bot --verify -vvvv