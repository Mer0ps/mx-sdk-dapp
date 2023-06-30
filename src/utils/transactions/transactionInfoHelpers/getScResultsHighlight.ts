import { getWindowLocation } from 'utils/window';

export const getScResultsHighlight = (resultHash: string) => {
  const hash = getWindowLocation('hash');
  const formattedHash = hash
    .substring(0, hash.indexOf('/') > 0 ? hash.indexOf('/') : hash.length)
    .replace('#', '');
  const highlight = formattedHash === resultHash;
  return highlight;
};
