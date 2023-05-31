// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.17;

// import "hardhat/console.sol";

contract Splitwise {
// DO NOT MODIFY ABOVE THIS

// ADD YOUR CONTRACT CODE BELOW
    struct DebtInfo {
        address debtor;
        address creditor;
        uint32 amount;
        uint timestamp;
    }
    DebtInfo[] public allDebts;

    // In ra số tiền mà debtor đang nợ creditor
    function lookup(address debtor, address creditor) public view returns (uint32) {
        for (uint256 i = 0; i < allDebts.length; i++) {
            if (allDebts[i].debtor == debtor && allDebts[i].creditor == creditor) {
                return allDebts[i].amount;
            }
        }
        return 0;
    }

    // Thêm 1 IOU nợ nần
    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0, "Amount must be positive");
        bool debtExits = false;

        for (uint256 i = 0; i < allDebts.length; i++) {
            if (allDebts[i].debtor == msg.sender && allDebts[i].creditor == creditor) {
                allDebts[i].amount += amount;
                allDebts[i].timestamp = block.timestamp;
                debtExits = true;
                break;
            }
        }
        if(!debtExits){
            allDebts.push(DebtInfo({
                debtor: msg.sender,
                creditor: creditor,
                amount: amount,
                timestamp: block.timestamp
            }));
        }
      
    }

    // Giải quyết vòng lặp nợ nần
    function OwnFor(uint[] memory indexs, uint32 debReducion) public {
        for(uint i = 0; i < indexs.length; i++){
            allDebts[indexs[i]].amount -= debReducion;
        }
        // Xóa nợ có amount = 0 - Là phần tử cuối cùng
        for (uint i = 0; i < allDebts.length; i++) {
            if (allDebts[i].amount == 0) {
                for (uint256 j = i; j < allDebts.length - 1; j++) {
                    allDebts[j] = allDebts[j + 1];
                }
                allDebts.pop();
                break;
            }
        }
    }


    // Đưa ra tất cả thông tin nợ nần
    function getAllDebts() public view returns (DebtInfo[] memory) {
        return allDebts;
    }

    // Lấy ra thời gian mượn hoặc được mượn IOU mới nhất
    function getLastActive(address user) public view returns (uint) {
        uint lastTimestamp = 0;
        for(uint i = 0; i < allDebts.length; i++){
            if(allDebts[i].debtor == user || allDebts[i].creditor == user) {
                if(allDebts[i].timestamp > lastTimestamp)
                    lastTimestamp = allDebts[i].timestamp;
            }
        }
        return lastTimestamp;
    }

     // Lấy ra tổng nợ hoặc được mượn IOU mới nhất
    function getTotalOwned(address user) public view returns (uint) {
        uint total = 0;
        for(uint i = 0; i < allDebts.length; i++){
            if(allDebts[i].debtor == user) total += allDebts[i].amount;

        }
        return total;
    }
}
