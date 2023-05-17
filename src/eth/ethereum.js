import { ethers } from 'ethers';
import config from '@/config';

import ERC20 from '@/eth/abi/ERC20.json';
import MultiMerkleStashAbi from '@/eth/abi/MultiMerkleStash.json';
import VotiumVeCRVAbi from '@/eth/abi/VotiumVeCRV.json';

import MultiMerkleStashForCVXAbi from '@/eth/abi/MultiMerkleStashForCVX.json';
import VotiumBribeCVXAbi from '@/eth/abi/VotiumBribeCVX.json';
import GaugeControllerAbi from '@/eth/abi/GaugeController.json';
import DelegateRegistryAbi from '@/eth/abi/DelegateRegistry';



// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
// https://kovan.infura.io/v3/492234a5fc4a458191731b8d68be70ec
// const provider = new ethers.providers.Web3Provider(window.ethereum);
const provider = new ethers.providers.JsonRpcProvider(config.gethServer);

const prodProvider = new ethers.providers.JsonRpcProvider(config.prodGethServer);

const MultiMerkleStashContract = new ethers.Contract(
  config.MultiMerkleStash, MultiMerkleStashAbi.abi, provider,
);

const VotiumVeCRVContract = new ethers.Contract(
  config.VotiumVeCRV, VotiumVeCRVAbi.abi, provider,
);

const MultiMerkleStashForCVXContract = new ethers.Contract(
  config.MultiMerkleStashForCVX, MultiMerkleStashForCVXAbi.abi, provider,
);

const VotiumBribeCVXContract = new ethers.Contract(
  config.VotiumBribeCVX, VotiumBribeCVXAbi.abi, provider,
);

const GaugeControllerContract = new ethers.Contract(
  config.GaugeController, GaugeControllerAbi.abi, provider,
);

const USDTContract = new ethers.Contract(config.USDT, ERC20.abi, provider);
const USDCContract = new ethers.Contract(config.USDC, ERC20.abi, provider);

const DelegateRegistryContract = new ethers.Contract(
  config.DelegateRegistry, DelegateRegistryAbi, provider,
);


const MultiMerkleStashInterface = new ethers.utils.Interface(MultiMerkleStashAbi.abi);
const VotiumVeCRVInterface = new ethers.utils.Interface(VotiumVeCRVAbi.abi);

const MultiMerkleStashForCVXInterface = new ethers.utils.Interface(MultiMerkleStashForCVXAbi.abi);
const VotiumBribeCVXInterface = new ethers.utils.Interface(VotiumBribeCVXAbi.abi);

const GaugeControllerInterface = new ethers.utils.Interface(GaugeControllerAbi.abi);

const USDTInterface = new ethers.utils.Interface(ERC20.abi);
const USDCInterface = new ethers.utils.Interface(ERC20.abi);

const DelegateRegistryInterface = new ethers.utils.Interface(DelegateRegistryAbi);

const getERC20Contract = (address) => {
  const ERC20Contract = new ethers.Contract(address, ERC20.abi, provider);
  return ERC20Contract;
};

const getProdERC20Contract = (address) => {
  const ERC20Contract = new ethers.Contract(address, ERC20.abi, prodProvider);
  return ERC20Contract;
};

const getERC20Interface = () => {
  const ERC20Interface = new ethers.utils.Interface(ERC20.abi);
  return ERC20Interface;
};

export {
  provider,
  MultiMerkleStashContract,
  VotiumVeCRVContract,
  MultiMerkleStashForCVXContract,
  VotiumBribeCVXContract,
  GaugeControllerContract,

  USDTContract,
  USDCContract,

  MultiMerkleStashInterface,
  VotiumVeCRVInterface,
  MultiMerkleStashForCVXInterface,
  VotiumBribeCVXInterface,
  GaugeControllerInterface,

  USDTInterface,
  USDCInterface,

  DelegateRegistryContract,
  DelegateRegistryInterface,

  getERC20Contract,
  getERC20Interface,

  getProdERC20Contract,
};
