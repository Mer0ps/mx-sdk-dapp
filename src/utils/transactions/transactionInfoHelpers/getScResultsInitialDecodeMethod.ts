import { DecodeMethodEnum } from 'types';
import { getWindowLocation } from 'utils/window';

export const getInitialScResultsDecodeMethod = () => {
  const hash = getWindowLocation('hash');

  const initialDecodeMethod =
    hash.indexOf('/') > 0
      ? hash.substring(hash.indexOf('/') + 1)
      : DecodeMethodEnum.raw;

  const isInitialDecodedMethod =
    initialDecodeMethod &&
    Object.values<string>(DecodeMethodEnum).includes(initialDecodeMethod);

  return isInitialDecodedMethod ? initialDecodeMethod : DecodeMethodEnum.raw;
};
