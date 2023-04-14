const { Axios } = require("axios");
const CryptoJS = require("crypto-js");
const config = require('./config');

const generateSign = (timestamp, method, body) => {
  const withdrawalEndpoint = '/api/v5/asset/withdrawal'
  const secretKey = config.secretKey;

  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + method + withdrawalEndpoint + body, secretKey))
}

const axios = new Axios({
  headers: {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': config.apiKey,
    'OK-ACCESS-PASSPHRASE': config.passphrase
  }
})

function getRandomNumber(min, max, fixed) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, fixed);
  return (Math.floor(rand * power) / power).toFixed(fixed);
}

async function sendTokens({ destinationWallet, minWithdrawal, maxWithdrawal, fee, ccy, chain }) {
  const ON_CHAIN = 4;

  const withdrawalParams = {
    amt: getRandomNumber(minWithdrawal, maxWithdrawal, 6),
    fee: fee,
    dest: ON_CHAIN,
    ccy: ccy,
    chain: chain,
    toAddr: destinationWallet
  };

  const { apiUrl } = config;
  const TIMESTAMP = new Date().toISOString().split('.')[0] + "Z"
  const body = JSON.stringify(withdrawalParams);

  const response = await axios.post(apiUrl, body, {
    headers: {
      'OK-ACCESS-TIMESTAMP': TIMESTAMP,
      "OK-ACCESS-SIGN": generateSign(TIMESTAMP, 'POST', body),
    }
  })

  const parsedResponse = JSON.parse(response.data);
  const responseError = parsedResponse.msg;
  if (responseError && responseError.length > 0) {
    throw new Error(`Error : ${responseError}`);
  }

  console.log('\x1b[32m%s\x1b[0m', `Withdrawal successful!`);
  console.log(`Withdrawn ${withdrawalParams.amt} ${withdrawalParams.ccy} to ${withdrawalParams.toAddr} on chain ${withdrawalParams.chain}`);
  const wdId = parsedResponse.data[0].wdId;
  console.log(`OKX transaction ID: ${wdId}`);
  // const delay = getRandomNumber(5, 20, 6) * 1000;
  // console.log('\x1b[33m%s\x1b[0m', `Delaying next withdrawal for ${delay / 1000} seconds...`);
  // await new Promise(resolve => setTimeout(resolve, delay));
  console.log("")
}

async function withdrawToAllAddresses() {
  try {
    const wallets = require('./wallets.json');

    for (const destinationWallet of wallets) {
      await sendTokens({ destinationWallet, ...config.arbETH });
      await sendTokens({ destinationWallet, ...config.arbUSDC });
      // await sendTokens({ destinationWallet: wallet.address, ...config.mainETH });
      // await sendTokens({ destinationWallet: wallet.address, ...config.coreCORE });
    }
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', `Withdrawal failed:`, error.message);
  }
}

withdrawToAllAddresses();
