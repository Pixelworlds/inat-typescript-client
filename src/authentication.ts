import type { HttpClient, ApiResponse } from './types';

export class Authentication {
  constructor(private http: HttpClient) {}

  /**
   * Get JWT API Token
   *
   * Exchange an OAuth access token for a JWT (JSON Web Token) that can be used to authenticate API requests. The JWT expires after 24 hours.
   * @requires Authentication
   */
  async get_jwt_api_token(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/api_token`);
  }
}