// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {ArbitrageBotUniswapV2} from "../src/ArbitrageBotUniswapV2.sol";

contract UniswapV2BotDeployer is Script {
    function run() public returns (address) {
        vm.startBroadcast();
        new ArbitrageBotUniswapV2();
        vm.stopBroadcast();
    }
}
