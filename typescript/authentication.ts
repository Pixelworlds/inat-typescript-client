import type { AxiosInstance, AxiosResponse } from 'axios';

export class Authentication {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Get JWT API Token
   *
   * Exchange an OAuth access token for a JWT (JSON Web Token) that can be used to authenticate API requests. The JWT expires after 24 hours.
   * @requires Authentication
   */
  async get_jwt_api_token(): Promise<AxiosResponse<any>> {
    return this.client.get(`/users/api_token`);
  }
}