import { providers } from 'ethers';
import config from '@/config';

const provider = new providers.JsonRpcProvider(
  config.gethServer,
  parseInt(config.chainId, 10),
);

export default provider;
