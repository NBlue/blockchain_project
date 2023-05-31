// =============================================================================
//                                  Config
// =============================================================================
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
var defaultAccount;

// Constant we use later
var GENESIS =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'indexs',
        type: 'uint256[]',
      },
      {
        internalType: 'uint32',
        name: 'debReducion',
        type: 'uint32',
      },
    ],
    name: 'OwnFor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creditor',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'amount',
        type: 'uint32',
      },
    ],
    name: 'add_IOU',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allDebts',
    outputs: [
      {
        internalType: 'address',
        name: 'debtor',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creditor',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'amount',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllDebts',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'debtor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'creditor',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'amount',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
        ],
        internalType: 'struct Splitwise.DebtInfo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getLastActive',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getTotalOwned',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'debtor',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creditor',
        type: 'address',
      },
    ],
    name: 'lookup',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]; // FIXME: fill this in with your contract's ABI //Be sure to only have one array, not two
// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // FIXME: fill this in with your contract's address/hash

var BlockchainSplitwise = new ethers.Contract(
  contractAddress,
  abi,
  provider.getSigner()
);

// =============================================================================
//                            Functions To Implement
// =============================================================================

// TODO: Add any helper functions here!

// TODO: Return a list of all users (creditors or debtors) in the system
// All users in the system are everyone who has ever sent or received an IOU
async function getUsers() {
  try {
    const IOUs = await BlockchainSplitwise.getAllDebts();
    return IOUs.map((user) => {
      const shortDebtor =
        user.debtor.slice(0, 6) + '...' + user.debtor.slice(-4);
      const shortCreditor =
        user.creditor.slice(0, 6) + '...' + user.creditor.slice(-4);

      return `From: ${shortDebtor.toLowerCase()} - To: ${shortCreditor.toLowerCase()} - Own: ${
        user.amount
      } - Time: ${timeConverter(user.timestamp)}`;
    });
  } catch (error) {
    console.log({
      message: 'getUser fail!',
      error,
    });
  }
}

// TODO: Get the total amount owed by the user specified by 'user'
async function getTotalOwed(user) {
  try {
    const totalOwed = await BlockchainSplitwise.getTotalOwned(user);
    return totalOwed;
  } catch (error) {
    console.log({
      message: 'getTotalOwed fail!',
      error,
    });
  }
}

// TODO: Get the last time this user has sent or received an IOU, in seconds since Jan. 1, 1970
// Return null if you can't find any activity for the user.
// HINT: Try looking at the way 'getAllFunctionCalls' is written. You can modify it if you'd like.
async function getLastActive(user) {
  try {
    const lastActive = await BlockchainSplitwise.getLastActive(user);
    return lastActive;
  } catch (error) {
    console.log({
      message: 'Get Last Active false fail!',
      error,
    });
  }
}

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_IOU(creditor, amount) {
  try {
    if (!creditor || !amount) return;

    const newSigner = provider.getSigner(defaultAccount);
    BlockchainSplitwise = BlockchainSplitwise.connect(newSigner);
    const transactions = await BlockchainSplitwise.add_IOU(creditor, amount);
    await transactions.wait();

    const result = await doBFS(creditor, defaultAccount, getNeighbors); //Tìm đường đi
    if (result) {
      const debReducions = []; // Mảng chứa các index của IOU tìm được bởi doBFS
      let minAmount = Number.MAX_SAFE_INTEGER; // Số nợ nhỏ nhất trên đường đi BFS

      result.push(creditor);
      const IOUs = await BlockchainSplitwise.getAllDebts();

      for (let i = 0; i < result.length - 1; i++) {
        for (let j = 0; j < IOUs.length; j++) {
          if (
            IOUs[j].debtor.toLowerCase() === result[i].toLowerCase() &&
            IOUs[j].creditor.toLowerCase() === result[i + 1].toLowerCase()
          ) {
            debReducions.push(j);
            if (IOUs[j].amount < minAmount) minAmount = IOUs[j].amount;
          }
        }
      }
      const tx = await BlockchainSplitwise.OwnFor(debReducions, minAmount); // Giải quyết vòng lặp nợ nần
      await tx.wait();
    }
  } catch (error) {
    console.log({
      message: 'IOU added fail!',
      error,
    });
  }
}

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

// This searches the block history for all calls to 'functionName' (string) on the 'addressOfContract' (string) contract
// It returns an array of objects, one for each call, containing the sender ('from'), arguments ('args'), and the timestamp ('t')
/**
 * Tìm kiếm lịch sử block cho tất cả các cuộc gọi tới 'functionName' tren contract 'addressOfContract'
 * Nó trả về mảng các đối tượng, mỗi đối tượng là 1 cuộc gọi
 * */
async function getAllFunctionCalls(addressOfContract, functionName) {
  var curBlock = await provider.getBlockNumber(); // Lấy só Block hiện tại
  var function_calls = [];

  while (curBlock !== GENESIS) {
    //Lặp qua từng block lịch sử từ block hiện tại tới block genesis: block đầu tiên
    var b = await provider.getBlockWithTransactions(curBlock); // Lấy thông tin block và các giao dịch
    var txns = b.transactions;
    for (var j = 0; j < txns.length; j++) {
      // Lặp qua các giao dịch
      var txn = txns[j];

      // check that destination of txn is our contract
      // Kiểm tra dích của giao dịch có phải là contract mà đang quan tâm không?
      if (txn.to == null) {
        continue;
      }
      if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
        var func_call = abiDecoder.decodeMethod(txn.data); // Giải mã dữ giao dịch

        // check that the function getting called in this txn is 'functionName'
        // Kiểm tra hàm được gọi trong giao dịch có phải 'functionName' đang quan tâm đến không?
        if (func_call && func_call.name === functionName) {
          var timeBlock = await provider.getBlock(curBlock);
          var args = func_call.params.map(function (x) {
            return x.value;
          });
          // Push vào mảng {thông tin người gửi, các tham số hàm, thời gian giao dịch}
          function_calls.push({
            from: txn.from.toLowerCase(),
            args: args,
            t: timeBlock.timestamp,
          });
        }
      }
    }
    curBlock = b.parentHash; //Cập nhật giá trị của biến để di chuyển lên block trước đó
  }
  return function_calls;
}

// We've provided a breadth-first search implementation for you, if that's useful
// It will find a path from start to end (or return null if none exists)
// You just need to pass in a function ('getNeighbors') that takes a node (string) and returns its neighbors (as an array)
/**
 * Hàm tìm kiếm theo chiều rộng BFS để tìm một đường đi từ đỉnh start đến điểm end của đồ thị
 * Tham số: Đỉnh bắt đầu, đỉnh kết thức, hàm nhận vào 1 đỉnh và trả về các đỉnh láng giềng của nó
 * */

async function getNeighbors(myAddress) {
  const IOUs = await BlockchainSplitwise.getAllDebts();
  const neighborsIOUs = IOUs.filter(
    (IOU) => IOU.debtor.toLowerCase() === myAddress.toLowerCase()
  );
  const neighborsAddress = neighborsIOUs.map((IOU) => IOU.creditor);
  return neighborsAddress;
}

async function doBFS(start, end, getNeighbors) {
  var queue = [[start]]; // Khởi tạo với mảng chứa đỉnh bắt đầu 'start' được đặt trong mảng con
  while (queue.length > 0) {
    // Lặp tới khi queue trống
    var cur = queue.shift(); // Lấy phần tử đầu tiên
    var lastNode = cur[cur.length - 1]; // Lấy đỉnh cuối cùng của cur
    // Nếu lastNode === end thì trả về đường đi từ start đến end
    if (lastNode.toLowerCase() === end.toString().toLowerCase()) {
      return cur;
    } else {
      var neighbors = await getNeighbors(lastNode); // Lấy danh sách các đỉnh láng giềng
      for (var i = 0; i < neighbors.length; i++) {
        // Lặp để thêm các đỉnh láng giềng vào queue
        queue.push(cur.concat([neighbors[i]]));
      }
    }
  }
  return null; // Nếu ko tìm thấy đường đi thì trả về null
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
// Đặt tài khoản mặc định khi tải và hiển tổng số nwoj của tài khoản đó
provider.listAccounts().then((response) => {
  defaultAccount = response[0];

  getTotalOwed(defaultAccount).then((response) => {
    $('#total_owed').html('$' + response);
  });

  getLastActive(defaultAccount).then((response) => {
    time = timeConverter(response);
    $('#last_active').html(time);
  });
});

// This code updates the 'My Account' UI with the results of your functions
// Cập nhật giao diện người dùng với kết quả function mà mình đã gọi
$('#myaccount').change(function () {
  defaultAccount = $(this).val();

  getTotalOwed(defaultAccount).then((response) => {
    console.log('Change: ', response);
    $('#total_owed').html('$' + response);
  });

  getLastActive(defaultAccount).then((response) => {
    time = timeConverter(response);
    $('#last_active').html(time);
  });
});

// Allows switching between accounts in 'My Account' and the 'fast-copy' in 'Address of person you owe
// Cho phép chuyển đổi giữa tài khoản trong "My Account" và "fast-copyt" tỏng "Address of person you owe"
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    return (
      '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + '</option>'
    );
  });
  $('.account').html(opts);
  $('.wallet_addresses').html(
    response.map(function (a) {
      return '<li>' + a.toLowerCase() + '</li>';
    })
  );
});

// This code updates the 'Users' list in the UI with the results of your function
// Cập nhạt danh sách người dùng với kết quả function đã gọi đến
getUsers().then((response) => {
  $('#all_users').html(
    response.map(function (u, i) {
      return '<li>' + u + '</li>';
    })
  );
});

// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
// Chạy 'add_IOU' khi click button
$('#addiou').click(function () {
  defaultAccount = $('#myaccount').val(); //sets the default account
  add_IOU($('#creditor').val(), $('#amount').val()).then((response) => {
    window.location.reload(false); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
// Nếu muốn hiển thị log trên page thay vì console
function log(description, obj) {
  $('#log').html(
    $('#log').html() +
      description +
      ': ' +
      JSON.stringify(obj, null, 2) +
      '\n\n'
  );
}

// =============================================================================
//                                      TESTING
// =============================================================================

// This section contains a sanity check test that you can use to ensure your code
// works. We will be testing your code this way, so make sure you at least pass
// the given test. You are encouraged to write more tests!

// Remember: the tests will assume that each of the four client functions are
// async functions and thus will return a promise. Make sure you understand what this means.

function check(name, condition) {
  if (condition) {
    console.log(name + ': SUCCESS');
    return 3;
  } else {
    console.log(name + ': FAILED');
    return 0;
  }
}

async function sanityCheck() {
  console.log(
    '\nTEST',
    'Simplest possible test: only runs one add_IOU; uses all client functions: lookup, getTotalOwed, getUsers, getLastActive'
  );

  var score = 0;

  var accounts = await provider.listAccounts();
  defaultAccount = accounts[0];

  var users = await getUsers();
  score += check('getUsers() initially empty', users.length === 0);

  var owed = await getTotalOwed(accounts[1]);
  score += check('getTotalOwed(0) initially empty', owed === 0);

  var lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
  console.log('lookup(0, 1) current value' + lookup_0_1);
  score += check('lookup(0,1) initially 0', parseInt(lookup_0_1, 10) === 0);

  var response = await add_IOU(accounts[1], '10');

  users = await getUsers();
  score += check('getUsers() now length 2', users.length === 2);

  owed = await getTotalOwed(accounts[0]);
  score += check('getTotalOwed(0) now 10', owed === 10);

  lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
  score += check('lookup(0,1) now 10', parseInt(lookup_0_1, 10) === 10);

  var timeLastActive = await getLastActive(accounts[0]);
  var timeNow = Date.now() / 1000;
  var difference = timeNow - timeLastActive;
  score += check(
    'getLastActive(0) works',
    difference <= 60 && difference >= -3
  ); // -3 to 60 seconds

  console.log('Final Score: ' + score + '/21');
}

// sanityCheck() //Uncomment this line to run the sanity check when you first open index.html
