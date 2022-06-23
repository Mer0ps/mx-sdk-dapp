import React, { useEffect } from 'react';
import { useSignTransactionsWithDevice } from 'hooks';
import { SignModalPropsType } from 'types';
import { useDappModal } from 'UI/DappModal';
import { ModalContainer } from 'UI/ModalContainer/ModalContainer';
import { getGeneratedClasses } from 'UI/utils';
import { SignStep } from './SignStep';
import styles from './sing-with-device-modal.scss';
import globalStyles from 'assets/sass/main.scss';

export const SignWithDeviceModal = ({
  handleClose,
  error,
  className = 'device-modal',
  verifyReceiverScam = true,
  title = 'Confirm transaction'
}: SignModalPropsType) => {
  const {
    onSignTransaction,
    onNext,
    onPrev,
    allTransactions,
    waitingForDevice,
    onAbort,
    isLastTransaction,
    currentStep,
    callbackRoute,
    currentTransaction
  } = useSignTransactionsWithDevice({
    onCancel: handleClose,
    verifyReceiverScam
  });
  const classes = getGeneratedClasses(className, true, {
    wrapper: `${styles.modalContainer} ${styles.walletConnect}`,
    container: `${globalStyles.card} ${globalStyles.container}`,
    cardBody: globalStyles.cardBody
  });
  const { handleShowModal, handleHideModal } = useDappModal();

  useEffect(() => {
    if (currentTransaction != null) {
      handleShowModal();
    } else {
      handleHideModal();
    }
  }, [currentTransaction]);

  return (
    <ModalContainer
      onClose={handleClose}
      modalConfig={{
        modalDialogClassName: classes.wrapper
      }}
      visible={currentTransaction != null}
    >
      <div className={classes.container}>
        <div className={classes.cardBody}>
          <SignStep
            {...{
              onSignTransaction,
              onNext,
              onPrev,
              allTransactions,
              waitingForDevice,
              isLastTransaction,
              currentStep,
              callbackRoute,
              currentTransaction,
              handleClose: onAbort,
              className,
              error,
              title
            }}
          />
        </div>
      </div>
    </ModalContainer>
  );
};
