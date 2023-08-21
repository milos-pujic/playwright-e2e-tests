import { Account, PartnerName } from '@melio/platform-api';

import { ProviderName } from '../factories';
import { ScreensEnum } from './../../src/store/app/app.types';
import {
  ACCEPTED_RESPONSE_CODES,
  DEFAULT_TIMEOUT_MS,
  ERROR_CODES,
  getByTestId,
  intercept,
  InterceptorsNames,
  wait,
} from './common.utils';
import {
  assertJustPayShown,
  assertNewDashboardShown,
  assertNewPayDashboardShown,
  assertOldPayDashboardShown,
  OnboardingFinishCallbackType,
} from './payDashboard.utils';
import { asyncSelectFirstValue, clickButton } from './ui.utils';

type WaitOptions = {
  error?: 'none' | 'allowed' | 'only';
};

export const interceptOnboardingApis = (providerName: ProviderName) => {
  intercept('POST', `/v1/auth/providers/${providerName}/callback`, InterceptorsNames.PostAuthCallback);
  intercept('POST', `/v1/auth/oauth2/register`, InterceptorsNames.PostAuthRegister);
};

export const waitPostAuthCallback = ({ error }: WaitOptions = { error: 'none' }) =>
  wait(
    InterceptorsNames.PostAuthCallback,
    DEFAULT_TIMEOUT_MS,
    error === 'none'
      ? ACCEPTED_RESPONSE_CODES
      : error === 'only'
      ? ERROR_CODES
      : [...ACCEPTED_RESPONSE_CODES, ...ERROR_CODES],
  );

export const waitPostAuthRegisterAndAcceptTerms = (status: 'created' | 'not-created' = 'not-created') =>
  wait(InterceptorsNames.PostAuthRegister).then((interception) => {
    if (
      interception.response?.body.data.status === 'not-created' &&
      interception.response?.body.data.info.reasons.includes('user-consent')
    ) {
      clickButton('Continue');
      if (interception.response?.body.data.info.reasons.length == 1) {
        waitPostAuthRegisterAndAcceptTerms(status);
      }
    } else {
      return cy.wrap(interception).its('response.body.data.status').should('eq', status);
    }
  });

export const interceptAddressLookup = () =>
  intercept('GET', 'https://us-autocomplete-pro.api.smartystreets.com/*', InterceptorsNames.AddressLookup, {
    fixture: 'address-suggestions.json',
  });

export const waitForAddressLookup = () => wait(InterceptorsNames.AddressLookup);

export const assertAccountCreatedAndOldDashboardShown = (cb?: (account: Account) => void) => {
  waitPostAuthRegisterAndAcceptTerms('created');
  assertOldPayDashboardShown(cb);
};

export const assertAccountCreatedAndNewDashboardShown = (cb?: (account: Account) => void) => {
  waitPostAuthRegisterAndAcceptTerms('created');
  assertNewPayDashboardShown(cb);
};

export const assertAccountCreatedAndJustPayShown = (cb?: OnboardingFinishCallbackType) => {
  waitPostAuthRegisterAndAcceptTerms('created');
  assertJustPayShown(cb);
};

export const assertAccountCreatedAndNewDashboard = (cb?: OnboardingFinishCallbackType) => {
  return waitPostAuthRegisterAndAcceptTerms('created').then(() => {
    assertNewDashboardShown(cb);
  });
};

export const assertSeamlessCardCreated = () => {
  cy.contains('Settings').click();
  cy.contains('Payment methods').click();
  cy.contains('Visa ...1111');
};

export const fillOnboardingMissingDataForm = ({
  firstName,
  lastName,
  companyName,
  addressQuery,
}: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  addressQuery?: string;
}) => {
  if (firstName !== undefined) {
    getByTestId('form-input-firstName').type(firstName);
  }
  if (lastName !== undefined) {
    getByTestId('form-input-lastName').type(lastName);
  }

  if (companyName !== undefined) {
    getByTestId('form-input-companyName').type(companyName);
  }

  if (addressQuery !== undefined) {
    asyncSelectFirstValue({
      testId: 'form-input-address',
      query: addressQuery,
      wait: waitForAddressLookup,
    });
  }

  clickButton('Done');
};

export const assertBusinessField = () => cy.contains('Tell us more about your business');
export const assertFirstNameField = () => cy.contains('First name');

const getCreditCardDate = () => {
  const date = new Date();
  const year = date.getFullYear() + 4;
  return `${year}02`;
};

export const getFakeCardData = () => {
  return {
    cardNumber: '4111111111111111',
    expirationDate: getCreditCardDate(),
    cardSecurityCode: '123',
  };
};

export const getScreenToShowOnOnboardingEnd = (isJustPayFlagOn: boolean, partnerName?: PartnerName) => {
  const partnersConfiguredWithNewPayExperience: PartnerName[] = [PartnerName.Sbb];

  const payDashboardScreen =
    partnerName && partnersConfiguredWithNewPayExperience.includes(partnerName)
      ? 'new-pay-dashboard'
      : 'old-pay-dashboard';
  return isJustPayFlagOn ? 'just-pay' : payDashboardScreen;
};

export const assertAccountCreatedAndDefaultScreenShown = ({
  accountCallback,
  screenToShow,
}: {
  accountCallback?: (account: Account) => void;
  screenToShow?: 'new-pay-dashboard' | 'old-pay-dashboard' | 'just-pay';
}) => {
  switch (screenToShow) {
    case 'just-pay':
      assertAccountCreatedAndJustPayShown(accountCallback);
      break;
    case 'old-pay-dashboard':
      assertAccountCreatedAndOldDashboardShown(accountCallback);
      break;
    case 'new-pay-dashboard':
      assertAccountCreatedAndNewDashboardShown(accountCallback);
      break;
  }
};

export const assertDefaultScreenShown = ({
  accountCallback,
  screenToShow,
}: {
  accountCallback?: (account: Account) => void;
  screenToShow?: ScreensEnum;
}) => {
  switch (screenToShow) {
    case ScreensEnum.justPay:
      assertJustPayShown(accountCallback);
      break;
    case ScreensEnum.payDashboard:
      assertOldPayDashboardShown(accountCallback);
      break;
  }
};
