import { APIRequestContext, test, expect } from '@playwright/test';
import { BaseApi } from './BaseApi';

const path = '/auth';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(username: string, password: string) {
    await test.step(`Log in using API with username: ${username} and password: ${password}`, async () => {
      const response = await this.request.post(`${path}/login`, {
        data: {
          username: username,
          password: password
        }
      });
      expect(response.status(), `User '${username}' logged in`).toBe(200);
    });
  }
}
