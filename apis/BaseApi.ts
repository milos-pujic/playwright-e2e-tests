import { APIRequestContext } from '@playwright/test';

export class BaseApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}
