module.exports = {
    apiKey: '',
    secretKey: '',
    passphrase: '',
    apiUrl: 'https://www.okx.com/api/v5/asset/withdrawal',
    arbETH: {
        minWithdrawal: 0.001,
        maxWithdrawal: 0.0015,
        fee: 0.0001,
        ccy: 'ETH',
        chain: 'ETH-Arbitrum one'
    },
    arbUSDC: {
        minWithdrawal: 800,
        maxWithdrawal: 1200,
        fee: 0.1,
        ccy: 'USDC',
        chain: 'USDC-Arbitrum one'
    },
    mainETH: {},
    coreCORE: {},
  };
