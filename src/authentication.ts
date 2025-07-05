import type { HttpClient, ApiResponse } from './types';

interface Get_oauth_authorizeParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  scope?: string;
}

export class Authentication {
  constructor(private http: HttpClient) {}

  async get_oauth_authorize(params?: Get_oauth_authorizeParams): Promise<ApiResponse<any>> {
    return this.http.get(`/oauth/authorize`, { params });
  }

  async get_users_apitoken(): Promise<ApiResponse<any>> {
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