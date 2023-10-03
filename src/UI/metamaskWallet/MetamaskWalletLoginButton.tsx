import React, { ReactNode } from 'react';
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

const isMetamaskWalletAvailable = getIsMetamaskWalletAvailable();

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
  const [onInitiateLogin] = useMetamaskLogin({
    callbackRoute,
    token,
    onLoginRedirect,
    nativeAuth
  });

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
