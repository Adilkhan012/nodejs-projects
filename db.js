require('dotenv').config();
const dbLink = process.env.DB_LINK;
const dbName = 'UserModel_101'; //+ Date.now();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Web3 = require('web3');
const dbTx = 'TxModel_1';

const TxSchema = new mongoose.Schema({
  tx: {
    type: String,
    default: null,
    unique: true,
    required: true,
  },
  date: { type: String, default: '' + new Date() },
});
const Tx = new mongoose.model(dbTx, TxSchema);

const UserSchema = new mongoose.Schema({
  chatId: {
    type: String,
    default: null,
    // unique: true,
    // required: true,
  },
  userName: {
    type: String,
    default: null,
    unique: true,
    required: true,
  },

  depositedFundsEth: {
    type: Number,
    default: 0, // 0 not added to pool, 1 added to pool, 2 removed from pool and he can not enter again
  },

  status7SponsorPool: {
    type: Number,
    default: 0, // 0 not added to pool, 1 added to pool, 2 removed from pool and he can not enter again
  },
  earnings7SponsorPool: {
    type: Number,
    default: 0, // if earnings go 2x of depositedFunds then person is removed from pool and can not enter gain
  },

  statusSuperStarPool: {
    type: Number,
    default: 0, // 2 removed from pool and he can not enter again
  },
  earningsSuperStarPool: {
    type: Number,
    default: 0, // if earnings go 2x of depositedFunds then person is removed from pool and can not enter gain
  },
  balanceOnEnteringSuperStarPool: {
    type: Number,
    default: 0, // when user gets double of this he is out from pool
  },
  level: {
    type: Number,
    default: 0, // levels 1,2,3,4,5
  },
  level1ChildPaying: {
    type: Number,
    default: 0,
  },
  level2ChildPaying: {
    type: Number,
    default: 0,
  },
  level3ChildPaying: {
    type: Number,
    default: 0,
  },
  level4ChildPaying: {
    type: Number,
    default: 0,
  },
  level5ChildPaying: {
    type: Number,
    default: 0,
  },
  level6ChildPaying: {
    type: Number,
    default: 0,
  },

  depositedFunds: {
    // decides plan of user is START, WALK, RUN or FLY
    type: Number,
    default: 0,
  },
  balance: {
    // referral earnings
    type: Number,
    default: 0,
  },
  totalEarnings: {
    // referral earnings + pool earnings total in history
    type: Number,
    default: 0,
  },
  publicKey: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: 'english',
  },
  mnemonic: {
    type: String,
    default: null,
  },
  parent: {
    type: String, // chatId of the person who referred me
    default: null,
  },
  child: {
    type: [], // chatId of the people I am bringing into the system
    default: [],
  },
  childPaying: {
    type: [], // chatId of the people I am bringing into the system and they deposited money
    default: [],
  },
  date: { type: Number, default: new Date() },
});
const User = new mongoose.model(dbName, UserSchema);
mongoose.connect(dbLink, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const readBook = async (user) => {
  let response = await User.find(user);
  return response[0];
};

const readBooks = async (user) => {
  let response = await User.find(user);
  if (response === undefined) {
    response = [];
  }
  return response;
};

const writeBook = async (user, newUserState) => {
  // only create a user if he does not exist, do not create a duplicate userName
  let responseRead = await readBook(user);
  if (!responseRead) {
    await User.create({ ...user, ...newUserState });
    return;
  }

  await User.updateOne(user, newUserState);
};

const depositFundsEth = async (tx, chainId, userName, botSendMessage) => {
  function validate_txhash(addr) {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }

  console.log({ tx, chainId, userName });

  if (!validate_txhash(tx)) return { status: 'Failed', message: 'Invalid Tx' };

  const user = await readBook({ userName });
  if (!user) return { status: 'Failed', message: 'user not exist' };

  console.log(user);

  const [txInfo] = await Tx.find({ tx });
  if (txInfo) return { status: 'Failed', message: 'tx already recorded' };

  let TON_ADDRESS;
  let BLOCKCHAIN_LINK;
  // TODO: convert if else to obj
  if (chainId === '1') {
    BLOCKCHAIN_LINK = 'https://cloudflare-eth.com/';
    TON_ADDRESS = '0x582d872a1b094fc48f5de31d3b73f2d9be47def1';
  } else if (chainId === '80001') {
    BLOCKCHAIN_LINK = 'https://matic-mumbai.chainstacklabs.com';
    TON_ADDRESS = '0x617237b506af6d6c98bb8607643dc88e4ec5a045';
  } else return { status: 'Failed', message: 'wrong chain id' };

  const web3 = new Web3(BLOCKCHAIN_LINK);
  const txData = await web3.eth.getTransactionReceipt(tx); // TODO: test wrong tx data?
  if (!txData || txData.to.toLowerCase() !== TON_ADDRESS.toLowerCase()) {
    return { status: 'Failed', message: 'wrong tx hash' };
  }

  const depositAddress = txData.logs[0].topics[3];
  const depositedAmount = Number(Web3.utils.fromWei(txData.logs[0].data));

  await Tx.create({ tx });
  await writeBook({ userName }, { depositedFundsEth: user.depositedFundsEth + depositedAmount });
  // TODO: notify user in tg that his pack updated and deposit success
  const message = `Successfully Deposited ${depositedAmount} TON`;
  botSendMessage(user, message);
  return { status: 'Success', message };
};

// Driver Code
(async () => {
  //
})();

module.exports = { readBook, writeBook, readBooks, depositFundsEth };
