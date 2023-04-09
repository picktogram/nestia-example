// export * as business from './business-error';

import { Merge } from '../../types';

export interface ERROR {
  type: string;
  result: false;
  code: number;
  data: string;
}

export const isBusinessErrorGuard = (obj: any): obj is Merge<ERROR, { type: 'business' }> => {
  if (isErrorGuard(obj)) {
    if (obj.type === 'business') {
      return true;
    }
  }
  return false;
};

export const isErrorGuard = (obj: any): obj is ERROR => {
  if (obj.result === false) {
    return true;
  }
  return false;
};
