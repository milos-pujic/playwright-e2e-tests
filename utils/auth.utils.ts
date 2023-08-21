import { intercept, InterceptorsNames, wait } from './common.utils';

export const interceptAuthDemo = () => {
  intercept('POST', '/v1/auth/demo', InterceptorsNames.PostAuthDemo);
};

export const waitFoAuthDemo = () => wait(InterceptorsNames.PostAuthDemo);
