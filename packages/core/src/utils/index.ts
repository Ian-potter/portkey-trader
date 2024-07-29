import { PBTimestamp } from '@portkey/trader-types';
import { DEFAULT_EXPIRATION } from '../constants';

export const getDeadline = (): number | PBTimestamp => {
  const seconds = Math.ceil(new Date().getTime() / 1000) + Number(DEFAULT_EXPIRATION) * 60;
  return { seconds: seconds, nanos: 0 };
};
