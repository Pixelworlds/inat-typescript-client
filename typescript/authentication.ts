import type { AxiosInstance, AxiosResponse } from 'axios';

export class Authentication {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * OAuth authorization endpoint - redirects user to authorize your application
   */
  async get_oauth_authorize(): Promise<AxiosResponse<any>> {
    return this.client.get(`/oauth/authorize`, {});
  }

  /**
   * Get user API token for authenticated requests
   */
  async get_users_api_token(): Promise<AxiosResponse<any>> {
    return this.client.get(`/users/api_token`, {});
  }

  /**
   * OAuth token exchange endpoint - exchange authorization code for access token
   */
  async post_oauth_token(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/oauth/token`, { data });
  }
}
