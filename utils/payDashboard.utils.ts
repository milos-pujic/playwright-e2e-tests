import { Account } from '@melio/platform-api';
import { PartnerName } from '@melio/platform-api';

import { FeatureFlagKeys } from '@/consts';
import { AccessTokenPayloadType } from '@/types/payload.types';
import { getAccessTokenData } from '@/utils/getAccessTokenData.utils';
import { PayDashboardDriver } from '../drivers/pay-dashboard/pay-dashboard.driver';
import { createAuthDemoLogin } from '../factories/auth';
import { getByTestId, intercept, InterceptorsNames, wait } from './common.utils';
import { getClientBaseUrl } from './env.utils';
import { setFlag } from './featureFlags.utils';

export type OnboardingFinishCallbackType = (account: Account, accessToken: AccessTokenPayloadType | null) => void;

export const interceptPayDashboard = () => {
  cy.intercept('/v1/accounts/me*', (req) => {
    delete req.headers['if-none-match'];
  }).as('accountsMeNoCache');
  intercept('GET', '/v1/accounts/me', InterceptorsNames.GetAccountMe);
  intercept('GET', '/v1/accounts/me*', InterceptorsNames.GetAccountMeAll);
};

export const waitForPayDashboard = () => wait(InterceptorsNames.GetAccountMe);

export const assertOldPayDashboardShown = (cb?: OnboardingFinishCallbackType) => {
  waitForPayDashboard().then(({ response: meResponse }) => {
    cb?.(meResponse?.body.data as Account, getAccessTokenData());
  });
  getByTestId('pay-dashboard-bill-list').should('be.visible');
};

export const assertNewPayDashboardShown = (cb?: OnboardingFinishCallbackType) => {
  const payDashboardDriver = new PayDashboardDriver();

  waitForPayDashboard().then(({ response: meResponse }) => {
    cb?.(meResponse?.body.data as Account, getAccessTokenData());
  });
  payDashboardDriver.assertPayDashboardVisible();
};

export const assertJustPayShown = (cb?: OnboardingFinishCallbackType) => {
  waitForPayDashboard().then(({ response: meResponse }) => {
    cb?.(meResponse?.body.data as Account, getAccessTokenData());
  });
  getByTestId('add-instant-bill-activity-add-instant-bill-screen').should('be.visible');
};

export const assertNewDashboardShown = (cb?: OnboardingFinishCallbackType) => {
  return waitForPayDashboard().then(({ response: meResponse }) => {
    cb?.(meResponse?.body.data as Account, getAccessTokenData());
    getByTestId('pay-dashboard-activity-pay-dashboard-table').should('be.visible');
  });
};

export const getNPEDashboardUrl = (partnerName: PartnerName, tab?: string) =>
  `${getClientBaseUrl()}/${partnerName}/pay-dashboard${tab ? `/${tab}` : ''}`;
export const getOldPayDashboardUrl = (partnerName: PartnerName) => `${getClientBaseUrl()}/${partnerName}/pay`;

export const getPayDashboard = ({ accountWithTaxId }: { accountWithTaxId?: boolean } = {}) => {
  setFlag(FeatureFlagKeys.justPay, false);
  interceptPayDashboard();
  createAuthDemoLogin({ withTaxId: accountWithTaxId });

  cy.then(() => {
    cy.visit(getOldPayDashboardUrl(PartnerName.Melio));
    assertOldPayDashboardShown();
  });
};

export const waitForPaymentScheduledScreen = () => cy.contains('Payment summary');
