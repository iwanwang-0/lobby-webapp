import { providers } from 'ethers';
import config from '@/config';

const provider = new providers.JsonRpcProvider(
  config.gethServer,
  parseInt(config.chainId, 10),
);

export const prodProvider = new providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/800d17c94bfb46c8b0296a5770703215',
  1,
);

export default provider;
