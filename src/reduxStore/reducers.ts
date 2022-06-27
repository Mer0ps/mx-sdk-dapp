import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import sessionStorage from 'redux-persist/lib/storage/session';
import { ReducersEnum } from 'types/reducers';
import account from './slices/accountInfoSlice';
import dappModal from './slices/dappModalsSlice';
import loginInfo from './slices/loginInfoSlice';
import modals from './slices/modalsSlice';
import networkConfig from './slices/networkConfigSlice';
import toasts from './slices/toastsSlice';
import transactions from './slices/transactionsSlice';
import transactionsInfo from './slices/transactionsInfoSlice';

const transactionsInfoPersistConfig = {
  key: 'dapp-core-transactionsInfo',
  version: 1,
  storage: sessionStorage
};
const transactionsReducerPersistConfig = {
  key: 'dapp-core-transactions',
  version: 1,
  storage: sessionStorage,
  blacklist: [ReducersEnum.transactionsToSign]
};
const toastsReducerPersistConfig = {
  key: 'dapp-core-toasts',
  version: 1,
  storage: sessionStorage
};

const reducers = {
  [ReducersEnum.account]: account,
  [ReducersEnum.networkConfig]: networkConfig,
  [ReducersEnum.loginInfo]: loginInfo,
  [ReducersEnum.modals]: modals,
  [ReducersEnum.dappModal]: dappModal,
  [ReducersEnum.toasts]: persistReducer(toastsReducerPersistConfig, toasts),
  [ReducersEnum.transactions]: persistReducer(
    transactionsReducerPersistConfig,
    transactions
  ),
  [ReducersEnum.transactionsInfo]: persistReducer(
    transactionsInfoPersistConfig,
    transactionsInfo
  )
};

const rootReducer = combineReducers(reducers);

export default rootReducer;