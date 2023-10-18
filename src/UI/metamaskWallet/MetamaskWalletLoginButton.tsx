import React, { ReactNode, useEffect, useState } from 'react';
import { DataTestIdsEnum } from 'constants/index';
import { useMetamaskLogin } from 'hooks';
import { getIsNativeAuthSingingForbidden } from 'services/nativeAuth/helpers';
import { LoginButton } from 'UI/LoginButton/LoginButton';
import { OnProviderLoginType } from '../../types';
import { getIsMetamaskWalletAvailable } from './helpers/getIsMetamaskWalletAvailable';
import { WithClassnameType } from 'UI/types';

export interface MetamaskWalletLoginButtonPropsType
  extends WithClassnameType,
    OnProviderLoginType {
  children?: ReactNode;
  buttonClassName?: string;
  loginButtonText?: string;
  disabled?: boolean;
}

export const MetamaskWalletLoginButton: (
  props: MetamaskWalletLoginButtonPropsType
) => JSX.Element = ({
  token,
  className = 'dapp-metamask-login',
  children,
  callbackRoute,
  buttonClassName,
  nativeAuth,
  loginButtonText = 'Metamask Crypto Wallet',
  onLoginRedirect,
  disabled,
  'data-testid': dataTestId = DataTestIdsEnum.metamaskLoginButton
}) => {
  const disabledConnectButton = getIsNativeAuthSingingForbidden(token);
  const [isMetamaskWalletAvailable, setIsMetamaskWalletAvailable] = useState(false);
  const [onInitiateLogin] = useMetamaskLogin({
    callbackRoute,
    token,
    onLoginRedirect,
    nativeAuth
  });

  useEffect(() => {
    async function checkMetamaskAvailability() {
      const isMetamaskWalletAvailable = await getIsMetamaskWalletAvailable();
      setIsMetamaskWalletAvailable(isMetamaskWalletAvailable);
    }

    checkMetamaskAvailability();
  }, []);

  const handleLogin = () => {
    onInitiateLogin();
  };

  return !isMetamaskWalletAvailable ? (
    <></>
  ) : (
    <LoginButton
      onLogin={handleLogin}
      className={className}
      btnClassName={buttonClassName}
      text={loginButtonText}
      disabled={disabled || disabledConnectButton}
      data-testid={dataTestId}
    >
      {children}
    </LoginButton>
  );
};
