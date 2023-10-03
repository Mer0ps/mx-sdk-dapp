import { MetamaskProvider } from "@merops/mx-sdk-js-metamask-provider/out";

export async function getMetamaskProvider(address: string) {
  try {
    const provider = MetamaskProvider.getInstance().setAddress(address);

    const success = await provider.init();

    if (success) {
      return provider;
    } else {
      console.error(
        'Could not initialise metamask crypto wallet, make sure that metamask crypto wallet is installed.'
      );
    }
  } catch (err) {
    console.error('Unable to login to MetamaskProvider', err);
  }
  return null;
}
