// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console2} from "forge-std/Test.sol";
import {ArbitrageBotUniswapV2} from "../src/ArbitrageBotUniswapV2.sol";
import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import {IERC20} from "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IWETH} from "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";

error OwnableUnauthorizedAccount(address account);

contract ArbitrageBotUniswapV2Test is Test {
    address constant UNISWAP_V2_PAIR_ADDRESS =
        0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc;

    address constant SUSHISWAP_V2_PAIR_ADDRESS =
        0x397FF1542f962076d0BFE58eA045FfA2d347ACa0;

    address constant UNISWAP_V2_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IERC20 constant USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IWETH constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    ArbitrageBotUniswapV2 private s_arbitrageBot;
    address private s_alice = makeAddr("alice");

    event ProfitMade(
        address indexed caller,
        address indexed token,
        uint256 profit
    );

    function setUp() public {
        vm.prank(s_alice);
        s_arbitrageBot = new ArbitrageBotUniswapV2();
    }

    modifier createArbitrageOpportunity() {
        deal(address(this), 1000 ether);
        WETH.deposit{value: 1000 ether}();

        IERC20(address(WETH)).approve(
            UNISWAP_V2_ROUTER_ADDRESS,
            type(uint256).max
        );

        address[] memory path = new address[](2);
        path[0] = address(WETH);
        path[1] = address(USDC);

        IUniswapV2Router02(UNISWAP_V2_ROUTER_ADDRESS).swapExactTokensForTokens(
            500 ether,
            0,
            path,
            address(this),
            block.timestamp
        );

        _;
    }

    function test_creatingArbitrageOpportunity()
        public
        createArbitrageOpportunity
    {
        (uint256 uniReserve0After, uint256 uniReserve1After, ) = IUniswapV2Pair(
            UNISWAP_V2_PAIR_ADDRESS
        ).getReserves();
        (
            uint256 sushiReserve0After,
            uint256 sushiReserve1After,

        ) = IUniswapV2Pair(SUSHISWAP_V2_PAIR_ADDRESS).getReserves();

        uint256 uniRatio = (uniReserve0After * 1e18) / uniReserve1After;
        uint256 sushiRatio = (sushiReserve0After * 1e18) / sushiReserve1After;

        console2.log("Uniswap USDC/WETH ratio:");
        console2.log(uniRatio);
        console2.log("Sushiswap USDC/WETH ratio:");
        console2.log(sushiRatio);
        assertGt(
            sushiRatio,
            uniRatio,
            "Sushiswap USDC/WETH ratio should be greater than Uniswap USDC/WETH ratio"
        );
    }

    function test_flashSwapArbitrage_successfulArbitrage()
        public
        createArbitrageOpportunity
    {
        vm.startPrank(s_alice);
        uint256 initialBalance = IERC20(address(USDC)).balanceOf(s_alice);
        console2.log("Initial balance:", initialBalance);
        s_arbitrageBot.flashSwapArbitrage(
            UNISWAP_V2_PAIR_ADDRESS,
            SUSHISWAP_V2_PAIR_ADDRESS,
            true,
            1e11,
            1e6
        );

        uint256 finalBalance = IERC20(address(USDC)).balanceOf(s_alice);
        console2.log("Final balance:", finalBalance);
        assertGt(
            finalBalance,
            initialBalance,
            "Arbitrage should be profitable"
        );
        console2.log("Profit:", finalBalance - initialBalance);
        vm.stopPrank();
    }

    function test_flashSwapArbitrage_notOwner() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                OwnableUnauthorizedAccount.selector,
                address(this)
            )
        );
        s_arbitrageBot.flashSwapArbitrage(
            UNISWAP_V2_PAIR_ADDRESS,
            SUSHISWAP_V2_PAIR_ADDRESS,
            true,
            1e11,
            1e6
        );
    }

    function test_flashSwapArbitrage_emitsProfitMadeEvent()
        public
        createArbitrageOpportunity
    {
        vm.startPrank(s_alice);
        vm.expectEmit(true, true, false, false);
        emit ProfitMade(s_alice, address(USDC), 0);
        s_arbitrageBot.flashSwapArbitrage(
            UNISWAP_V2_PAIR_ADDRESS,
            SUSHISWAP_V2_PAIR_ADDRESS,
            true,
            1e11,
            1e6
        );
        vm.stopPrank();
    }
}
