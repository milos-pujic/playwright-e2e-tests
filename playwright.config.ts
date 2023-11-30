/* eslint-disable indent */
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

function getBaseUrl() {
  const environment = process.env.ENV;
  if (environment == undefined || environment == null) return 'https://automationintesting.online/';
  else if (environment == 'prod') return 'https://automationintesting.online/';
  else if (environment == 'local') return 'http://localhost';
  else if (environment == 'kubeLocal') return 'http://kube.local';
  else if (environment == 'docker') return 'http://rbp-proxy';
  else return 'https://automationintesting.online/';
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['list'],
        ['line'],
        ['html', { open: 'never' }],
        [
          'monocart-reporter',
          {
            name: 'Playwright E2E Tests',
            outputFile: './playwright-monocart-report/index.html'
          }
        ],
        ['blob', { outputDir: 'playwright-blob-report' }],
        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: 'playwright-allure-results',
            suiteTitle: false
          }
        ]
      ]
    : [
        ['list'],
        ['line'],
        ['html', { open: 'on-failure' }],
        [
          'monocart-reporter',
          {
            name: 'Playwright E2E Tests',
            outputFile: './playwright-monocart-report/index.html'
          }
        ],
        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: 'playwright-allure-results',
            suiteTitle: false
          }
        ]
      ],
  /* Limit the number of failures on CI to save resources */
  maxFailures: process.env.CI ? 10 : undefined,
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',
  /* path to the global setup files. */
  // globalSetup: require.resolve('./setup/global.setup.ts'),
  /* path to the global teardown files. */
  // globalTeardown: require.resolve('./setup/global.teardown.ts'),
  /* Each test is given 60 seconds. */
  timeout: 60000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),
    /* Populates context with given storage state. */
    // storageState: './state.json',
    /* Viewport used for all pages in the context. */
    // viewport: { width: 1280, height: 720 },
    /* Capture screenshot. */
    screenshot: 'only-on-failure',
    /* Record video. */
    video: 'on-first-retry',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'off' : 'on-first-retry',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Whether to ignore HTTPS errors when sending network requests. Defaults to `false`. */
    ignoreHTTPSErrors: true,
    /* Run browser in headless mode. */
    headless: true,
    /* Change the default data-testid attribute. */
    testIdAttribute: 'data-testid'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], trace: process.env.CI ? 'on-first-retry' : 'on-first-retry' }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
