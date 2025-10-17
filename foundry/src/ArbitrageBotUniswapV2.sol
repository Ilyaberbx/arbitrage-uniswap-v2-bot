// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import {IERC20} from "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import {IUniswapV2Factory} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

error ArbitrageBotUniswapV2_RouterAddressIsZero();
error ArbitrageBotUniswapV2_TokenAddressIsZero();
error ArbitrageBotUniswapV2_AmountInIsZero();
error ArbitrageBotUniswapV2_MinProfitIsZero();
error ArbitrageBotUniswapV2_PairAddressIsZero();
error ArbitrageBotUniswapV2_NotEnoughProfit();
error ArbitrageBotUniswapV2_InvalidUniswapV2CallSender();

contract ArbitrageBotUniswapV2 {
    /**
    @title FlashSwapParams
    @notice Params for the flash swap arbitrage
    @param caller The address of the caller of the flash swap
    @param pair0 The address of the first pair to get the flash swap from
    @param pair1 The address of the second pair to swap to
    @param isZeroForOne True if the flash swap is token0 -> token1, false if token1 -> token0
    @param amountIn The amount in to repay the flash swap
    @param amountOut The amount out to borrow from the flash swap
    @param minProfit The minimum profit to make
    */
    struct FlashSwapParams {
        address caller;
        address pair0;
        address pair1;
        bool isZeroForOne;
        uint256 amountIn;
        uint256 amountOut;
        uint256 minProfit;
    }

    function flashSwapArbitrage(
        address pair0,
        address pair1,
        bool isZeroForOne,
        uint256 amountIn,
        uint256 minProfit
    ) external {
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair0)
            .getReserves();

        uint256 amountOut = _getAmountOut(
            amountIn,
            isZeroForOne ? reserve0 : reserve1,
            isZeroForOne ? reserve1 : reserve0
        );

        bytes memory data = abi.encode(
            FlashSwapParams(
                msg.sender,
                pair0,
                pair1,
                isZeroForOne,
                amountIn,
                amountOut,
                minProfit
            )
        );

        IUniswapV2Pair(pair0).swap({
            amount0Out: isZeroForOne ? 0 : amountOut,
            amount1Out: isZeroForOne ? amountOut : 0,
            to: address(this),
            data: data
        });
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external {
        FlashSwapParams memory params = abi.decode(data, (FlashSwapParams));
        address token0 = IUniswapV2Pair(params.pair0).token0();
        address token1 = IUniswapV2Pair(params.pair0).token1();

        address tokenIn = params.isZeroForOne ? token0 : token1;
        address tokenOut = params.isZeroForOne ? token1 : token0;
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(params.pair1)
            .getReserves();
        uint256 amountOut = params.isZeroForOne
            ? _getAmountOut(params.amountOut, reserve1, reserve0)
            : _getAmountOut(params.amountOut, reserve0, reserve1);

        IERC20(tokenOut).transfer(params.pair1, params.amountOut);
        IUniswapV2Pair(params.pair1).swap({
            amount0Out: params.isZeroForOne ? amountOut : 0,
            amount1Out: params.isZeroForOne ? 0 : amountOut,
            to: address(this),
            data: data
        });
        IERC20(tokenIn).transfer(params.pair0, params.amountIn);
        uint256 profit = amountOut - params.amountIn;
        require(
            profit >= params.minProfit,
            ArbitrageBotUniswapV2_NotEnoughProfit()
        );
        IERC20(tokenIn).transfer(params.caller, profit);
    }

    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }
}
