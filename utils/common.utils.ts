import { faker } from '@faker-js/faker';
import type { StaticResponse } from 'cypress/types/net-stubbing';
import sign from 'jwt-encode';

import {
  GroupItem,
  isBillGroupItem,
  isPaymentGroupItem,
  isPaymentRequestGroupItem,
  isScannedInvoiceGroupItem,
} from '@/types/payDashboard.types';
import { AccessTokenPayloadType } from '@/types/payload.types';
import { getEnvName } from './env.utils';

export const DEFAULT_TIMEOUT_MS = 50000;
export const LONG_TIMEOUT_MS = 200000;
export const ACCEPTED_RESPONSE_CODES = [200, 201, 204, 304];
export const ERROR_CODES = [400];

export enum InterceptorsNames {
  PostAuthCallback = 'postAuthCallback',
  PostAuthRegister = 'postAuthRegister',
  PostAuthDemo = 'postAuthDemo',
  GetAccountMe = 'getAccountMe',
  GetAccountMeAll = 'getAccountMeAll',
  PatchAccountMe = 'patchAccountMe',
  AddressLookup = 'addressLookup',
  IndustryLookup = 'industryLookup',
  GetVendors = 'getVendors',
  GetVendor = 'getVendor',
  GetFeeCatalogs = 'getFeeCatalogs',
  GetPaymentIntent = 'getPaymentIntent',
  GetPaymentIntents = 'getPaymentIntents',
  PatchPaymentIntent = 'patchPaymentIntent',
  GetScannedInvoices = 'getScannedInvoices',
  GetFundingSources = 'getFundingSources',
  GetOrganizationPreferences = 'getOrganizationPreferences',
  GetAccountingPlatforms = 'getAccountingPlatforms',
  GetPaymentsReport = 'getPaymentsReport',
  GetPayments = 'getPayments',
  PostPayments = 'postPayments',
  PatchPayments = 'patchPayments',
  PostVendor = 'postVendor',
  PostVendorDeliveryMethods = 'postVendorDeliveryMethods',
  GetVendorDeliveryMethods = 'getVendorDeliveryMethods',
  PostBills = 'postBills',
}

export const uuid = () => `${new Date().getTime()}_${faker.datatype.uuid()}`;

export const fakeTaxId = () => faker.datatype.number({ min: 111111111, max: 999999999 }).toString();

export const fakeEmail = () => faker.internet.email(uuid());

export const intercept = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  as: InterceptorsNames,
  staticResponse?: StaticResponse,
) => {
  return cy.intercept(method, url, staticResponse).as(as);
};

export const wait = (
  name: InterceptorsNames,
  timeout: number = DEFAULT_TIMEOUT_MS,
  statusCodes = ACCEPTED_RESPONSE_CODES,
) =>
  cy.wait(`@${name}`, { timeout }).then((interception) => {
    console.log(JSON.stringify(interception));
    return cy.wrap(interception).its('response.statusCode').should('be.oneOf', statusCodes).wrap(interception);
  });

export const waitArray = (names: InterceptorsNames[], timeout: number = DEFAULT_TIMEOUT_MS) =>
  cy.wait(
    names.map((it) => `@${it}`),
    { timeout },
  );

export const findAllByTestId = (testId: string) => cy.get(`[data-testid=${testId}]`);
export const findAllByTestIdStartWith = (testId: string) => cy.get(`[data-testid^=${testId}]`);
export const getByInputName = (inputName: string) => cy.get(`input[name=${inputName}]`);
export const getByDataComponent = (...componentNames: string[]): Cypress.Chainable =>
  componentNames.reduce((elem, componentName) => elem.find(`[data-component=${componentName}]`), cy.root());
export const getByTestId = (...testIds: string[]): Cypress.Chainable =>
  testIds.reduce((elem, testId) => elem.find(`[data-testid=${testId}]`), cy.root());
export const assertElementValue = (elementId: string, value: string) =>
  getByTestId(elementId).invoke('val').should('eq', value);
export const assertElementByTestId = (testId: string) => cy.get(`[data-testid=${testId}]`).should('be.visible');
export const inputTextWithValidation = (testId: string, text: string, validationText?: string) =>
  getByTestId(testId)
    .clear()
    .should('have.value', '')
    .type(text)
    .should('have.value', validationText || text);

export const getDates = () => {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const conditionalDescribe = (environments: string[]) => {
  return environments.includes(getEnvName()) ? describe : describe.skip;
};

export const describeOnAlpha = conditionalDescribe(['alpha']);

export const verifyViewMode = (testId: string) => getByTestId(testId).should('have.attr', 'data-view-mode');

export const getPayDashboardItemId = (payDashboardItem: GroupItem) => {
  if (isScannedInvoiceGroupItem(payDashboardItem)) {
    return payDashboardItem.scannedInvoice.id;
  } else if (isPaymentGroupItem(payDashboardItem)) {
    return payDashboardItem.payment.id;
  } else if (isBillGroupItem(payDashboardItem)) {
    return payDashboardItem.bill.id;
  } else if (isPaymentRequestGroupItem(payDashboardItem)) {
    return payDashboardItem.paymentRequest.id;
  }
};

export const getPayDashboardItemType = (payDashboardItem: GroupItem) => payDashboardItem.type;

export const getAccessToken = (tokenData: AccessTokenPayloadType) => {
  const accessToken = sign(tokenData, 'all your base are belong to us');

  return accessToken;
};
