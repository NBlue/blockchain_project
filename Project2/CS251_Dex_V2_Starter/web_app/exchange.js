// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //

// Set up Ethers.js
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
var defaultAccount;

const exchange_name = 'Duhana';

const token_name = 'DuhanaToken';
const token_symbol = 'DHN';

// =============================================================================
//                          ABIs: Paste Your ABIs Here
// =============================================================================

// TODO: Paste your token and exchange contract ABIs in abi.js!

// TODO: Paste your token contract address here:
const token_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const token_abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'MintingDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disable_mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const token_contract = new ethers.Contract(token_address, token_abi, provider.getSigner());

// TODO: Paste your exchange address here
const exchange_abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToken',
        type: 'uint256',
      },
    ],
    name: 'SwapETHForToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountETH',
        type: 'uint256',
      },
    ],
    name: 'SwapTokenForETH',
    type: 'event',
  },
  {
    inputs: [],
    name: 'addLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountTokens',
        type: 'uint256',
      },
    ],
    name: 'createPool',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'exchange_name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveY',
        type: 'uint256',
      },
    ],
    name: 'getAmount',
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
    inputs: [],
    name: 'getSwapFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    inputs: [],
    name: 'getValueTest',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'removeAllLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountETH',
        type: 'uint256',
      },
    ],
    name: 'removeLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'max_exchange_rate',
        type: 'uint256',
      },
    ],
    name: 'swapETHForTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountTokens',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'max_exchange_rate',
        type: 'uint256',
      },
    ],
    name: 'swapTokensForETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract Token',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const exchange_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const exchange_contract = new ethers.Contract(exchange_address, exchange_abi, provider.getSigner());

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

/*** INIT ***/
async function init() {
  var poolState = await getPoolState();
  console.log('starting init');
  // console.log({ poolState });
  if (poolState['token_liquidity'] === 0 && poolState['eth_liquidity'] === 0) {
    // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
    const total_supply = 100000;
    const half_total_supply = parseTokenAmountMul(total_supply / 2);
    await token_contract.connect(provider.getSigner(defaultAccount)).mint(half_total_supply);
    await token_contract.connect(provider.getSigner(defaultAccount)).mint(half_total_supply);
    await token_contract.connect(provider.getSigner(defaultAccount)).disable_mint();
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .approve(exchange_address, parseTokenAmountMul(total_supply));
    // // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1

    await exchange_contract
      .connect(provider.getSigner(defaultAccount))
      .createPool(parseTokenAmountMul(5000), { value: ethers.utils.parseUnits('5000', 'ether') });
    console.log('init finished');

    // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
  }

  const valueTest = await exchange_contract
    .connect(provider.getSigner(defaultAccount))
    .getValueTest();
  console.log({ lp_provider: valueTest[0] });
  // // console.log('total: ', valueTest[1].toString());
  // // console.log('K: ', valueTest[2].toString());
  console.log({ lpValue: valueTest[3] });
  // console.log('Token pool: ', valueTest[4].toString());
  // console.log('ETH pool: ', valueTest[5].toString());
}

// Lấy trạng trái của 1 bể thanh khoản (số lượng vs tỉ giá)
async function getPoolState() {
  // read pool balance for each type of liquidity:
  let liquidity_tokens = await token_contract
    .connect(provider.getSigner(defaultAccount))
    .balanceOf(exchange_address);
  liquidity_tokens = parseTokenAmountDiv(liquidity_tokens);
  let liquidity_eth = await provider.getBalance(exchange_address);
  liquidity_eth = parseTokenAmountDiv(liquidity_eth);
  return {
    token_liquidity: liquidity_tokens,
    eth_liquidity: liquidity_eth,
    token_eth_rate: liquidity_tokens / liquidity_eth,
    eth_token_rate: liquidity_eth / liquidity_tokens,
  };
}

function parseTokenAmountDiv(amountTokens) {
  const numberString = amountTokens.toString();
  const convertDHN = Number(`${numberString.slice(0, -18)}.${numberString.slice(-18)}`);
  return convertDHN;
}

function parseTokenAmountMul(amountTokens) {
  const decimals = ethers.BigNumber.from(18);
  const unit = ethers.BigNumber.from(10).pow(decimals);
  return ethers.BigNumber.from(amountTokens).mul(unit).toString();
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100.
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
  try {
    const eth = amountEth.toString();
    const balance = await token_contract.balanceOf(defaultAccount);
    const contractDHNSigner = await token_contract.connect(provider.getSigner(defaultAccount));
    const contractExchangeSigner = await exchange_contract.connect(
      provider.getSigner(defaultAccount)
    );
    await contractDHNSigner.approve(exchange_address, balance);
    const tx = await contractExchangeSigner.addLiquidity({
      value: ethers.utils.parseUnits(eth, 'ether'),
    });
    await tx.wait();
    alert('Add liquidity successfully!');
  } catch (error) {
    console.log(error);
    const errorMessage = error.error.message;
    alert(errorMessage);
  }
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
  try {
    const eth = amountEth.toString();
    const contractExchangeSigner = await exchange_contract.connect(
      provider.getSigner(defaultAccount)
    );
    const tx = await contractExchangeSigner.removeLiquidity(parseTokenAmountMul(eth));
    await tx.wait();
    alert('Remove liquidity successfully!');
  } catch (error) {
    console.log(error);
    const errorMessage = error.error.message;
    alert(errorMessage);
  }
}

async function removeAllLiquidity(maxSlippagePct) {
  try {
    const tx = await exchange_contract
      .connect(provider.getSigner(defaultAccount))
      .removeAllLiquidity();
    await tx.wait();
    alert('Remove all liquidity successfully!');
  } catch (error) {
    console.log(error);
    const errorMessage = error.error.message;
    alert(errorMessage);
  }
}

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
  try {
    const token = amountToken.toString();
    const slippage = maxSlippagePct.toString();
    const contractExchangeSigner = await exchange_contract.connect(
      provider.getSigner(defaultAccount)
    );
    const contractDHNSigner = await token_contract.connect(provider.getSigner(defaultAccount));
    await contractDHNSigner.approve(exchange_address, parseTokenAmountMul(token));
    const tx = await contractExchangeSigner.swapTokensForETH(parseTokenAmountMul(token), slippage);
    await tx.wait();

    await contractExchangeSigner.on('SwapTokenForETH', (amountETH) => {
      alert(
        `Address: ${defaultAccount}\nSwap: ${amountToken} (DHN)\nReceive: ${parseTokenAmountDiv(
          amountETH
        )} (ETH)`
      );
    });
  } catch (error) {
    console.log(error);
    alert(error.error.message);
  }
}

async function swapETHForTokens(amountEth, maxSlippagePct) {
  try {
    const eth = amountEth.toString();
    const splippage = maxSlippagePct.toString();
    const contractSigner = await exchange_contract.connect(provider.getSigner(defaultAccount));
    const tx = await contractSigner.swapETHForTokens(splippage, {
      value: ethers.utils.parseUnits(eth, 'ether'),
    });
    await tx.wait();

    await contractSigner.on('SwapETHForToken', (amountToken) => {
      alert(
        `Address: ${defaultAccount}\nSwap: ${amountEth} (ETH)\nReceive: ${parseTokenAmountDiv(
          amountToken
        )} (DHN)`
      );
    });
  } catch (error) {
    console.log(error);
    alert(error.error.message);
  }
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response) => {
  defaultAccount = response[0];
  // Initialize the exchange
  init().then(() => {
    // fill in UI with current exchange rate:
    getPoolState().then((poolState) => {
      $('#eth-token-rate-display').html(
        '1 ETH = ' + poolState['token_eth_rate'] + ' ' + token_symbol
      );
      $('#token-eth-rate-display').html(
        '1 ' + token_symbol + ' = ' + poolState['eth_token_rate'] + ' ETH'
      );

      $('#token-reserves').html(poolState['token_liquidity'] + ' ' + token_symbol);
      $('#eth-reserves').html(poolState['eth_liquidity'] + ' ETH');
    });
  });
});

// ------ Them code phan nay:
// Lấy số dư ETH
async function getETHBalance(walletAddress) {
  const balance = await provider.getBalance(walletAddress);
  console.log(`ETH balance address ${walletAddress}: ${ethers.utils.formatEther(balance)}`);
  return balance;
}

// Lấy số dư token
async function getTokenBalance(walletAddress) {
  const balance = await token_contract.balanceOf(walletAddress);
  console.log(`Token balance address ${walletAddress}: ${balance}`);
  return balance;
}
// --------------------

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    // getETHBalance(a);
    // getTokenBalance(a);
    return '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + '</option>';
  });
  $('.account').html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$('#swap-eth').click(function () {
  defaultAccount = $('#myaccount').val(); //sets the default account
  swapETHForTokens($('#amt-to-swap').val(), $('#max-slippage-swap').val()).then((response) => {
    // window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This runs the 'swapTokensForETH' function when you click the button
$('#swap-token').click(function () {
  defaultAccount = $('#myaccount').val(); //sets the default account
  swapTokensForETH($('#amt-to-swap').val(), $('#max-slippage-swap').val()).then((response) => {
    // window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This runs the 'addLiquidity' function when you click the button
$('#add-liquidity').click(function () {
  console.log('Account: ', $('#myaccount').val());
  defaultAccount = $('#myaccount').val(); //sets the default account
  addLiquidity($('#amt-eth').val(), $('#max-slippage-liquid').val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This runs the 'removeLiquidity' function when you click the button
$('#remove-liquidity').click(function () {
  defaultAccount = $('#myaccount').val(); //sets the default account
  removeLiquidity($('#amt-eth').val(), $('#max-slippage-liquid').val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This runs the 'removeAllLiquidity' function when you click the button
$('#remove-all-liquidity').click(function () {
  defaultAccount = $('#myaccount').val(); //sets the default account
  removeAllLiquidity($('#max-slippage-liquid').val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

$('#swap-eth').html('Swap ETH for ' + token_symbol);

$('#swap-token').html('Swap ' + token_symbol + ' for ETH');

$('#title').html(exchange_name);

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
  $('#log').html($('#log').html() + description + ': ' + JSON.stringify(obj, null, 2) + '\n\n');
}

// =============================================================================
//                                SANITY CHECK
// =============================================================================
function check(name, swap_rate, condition) {
  if (condition) {
    console.log(name + ': SUCCESS');
    return swap_rate == 0 ? 6 : 10;
  } else {
    console.log(name + ': FAILED');
    return 0;
  }
}

const sanityCheck = async function () {
  var swap_fee = await exchange_contract.connect(provider.getSigner(defaultAccount)).getSwapFee();
  console.log('Beginning Sanity Check.');

  var accounts = await provider.listAccounts();
  defaultAccount = accounts[0];
  var score = 0;
  var start_state = await getPoolState();
  //
  var start_tokens = await token_contract
    .connect(provider.getSigner(defaultAccount))
    .balanceOf(defaultAccount);

  // No liquidity provider rewards implemented yet
  if (Number(swap_fee[0]) == 0) {
    await swapETHForTokens(100, 2);
    var state1 = await getPoolState();
    var expected_tokens_received = 100 * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Testing simple exchange of ETH to token',
      swap_fee[0],
      Math.abs(start_state.token_liquidity - expected_tokens_received - state1.token_liquidity) <
        5 &&
        state1.eth_liquidity - start_state.eth_liquidity === 100 &&
        Math.abs(Number(start_tokens) + expected_tokens_received - Number(user_tokens1)) < 5
    );

    await swapTokensForETH(100, 2);
    var state2 = await getPoolState();
    var expected_eth_received = 100 * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test simple exchange of token to ETH',
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 100 &&
        Math.abs(state1.eth_liquidity - expected_eth_received - state2.eth_liquidity) < 5 &&
        Number(user_tokens2) === Number(user_tokens1) - 100
    );

    await addLiquidity(100, 2);
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test adding liquidity',
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(state3.token_liquidity - (state2.token_liquidity + expected_tokens_added)) < 5 &&
        Math.abs(Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)) < 5
    );

    await removeLiquidity(10, 1);
    var expected_tokens_removed = 10 * state3.token_eth_rate;
    var state4 = await getPoolState();
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test removing liquidity',
      swap_fee[0],
      state4.eth_liquidity === state3.eth_liquidity - 10 &&
        Math.abs(state4.token_liquidity - (state3.token_liquidity - expected_tokens_removed)) < 5 &&
        Math.abs(Number(user_tokens4) - (Number(user_tokens3) + expected_tokens_removed)) < 5
    );

    await removeAllLiquidity(1);
    expected_tokens_removed = 90 * state4.token_eth_rate;
    var state5 = await getPoolState();
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test removing all liquidity',
      swap_fee[0],
      state5.eth_liquidity - (state4.eth_liquidity - 90) < 5 &&
        Math.abs(state5.token_liquidity - (state4.token_liquidity - expected_tokens_removed)) < 5 &&
        Math.abs(Number(user_tokens5) - (Number(user_tokens4) + expected_tokens_removed)) < 5
    );
  }

  // LP provider rewards implemented
  else {
    var swap_fee = swap_fee[0] / swap_fee[1];
    console.log('swap fee: ', swap_fee);

    await swapETHForTokens(100, 2);
    var state1 = await getPoolState();
    var expected_tokens_received = 100 * (1 - swap_fee) * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Testing simple exchange of ETH to token',
      swap_fee[0],
      Math.abs(start_state.token_liquidity - expected_tokens_received - state1.token_liquidity) <
        5 && // ĐK này thấy ...
        state1.eth_liquidity - start_state.eth_liquidity === 100 && //DK nay dung
        Math.abs(Number(start_tokens) + expected_tokens_received - Number(user_tokens1)) < 5
    );

    await swapTokensForETH(100, 2);
    var state2 = await getPoolState();
    var expected_eth_received = 100 * (1 - swap_fee) * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test simple exchange of token to ETH',
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 100 &&
        Math.abs(state1.eth_liquidity - expected_eth_received - state2.eth_liquidity) < 5 &&
        Number(user_tokens2) === Number(user_tokens1) - 100
    );

    await addLiquidity(100, 2);
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test adding liquidity',
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(state3.token_liquidity - (state2.token_liquidity + expected_tokens_added)) < 5 &&
        Math.abs(Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)) < 5
    );

    // accumulate some lp rewards
    for (var i = 0; i < 20; i++) {
      await swapETHForTokens(100, 2);
      await swapTokensForETH(100, 2);
    }

    var state4 = await getPoolState();
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    await removeLiquidity(10, 1);
    // set to 22 for a bit of leeway, could potentially reduce to 20
    var expected_tokens_removed = (10 + 22 * 100 * swap_fee) * state3.token_eth_rate;
    var state5 = await getPoolState();
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test removing liquidity',
      swap_fee[0],
      state5.eth_liquidity === state4.eth_liquidity - 10 &&
        Math.abs(state5.token_liquidity - (state4.token_liquidity - expected_tokens_removed)) <
          expected_tokens_removed * 1.2 &&
        Math.abs(Number(user_tokens5) - (Number(user_tokens4) + expected_tokens_removed)) <
          expected_tokens_removed * 1.2
    );

    await removeAllLiquidity(1);
    expected_tokens_removed = (90 + 22 * 100 * swap_fee) * state5.token_eth_rate;
    var state6 = await getPoolState();
    var user_tokens6 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      'Test removing all liquidity',
      swap_fee[0],
      Math.abs(state6.eth_liquidity - (state5.eth_liquidity - 90)) < 5 &&
        Math.abs(state6.token_liquidity - (state5.token_liquidity - expected_tokens_removed)) <
          expected_tokens_removed * 1.2 &&
        Number(user_tokens6) > Number(user_tokens5)
    );
  }
  console.log('Final score: ' + score + '/50');
};

// Sleep 3s to ensure init() finishes before sanityCheck() runs on first load.
// If you run into sanityCheck() errors due to init() not finishing, please extend the sleep time.

// setTimeout(function () {
//   sanityCheck();
// }, 3000);
