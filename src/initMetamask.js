import { BigNumber } from 'ethers';
import config from '@/config';
import store from './store';

(async () => {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    if (!BigNumber.from(chainId).eq(0x38) && !BigNumber.from(chainId).eq(0x61)) {

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

    // For now, 'eth_accounts' will continue to always return an array
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        store.dispatch('handleAccountsChanged', accounts);
      })
      .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
        console.error(err);
      });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    window.ethereum.on('accountsChanged', (accounts) => {
      // if (accounts?.length) {
      store.dispatch('handleAccountsChanged', accounts);
      // __user__.isMetamask = true;
      // __user__.isWalletConnect = false;
      // __user__.handleAccountsChanged(accounts);
      // __user__.syncStorage();
      // } else {
      //   store.dispatch('resetUser', accounts);
      //   // store.reset();
      // }
    });
  }
})();
