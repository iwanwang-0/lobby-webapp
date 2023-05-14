export default {
  storeVersion: '1.0.0',
  debug: true,
  serverUrl: '',
  // webUrl: 'http://47.75.74.35:8000',

  // defaultPricePrecision: 8,
  // defaultAmountPrecision: 4,
  // defaultExpireTime: 3600 * 24 * 365 * 10, // 秒

  // defaultGasPrice: 8,
  // defaultGasLimit: '0x186a0',
  // loopInterval: 30000,
  // localStorageVersion: '201901011200',
  // approveAllowance: '0xf000000000000000000000000000000000000000000000000000000000000000',
  // minAllowance: 10 ** 30,
  // appId: '1234567',

  // gethServer: 'https://mainnet.infura.io/v3/6ef437a0bfc743d0bbfe73f72c90afd4', 主网
  // chainId: 1,
  // gethServer: 'https://mainnet.infura.io/v3/6ef437a0bfc743d0bbfe73f72c90afd4', 主网
  // chainId: 1,
  githubToken: process.env.VUE_APP_GITHUB_TOKEN,
  space: 'iwan.eth',

  curveUrl: 'https://api.curve.fi',
  browser: 'https://goerli.etherscan.io/',
  gethServer: 'https://goerli.infura.io/v3/800d17c94bfb46c8b0296a5770703215',
  chainId: '0x5',

  addressZero: '0x0000000000000000000000000000000000000000',
  hashZero: '0x0000000000000000000000000000000000000000000000000000000000000000',
  // 本地测试节点
  // defaultServer: 'https://api-sandbox.i.ddex.io',
  // webSocketServer: 'https://ws-sandbox.i.ddex.io',
  // gethServer: 'http://0.0.0.0:8545',
  // hydroExchangeAddress: '0x5c0286bef1434b07202a5ae3de38e66130d5280d',
  // hydroProxyAddress: '0x04f67e8b7c39a25e100847cb167460d715215feb',
  // chainId: 1,

  // fundraisingToken: 'CER',
  // appDownload: '这是下载二维码',

  USDT: '0x811B9dB74373878f7f05C66C24Ff28c0bCD61c8C',
  USDC: '0xdBEB7e5cacfA3B7754651ccC67F4e98bF23fb9BC',
  GaugeController: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',

  MultiMerkleStash: '0xaa5Bde6D68A9390efB5698C017BF4C1736386e2B',
  StashController: '0x377571C212e1f0199A6407330d3A5e0c0665d5C2',
  VotiumVeCRV: '0x46414279428ff3024ee0C8D002C15bdC0C108FEd',
  MultiMerkleStashForCVX: '0xeCF36ac7C4415c7399544988992b7F784a00Cd34',
  VotiumBribeCVX: '0x34070F409BDcbc9c305cb4D35D0385330a8fE740',
};
