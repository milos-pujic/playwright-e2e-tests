import { localStorageKeys, localStorageSetItem } from '@/utils/localStorage.utils';

const loginWithDemoAccount = ({ partnerName = 'capital-one', accountId = 'new', withTaxId = false } = {}) => {
  const url = '/v1/auth/demo';
  const body = JSON.stringify({ partnerName, accountId, withTaxId });
  const config = {
    method: 'POST',
    url,
    headers: { 'Content-Type': 'application/json' },
    body,
  };

  return cy.request(config).then((res) => {
    localStorageSetItem(localStorageKeys.accessToken, res.body.data.accessToken);
  });
};

export const setup = {
  loginWithDemoAccount,
};

export const actions = {
  switchOrg: (companyName: string) =>
    getByTestId('select-company-btn')
      .click()
      .then(() => getByTestId('selection-menu-results-container').contains(companyName).click()),
};
