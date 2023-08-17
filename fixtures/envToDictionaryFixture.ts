import { test as base, Page } from '@playwright/test';
import { EnvConfig } from '../types/EnvConfig'; // Replace this with your own type definition for the environment variables.

// Fixture to set up the environment variables before each test

  export const test = base.extend<{ envConfig: EnvConfig }>({
    envConfig: async ({}, use) => {
      const envConfig: EnvConfig = {
          // Define your environment variables here
          // For example:
          Url: process.env.URL || '',
          Username: process.env.USERNAME || '',
          Password: process.env.PASSWORD || ''
        };
        await use(envConfig); 
    },
  });

  // Attach the environment variables to the test context, so you can access them during your tests
  
