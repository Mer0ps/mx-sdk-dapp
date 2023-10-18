import detectEthereumProvider from '@metamask/detect-provider';

export const getIsMetamaskWalletAvailable = async () => {
  try {
    const provider = (await detectEthereumProvider({
      mustBeMetaMask: false,
      silent: true
    })) as any | undefined;
    const isFlask = (
      await provider?.request({ method: 'web3_clientVersion' })
    )?.includes('flask');

    if (provider && isFlask) {
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Error', e);
    return false;
  }
};
