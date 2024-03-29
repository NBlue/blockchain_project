// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./token.sol";
import "hardhat/console.sol";

contract TokenExchange is Ownable {
    string public exchange_name = "Duhana";

    address tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3; // TODO: paste token contract address here
    Token public token = Token(tokenAddr);

    // Liquidity pool for the exchange
    uint private token_reserves = 0; //Số custom token trong bể thanh khoản
    uint private eth_reserves = 0; //Số native token trong bể thanh khoản

    mapping(address => uint) private lps; // Lỉ lệ x/1000 %

    // Needed for looping through the keys of the lps mapping
    address[] private lp_providers; // Mảng lưu trữ địa chỉ của nhà cung cấp thanh khoản

    // liquidity rewards - tỉ lệ phí giao dịch khi chuyển khoản: 3%
    uint private swap_fee_numerator = 3;
    uint private swap_fee_denominator = 100;

    // Constant: x * y = k
    uint private k;

    event SwapETHForToken(uint256 amountToken);
    event SwapTokenForETH(uint256 amountETH);

    constructor() {}

    function getValueTest()
        public
        view
        returns (
            address[] memory,
            uint256,
            uint256,
            uint256[] memory,
            uint,
            uint
        )
    {
        uint256 total = token.totalSupply();
        uint256[] memory lpValues = new uint256[](lp_providers.length);
        for (uint256 i = 0; i < lp_providers.length; i++) {
            lpValues[i] = lps[lp_providers[i]];
        }
        return (lp_providers, total, k, lpValues, token_reserves, eth_reserves);
    }

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    // -------------------------------------------------------------------------------------------
    // Khởi tạo bể thanh khoản giữa native token và custom token
    // amountTokens: só lượng token được chuyển từ nhà cung cấp thanh khoản
    // Chuyển amountTokens đến sc và cập nhật số lượng DHN và ETH trong bể thanh khoản
    function createPool(uint amountTokens) external payable onlyOwner {
        // This function is already implemented for you; no changes needed.

        // require pool does not yet exist: - Đảm bảo chỉ có thể tạo 1 bể thanh khoản mới nếu bể thanh khoản trước đó không tồn tại
        require(token_reserves == 0, "Token reserves was not 0");
        require(eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent - Đảm bảo giá trị ETH được gửi vào sc > 0
        require(msg.value > 0, "Need eth to create pool.");
        uint tokenSupply = token.balanceOf(msg.sender);
        require(
            amountTokens <= tokenSupply,
            "Not have enough tokens to create the pool"
        );
        require(amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves = token.balanceOf(address(this));
        eth_reserves = msg.value;
        k = token_reserves * eth_reserves;

        lps[msg.sender] = 1000;
        lp_providers.push(msg.sender);
    }

    // Function removeLP: removes a liquidity provider from the list.
    // This function also removes the gap left over from simply running "delete".
    // -------------------------------------------------------------------------------------------
    // Loại bỏ nhà cung cấp thanh khoản ra khỏi danh sách
    // Nhận index và check trong mảng lp_provider
    // Chuyển phần tử cuối cùng sang vị trị cần xóa và sau đó xóa phần tử cuối cùng
    function removeLP(uint index) private {
        require(
            index < lp_providers.length,
            "specified index is larger than the number of lps"
        );
        lp_providers[index] = lp_providers[lp_providers.length - 1];
        lp_providers.pop();
    }

    // Function getSwapFee: Returns the current swap fee ratio to the client.
    function getSwapFee() public view returns (uint, uint) {
        return (swap_fee_numerator, swap_fee_denominator);
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    /* ========================= Liquidity Provider Functions =========================  */

    // Function addLiquidity: Adds liquidity given a supply of ETH (sent to the contract as msg.value).
    // You can change the inputs, or the scope of your function, as needed.
    // (uint max_exchange_rate,uint min_exchange_rate)
    function addLiquidity() external payable {
        uint256 amountDHN = (msg.value * token_reserves) / eth_reserves;
        uint256 userDHNBalance = token.balanceOf(msg.sender);
        require(userDHNBalance >= amountDHN, "Not enough DHN");
        token.transferFrom(msg.sender, address(this), amountDHN);

        updateAddStake(msg.sender, msg.value);

        token_reserves = token.balanceOf(address(this));
        eth_reserves = address(this).balance;
        k = token_reserves * eth_reserves;
    }

    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    // uint max_exchange_rate, uint min_exchange_rate
    function removeLiquidity(uint amountETH) public payable {
        bool isLP = false; // Có phải address của Liquidity Provider gọi hàm không?
        for (uint i = 0; i < lp_providers.length; i++) {
            if (lp_providers[i] == msg.sender) {
                isLP = true;
                break;
            }
        }
        require(isLP, "Address is not a liquidity provider");
        require(amountETH > 0, "Invalid input");

        uint256 senderETH = (lps[msg.sender] * eth_reserves) / 1000;
        require(
            amountETH <= senderETH,
            "Can't remove liquidity > your staking"
        );

        uint256 amountDHN = (token_reserves * amountETH) / eth_reserves;
        require(
            amountDHN < token_reserves,
            "Can't remove liquidity because pool will be zero"
        );
        require(
            amountETH < eth_reserves,
            "Can't remove liquidity because pool will be zero"
        );

        token.transfer(msg.sender, amountDHN);
        (bool success, ) = payable(msg.sender).call{value: amountETH}("");
        require(success);

        updateRemoveStake(msg.sender, amountETH);

        token_reserves = token.balanceOf(address(this));
        eth_reserves = address(this).balance;
        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    // Xóa tất cả thanh khoản mà msg.sender được quyền rút
    // uint max_exchange_rate, uint min_exchange_rate
    function removeAllLiquidity() external payable {
        bool isLP = false;
        for (uint i = 0; i < lp_providers.length; i++) {
            if (lp_providers[i] == msg.sender) {
                isLP = true;
                break;
            }
        }
        require(isLP, "Address is not a liquidity provider");

        uint256 senderETH = (lps[msg.sender] * eth_reserves) / 1000;
        uint256 senderDHN = (lps[msg.sender] * token_reserves) / 1000;

        require(
            senderDHN < token_reserves,
            "Can't remove liquidity because pool will be zero"
        );
        require(
            senderETH < eth_reserves,
            "Can't remove liquidity because pool will be zero"
        );

        token.transfer(msg.sender, senderDHN);
        (bool success, ) = payable(msg.sender).call{value: senderETH}("");
        require(success);

        updateRemoveAllStake(msg.sender);

        token_reserves = token.balanceOf(address(this));
        eth_reserves = address(this).balance;
        k = token_reserves * eth_reserves;
    }

    /***  Define additional functions for liquidity fees here as needed ***/
    function updateAddStake(address provider, uint256 ethSend) private {
        bool isLP = false;
        uint256 oldETHtoken;

        for (uint i = 0; i < lp_providers.length; i++) {
            if (lp_providers[i] != provider) {
                oldETHtoken = (lps[lp_providers[i]] * eth_reserves) / 1000;
                lps[lp_providers[i]] =
                    (1000 * oldETHtoken) /
                    address(this).balance;
            } else {
                isLP = true;
                oldETHtoken = (lps[provider] * eth_reserves) / 1000;
                lps[provider] =
                    (1000 * (ethSend + oldETHtoken)) /
                    address(this).balance;
            }
        }

        if (!isLP) {
            lps[provider] = (1000 * ethSend) / address(this).balance;
            lp_providers.push(provider);
        }
        sumRatioAs1();
    }

    function updateRemoveStake(address provider, uint256 senderETH) private {
        uint256 oldETH;
        for (uint i = 0; i < lp_providers.length; i++) {
            if (lp_providers[i] != provider) {
                oldETH = (lps[lp_providers[i]] * eth_reserves) / 1000;
                lps[lp_providers[i]] = (1000 * oldETH) / address(this).balance;
            } else {
                oldETH = (lps[provider] * eth_reserves) / 1000;
                uint256 curETH = oldETH - senderETH;
                if (curETH != 0) {
                    lps[provider] = (1000 * curETH) / address(this).balance;
                } else {
                    removeLP(i);
                    delete lps[provider];
                }
            }
        }
        sumRatioAs1();
    }

    function updateRemoveAllStake(address provider) private {
        uint256 index = 0;
        while (index < lp_providers.length && lp_providers[index] != provider) {
            index++;
        }
        removeLP(index);
        delete lps[provider];

        for (uint i = 0; i < lp_providers.length; i++) {
            uint256 oldETH = (lps[lp_providers[i]] * eth_reserves) / 1000;
            lps[lp_providers[i]] = (1000 * oldETH) / address(this).balance;
        }
        sumRatioAs1();
    }

    // Tổng Lps luôn là 1;
    function sumRatioAs1() private {
        uint256 sumOtherRatio = 0;
        for (uint i = 1; i < lp_providers.length; i++) {
            sumOtherRatio += lps[lp_providers[i]];
        }
        lps[lp_providers[0]] = 1000 - sumOtherRatio;
    }

    /* ========================= Swap Functions =========================  */

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    // uint max_exchange_rate
    function swapTokensForETH(
        uint amountTokens,
        uint max_exchange_rate
    ) external payable {
        require(amountTokens > 0, "Not enough ETH sent");
        uint256 inputEthWithFee = amountTokens *
            (swap_fee_denominator - swap_fee_numerator); // 97%
        uint256 amountETH = getAmount(
            inputEthWithFee,
            token_reserves,
            eth_reserves
        );
        require(
            eth_reserves - amountETH >= 10 ** 18,
            "Can't swap because pool ETH will be zero"
        );

        // Check độ trượt giá
        uint256 eth_perfect = (inputEthWithFee * eth_reserves) /
            (swap_fee_denominator * token_reserves);
        uint256 slippage = ((eth_perfect - amountETH) * 1000) / eth_perfect;
        console.log("Slippage: ", slippage);
        require(
            slippage <= max_exchange_rate * 10,
            "Unable to trade because of excessive slippage"
        );

        // Ngưỡng đặt cho phép thực hiện swap
        token.transferFrom(msg.sender, address(this), amountTokens);
        (bool success, ) = payable(msg.sender).call{value: amountETH}("");
        require(success);
        token_reserves = token.balanceOf(address(this));
        eth_reserves = address(this).balance;
        emit SwapTokenForETH(amountETH);
    }

    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens(uint max_exchange_rate) external payable {
        require(msg.value > 0, "Not enough ETH to swap");
        uint256 inputEthWithFee = msg.value *
            (swap_fee_denominator - swap_fee_numerator); // 97%
        uint256 amountDHN = getAmount(
            inputEthWithFee,
            eth_reserves,
            token_reserves
        );
        require(
            token_reserves - amountDHN >= 10 ** 18,
            "Can't swap because pool DHN will be zero"
        );

        // Check độ trượt giá
        uint256 token_perfect = (inputEthWithFee * token_reserves) /
            (swap_fee_denominator * eth_reserves);
        uint256 slippage = ((token_perfect - amountDHN) * 1000) / token_perfect;
        console.log("Slippage: ", slippage);
        if (slippage <= max_exchange_rate * 10) {
            token.transfer(msg.sender, amountDHN);
            token_reserves = token.balanceOf(address(this));
            eth_reserves = address(this).balance;
            emit SwapETHForToken(amountDHN);
        } else {
            (bool success, ) = payable(msg.sender).call{value: msg.value}(""); //Hoàn lại lượng eth đã gửi Vì không thể hoán đổi
            require(success);
            require(
                slippage <= max_exchange_rate * 10,
                "Unable to trade because of excessive slippage"
            );
        }
    }

    // Caculate token when it swapped
    function getAmount(
        uint256 inputAmount,
        uint256 reserveX,
        uint256 reserveY
    ) public view returns (uint256) {
        uint256 numerator = reserveY * inputAmount;
        uint256 denominator = (reserveX * swap_fee_denominator + inputAmount);
        uint256 outputAmount = numerator / denominator;
        return outputAmount;
    }
}
