// explanation / plan in readme file

const { readBook, writeBook } = require('./db');
const { getBalance, mnemonicGenerate } = require('./mlm-backend');

const TelegramBot = require('node-telegram-bot-api');
const token = '5824890097:AAFlY-9XwGl0-sM0mooKNaWISWHFsIR_T2o'; // TODO: add in env
const bot = new TelegramBot(token, { polling: true });

// Admin Wallet
const [adminAddress, adminMnemonic] = [
  'EQAUBDH8lrpWuO88cxudGbwO2KCcTJrwBcAfwVcyXlfEOo-x',
  'camp hard goose quiz crew van inner tent leopard make student around hero nation garbage task swim series enlist rude skull mass grace wheel',
]; // would come from env file

const level0 = 0.0005; // < 5 TON NONE
const level1 = 0.0006; // 5 TON   BABY
const level2 = 0.0007; // 25 TON  START
const level3 = 0.0008; // 50 TON  WALK
const level4 = 0.0009; // 200 TON RUN
const level5 = 0.001; // 500 TON FLY
const percent = 1 / 100;

const onMessage = async (msg) => {
  console.log({ message: msg.text });

  const chatId = msg.chat.id;
  const userName = msg.chat.username;
  let user = await readBook({ userName });

  if (newUser(user)) {
    console.log('Congrats new user!');
    const [publicKey, mnemonic] = await mnemonicGenerate();
    user = { chatId, userName, publicKey, mnemonic };
    await writeBook({ userName }, user); // TODO: can we skip await here? any problem?
  }

  // show deposit instructions
  if (msg.text === '/start') {
    // send deposited money to ADMIN WALLET
    // add % to people balances 15 levels up

    const [, balance] = await getBalance(user.mnemonic);

    console.log({ balance });

    // show user info
    bot.sendMessage(
      chatId,
      'Hi ' +
        user.userName +
        '\n' +
        user.balance +
        ' TON in Your wallet:\n' +
        user.publicKey +
        (user.parent !== '0' && '\nYou are invited by: ' + user.parent) +
        (user.child !== '0' && '\nYou invited: ' + user.child) +
        '\nYour invite link: https://t.me/sheikhu_bot?start=' +
        user.userName,
    );
  }

  // users who came from
  else if (msg.text.includes('/start')) {
    const referrer = msg.text.split(' ')[1];

    if (referrer === undefined) {
      bot.sendMessage(chatId, 'You are invited none.');
    } else {
      // create referrals chain
      await writeBook({ userName }, { parent: referrer });
      await writeBook({ userName: referrer }, { child: [userName] });

      // add balance to all people above the chain
      bot.sendMessage(chatId, 'You are invited by ' + referrer);
    }
  }
  // users who want to upgrade
  else if (msg.text === '/upgrade') {
    bot.sendMessage(chatId, 'Under development');
  } else {
    bot.sendMessage(chatId, 'hi, type /start');
  }
};

// onMessage();
bot.on('message', onMessage);

const newUser = (user) => {
  return user.publicKey === '0';
};

// let botBalance = '';
// setInterval(async () => {
//   const [, balance] = await getBalance(m);

//   if (botBalance !== balance) {
//     botBalance !== '' && bot.sendMessage(chatId, `Payment received`);

//     console.log({ balance, botBalance });
//     botBalance = balance;
//   }
// }, 5000);
