import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Lighting from 'assets/icons/lightning.svg';
import globalStyles from 'assets/sass/main.scss';
import { useWalletConnectLogin } from 'hooks/login/useWalletConnectLogin';
import { useWalletConnectV2Login } from 'hooks/login/useWalletConnectV2Login';
import { Loader } from 'UI/Loader';
import { ModalContainer } from 'UI/ModalContainer';
import { isMobileEnvironment } from 'utils';
import { WithClassname } from '../../types';
import { Pairinglist } from './PairingList';
import styles from './wallet-connect-login-container.scss';

export interface WalletConnectLoginModalPropsType extends WithClassname {
  lead?: string;
  title?: string;
  logoutRoute?: string;
  callbackRoute?: string;
  loginButtonText: string;
  wrapContentInsideModal?: boolean;
  isWalletConnectV2?: boolean;
  token?: string;
  onLoginRedirect?: (callbackRoute: string) => void;
  onClose?: () => void;
}

export const WalletConnectLoginContainer = ({
  callbackRoute,
  loginButtonText,
  title = 'Maiar Login',
  logoutRoute = '/unlock',
  className = 'dapp-wallet-connect-login-modal',
  lead = 'Scan the QR code using Maiar',
  wrapContentInsideModal = true,
  isWalletConnectV2 = false,
  token,
  onClose,
  onLoginRedirect
}: WalletConnectLoginModalPropsType) => {
  const [
    initLoginWithWalletConnect,
    { error },
    { uriDeepLink, walletConnectUri, cancelLogin }
  ] = useWalletConnectLogin({
    logoutRoute,
    callbackRoute,
    token,
    onLoginRedirect
  });
  const [
    initLoginWithWalletConnectV2,
    { error: walletConnectErrorV2 },
    {
      connectExisting,
      removeExistingPairing,
      cancelLogin: cancelLoginV2,
      uriDeepLink: walletConnectDeepLinkV2,
      walletConnectUri: walletConnectUriV2,
      wcPairings
    }
  ] = useWalletConnectV2Login({
    logoutRoute,
    callbackRoute,
    token,
    onLoginRedirect
  });
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const isMobileDevice = isMobileEnvironment();
  const activePairings = isWalletConnectV2
    ? wcPairings?.filter(
        (pairing) => Boolean(pairing.active) && pairing.peerMetadata
      ) ?? []
    : [];

  const generatedClasses = {
    loginText: globalStyles.textLeft,
    container: `${globalStyles.mAuto} ${styles.loginContainer}`,
    card: `${globalStyles.card} ${globalStyles.my3} ${globalStyles.textCenter}`,
    cardBody: `${globalStyles.cardBody} ${globalStyles.p4} ${globalStyles.mxLg4}`,
    qrCodeSvgContainer: `${globalStyles.qrCodeSvgContainer} ${globalStyles.mxAuto} ${globalStyles.mb3}`,
    title: globalStyles.mb3,
    leadText: `${globalStyles.lead} ${globalStyles.mb0}`,
    mobileLoginButton: `${globalStyles.btn} ${globalStyles.btnPrimary} ${globalStyles.dInlineFlex} ${globalStyles.alignItemsCenter} ${globalStyles.px4} ${globalStyles.my4}`,
    mobileLoginButtonIcon: globalStyles.mr2,
    errorMessage: `${globalStyles.textDanger} ${globalStyles.dFlex} ${globalStyles.justifyContentCenter} ${globalStyles.alignItemsCenter}`
  };

  const generateQRCode = async () => {
    const canGenerateQRCodeForWC2 = isWalletConnectV2 && walletConnectUriV2;
    const canGenerateQRCodeForWC1 = !isWalletConnectV2 && walletConnectUri;
    const canGenerateQRCode =
      canGenerateQRCodeForWC2 || canGenerateQRCodeForWC1;

    if (!canGenerateQRCode) {
      return;
    }

    const uri = isWalletConnectV2 ? walletConnectUriV2 : walletConnectUri;
    if (uri) {
      const svg = await QRCode.toString(uri, {
        type: 'svg'
      });
      if (svg) {
        setQrCodeSvg(svg);
      }
    }
  };

  const onCloseModal = () => {
    if (isWalletConnectV2) {
      cancelLoginV2();
    } else {
      cancelLogin();
    }
    onClose?.();
  };

  useEffect(() => {
    generateQRCode();
  }, [walletConnectUri, walletConnectUriV2]);

  useEffect(() => {
    if (isWalletConnectV2) {
      initLoginWithWalletConnectV2();
    } else {
      initLoginWithWalletConnect();
    }
  }, []);

  const content = (
    <div className={generatedClasses.container}>
      <div className={generatedClasses.card}>
        <div className={generatedClasses.cardBody}>
          {qrCodeSvg ? (
            <div
              className={generatedClasses.qrCodeSvgContainer}
              dangerouslySetInnerHTML={{
                __html: qrCodeSvg
              }}
            />
          ) : (
            <Loader />
          )}

          <h4 className={generatedClasses.title}>{title}</h4>
          {isMobileDevice ? (
            <>
              <p className={generatedClasses.leadText}>{loginButtonText}</p>
              <a
                id='accessWalletBtn'
                data-testid='accessWalletBtn'
                className={generatedClasses.mobileLoginButton}
                href={uriDeepLink || walletConnectDeepLinkV2}
                rel='noopener noreferrer nofollow'
                target='_blank'
              >
                <Lighting
                  className={generatedClasses.mobileLoginButtonIcon}
                  style={{
                    width: '0.9rem',
                    height: '0.9rem'
                  }}
                />
                {title}
              </a>
            </>
          ) : (
            <p className={generatedClasses.leadText}>{lead}</p>
          )}
          {activePairings.length > 0 && (
            <Pairinglist
              activePairings={activePairings}
              connectExisting={connectExisting}
              removeExistingPairing={removeExistingPairing}
              className={className}
            />
          )}
          <div>
            {error && <p className={generatedClasses.errorMessage}>{error}</p>}
            {walletConnectErrorV2 && (
              <p className={generatedClasses.errorMessage}>
                {walletConnectErrorV2}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return wrapContentInsideModal ? (
    <ModalContainer
      onClose={onCloseModal}
      modalConfig={{
        headerText: 'Login with Maiar',
        showHeader: true,
        modalDialogClassName: className
      }}
      className={className}
    >
      {content}
    </ModalContainer>
  ) : (
    content
  );
};
