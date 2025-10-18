// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import {IERC20} from "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import {Ownable} from "@openzeppelin-contracts/contracts/access/Ownable.sol";

error ArbitrageBotUniswapV2_NotEnoughProfit();
error ArbitrageBotUniswapV2_InvalidUniswapV2CalleeSender();
error ArbitrageBotUniswapV2_InvalidUniswapV2CalleePair();

/**
@title ArbitrageBotUniswapV2
@notice A contract that performs flash swap arbitrage on Uniswap V2
@dev This contract is used to perform flash swap arbitrage on Uniswap V2
@author Illia Verbanov (illiaverbanov.xyz)
*/
contract ArbitrageBotUniswapV2 is Ownable {
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

    /**
    @notice Event emitted when a profit is made
    @param caller The address of the caller of the flash swap
    @param token The token that was used for the profit
    @param profit The profit made in terms of the input token
    */
    event ProfitMade(
        address indexed caller,
        address indexed token,
        uint256 profit
    );

    constructor() Ownable(msg.sender) {}

    /**
    @notice Peforme a flash swap arbitrage (core function)
    @param pair0 The address of the first pair to get the flash swap from
    @param pair1 The address of the second pair to swap to
    @param isZeroForOne True if the flash swap is token0 -> token1, false if token1 -> token0
    @param amountIn The amount in to repay the flash swap
    @param minProfit The minimum profit to make
    */
    function flashSwapArbitrage(
        address pair0,
        address pair1,
        bool isZeroForOne,
        uint256 amountIn,
        uint256 minProfit
    ) external onlyOwner {
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

    /**
    @notice Callback function for the flash swap arbitrage (called by Uniswap V2 Pair)
    @param sender The address of the sender of the flash swap
    @param amount0 The amount of token0 received from the flash swap
    @param amount1 The amount of token1 received from the flash swap
    @param data The data of the flash swap (has to have FlashSwapParams struct encoded in current scenario)
    */
    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external {
        require(
            sender == address(this),
            ArbitrageBotUniswapV2_InvalidUniswapV2CalleeSender()
        );

        FlashSwapParams memory params = abi.decode(data, (FlashSwapParams));

        require(
            msg.sender == params.pair0,
            ArbitrageBotUniswapV2_InvalidUniswapV2CalleePair()
        );

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
            data: ""
        });
        IERC20(tokenIn).transfer(params.pair0, params.amountIn);
        uint256 profit = amountOut - params.amountIn;
        require(
            profit >= params.minProfit,
            ArbitrageBotUniswapV2_NotEnoughProfit()
        );
        emit ProfitMade(params.caller, tokenIn, profit);
        IERC20(tokenIn).transfer(params.caller, profit);
    }

    /**
    @notice Internal function to get the amount out for a flash swap arbitrage affected by fees (Uniswap V2 formula)
    @param amountIn The amount in to get the amount out for
    @param reserveIn The reserve of the input token
    @param reserveOut The reserve of the output token
    @return amountOut The amount out for the flash swap arbitrage
    */
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
