import { BigNumber, ethers } from 'ethers';
import config from '@/config';

import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import ledgerModule from '@web3-onboard/ledger';
import store from './store';

// const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/<INFURA_KEY>'

const injected = injectedModule();
const ledger = ledgerModule();
const onboard = Onboard({
  wallets: [injected, ledger],
  chains: [
    {
      id: config.chainId,
      token: 'ETH',
      label: config.label,
      rpcUrl: config.gethServer,
    },
  ],
  connect: {
    autoConnectLastWallet: true,
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
});

// const state = onboard.state.select();
// state.subscribe((update) => console.log('state update: ', update));

const walletsState = onboard.state.select('wallets');

store.dispatch('handleAccountsChanged', []);
walletsState.subscribe((update) => {
  if (update[0]) {
    store.dispatch('handleAccountsChanged', update[0].accounts);
  } else {
    store.dispatch('handleAccountsChanged', []);
    // window.location.reload();
  }
});

// eslint-disable-next-line no-underscore-dangle
window.__wallet__ = {
  address: '',
  connect() {
    onboard.connectWallet();
  },
  disconnect() {
    const [primaryWallet] = onboard.state.get().wallets;
    onboard.disconnectWallet({ label: primaryWallet.label });
  },

  async sendTransaction(
    {
      to,
      data,
      gas,
      gasPrice,
    },
  ) {
    const [primaryWallet] = onboard.state.get().wallets;
    if (primaryWallet) {
      // create an ethers provider with the last connected wallet provider
      // if using ethers v6 this is:
      // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
      const provider = new ethers.providers.Web3Provider(primaryWallet.provider, 'any');

      const signer = provider.getSigner();
      const remoteGasPrice = await provider.getGasPrice();

      const transactionParameters = {
        // nonce: txCount, // ignored by MetaMask
        gasPrice: BigNumber.from(gasPrice || remoteGasPrice).toHexString(), // customizable by user during MetaMask confirmation.
        gas: BigNumber.from(gas || 240000).toHexString(), // customizable by user during MetaMask confirmation.
        to, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data, // Optional, but used for defining smart contract creation and interaction.
        chainId: config.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      const txn = await signer.sendTransaction(transactionParameters);
      return txn.hash;
    }
  },
};

//

// const wallets = await onboard.connectWallet()

// console.log(wallets)

// if (wallets[0]) {
//   // create an ethers provider with the last connected wallet provider
//   // if using ethers v6 this is:
//   // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
//   const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any');

//   const signer = ethersProvider.getSigner();

//   // send a transaction with the ethers provider
//   const txn = await signer.sendTransaction({
//     to: '0x',
//     value: 100000000000000,
//   });

//   const receipt = await txn.wait();
//   console.log(receipt);
// }

(async () => {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (!BigNumber.from(chainId).eq(0x5) && !BigNumber.from(chainId).eq(0x1)) {
      try {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: config.chainId,
          }],
        });
      } catch (switchError) {
        this.showError(this.$t('selectNet'), {
          noCloseButton: true,
          autoHideDelay: 5000,
        });
      }
    }

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // window.ethereum
    //   .request({ method: 'eth_accounts' })
    //   .then((accounts) => {
    //     store.dispatch('handleAccountsChanged', accounts);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    // window.ethereum.on('accountsChanged', (accounts) => {
    //   store.dispatch('handleAccountsChanged', accounts);
    // });
  }
})();
