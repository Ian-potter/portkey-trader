import { handleContractError } from '@portkey/contracts';
import { textProcessor } from './textProcessor';

export const handleError = (error: any) => {
  return error?.error || error;
};

export const handleErrorMessage = (error: any, errorText?: string) => {
  if (error.status === 500) {
    return errorText || 'Failed to fetch data';
  }
  error = handleError(error);
  error = handleContractError(error);
  if (typeof error === 'string') errorText = error;
  if (typeof error.message === 'string') errorText = error.message;
  return textProcessor.format(errorText || '') || '';
};
