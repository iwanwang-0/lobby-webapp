import { providers } from 'ethers';
import config from '@/config';

const provider = new providers.JsonRpcProvider(
  config.gethServer,
  parseInt(config.chainId, 16),
);

export const prodProvider = new providers.JsonRpcProvider(
  config.prodGethServer,
  1,
);


export default provider;
