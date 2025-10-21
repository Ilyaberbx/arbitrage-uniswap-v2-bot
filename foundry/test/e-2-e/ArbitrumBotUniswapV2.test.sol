// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Test, console2} from "forge-std/Test.sol";
import {ArbitrageBotUniswapV2} from "../../src/ArbitrageBotUniswapV2.sol";
import {IERC20} from "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import {IWETH} from "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";

contract ArbitrumBotUniswapV2Test is Test {
    address constant SUSHISWAP_V2_PAIR_ADDRESS =
        0x905dfCD5649217c42684f23958568e533C711Aa3;
    address constant CAMELOT_V2_PAIR_ADDRESS =
        0x84652bb2539513BAf36e225c930Fdd8eaa63CE27;

    IERC20 constant USDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
    IWETH constant WETH = IWETH(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);

    address private s_alice = makeAddr("alice");
    ArbitrageBotUniswapV2 private s_arbitrageBot;

    function setUp() public {
        vm.prank(s_alice);
        s_arbitrageBot = new ArbitrageBotUniswapV2();
    }

    function test_e2e_arbitrage_successful() public {
        vm.startPrank(s_alice);
        uint256 initialBalance = IERC20(address(USDC)).balanceOf(s_alice);
        s_arbitrageBot.flashSwapArbitrage(
            CAMELOT_V2_PAIR_ADDRESS,
            SUSHISWAP_V2_PAIR_ADDRESS,
            false,
            420172738952,
            1
        );
        vm.stopPrank();
        uint256 finalBalance = IERC20(address(USDC)).balanceOf(s_alice);
        assertGt(
            finalBalance,
            initialBalance,
            "Arbitrage should be profitable"
        );
        console2.log("Profit:", finalBalance - initialBalance);
    }
}
