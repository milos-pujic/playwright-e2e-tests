export const enum ENV_VARS {
  ENVIRONMENT = 'environment',
  API_KEY = 'apiKey',
  AUTH_MOCK_LINK = 'authMockLink',
  ACCOUNT = 'account',
  SIZZERS_API_URL = 'sizzersApiUrl',
  USER_ORGS = 'userOrgs',
  PUBLIC_KEY = 'publicKey',
  CLIENT_BASE_URL = 'clientBaseUrl',
}

export const getEnvApiKey = () => Cypress.env(ENV_VARS.API_KEY);

export const getEnvOnboardingMockLink = () => Cypress.env(ENV_VARS.AUTH_MOCK_LINK);

export const getEnvSizzersApiUrl = () => Cypress.env(ENV_VARS.SIZZERS_API_URL);

export const getEnvUserOrgs = () => Cypress.env(ENV_VARS.USER_ORGS);

export const getEnvName = () => Cypress.env(ENV_VARS.ENVIRONMENT);

export const getEnvPublicKey = () => Cypress.env(ENV_VARS.PUBLIC_KEY);

export const getClientBaseUrl = () => Cypress.env(ENV_VARS.CLIENT_BASE_URL);
