export default {
  env: 'prod',
  storeVersion: '1.0.0',
  debug: false,
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
  space: 'cvx.eth',

  label: 'Ethereum Mainnet',
  curveUrl: 'https://api.curve.fi',
  browser: 'https://etherscan.io/',
  gethServer: 'https://mainnet.infura.io/v3/800d17c94bfb46c8b0296a5770703215',
  chainId: '0x1',
  prodGethServer: 'https://mainnet.infura.io/v3/800d17c94bfb46c8b0296a5770703215',
  prodChainId: '0x1',
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

  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',

  VeCRV: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2',
  VlCVX: '0x72a19342e8F1838460eBFCCEf09F6585e32db86E',

  DelegateRegistry: '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446',

  GaugeController: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',

  MultiMerkleStash: '0xC4bAd32FFfFfa276bb81dfDa0a7720177325707C',
  StashController: '0x58978782AcD9f085ea0779fe94aB2460C6238058',
  VotiumVeCRV: '0x36b79B97B865CC4C643b705DDaFDe16D8776B545',
  MultiMerkleStashForCVX: '0x55Cdf4cFd12812a7D7634db3cbAc7524719BA1d4',
  VotiumBribeCVX: '0x0Ffe547e2813B35ead37936e50b695842136292A',

  DelegateAddress: '0x56f610E0C5f2f64a6b599CC5481D35E70D2e63e7',
  DelegateVotiumAddress: '0xde1E6A7ED0ad3F61D531a8a78E83CcDdbd6E0c49',
};
