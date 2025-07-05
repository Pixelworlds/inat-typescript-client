import type { HttpClient, ApiResponse } from './types';

export class Authentication {
  constructor(private http: HttpClient) {}

  /**
   * OAuth authorization endpoint - redirects user to authorize your application
   */
  async get_oauth_authorize(): Promise<ApiResponse<any>> {
    return this.http.get(`/oauth/authorize`, {});
  }

  /**
   * Get user API token for authenticated requests
   */
  async get_users_api_token(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/api_token`, {});
  }

  /**
   * OAuth token exchange endpoint - exchange authorization code for access token
   */
  async post_oauth_token(data?: any): Promise<ApiResponse<any>> {
    const formData = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key].toString());
        }
      });
    }
    
    return this.http.post(`/oauth/token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
