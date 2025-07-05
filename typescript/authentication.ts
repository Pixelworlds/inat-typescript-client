import type { AxiosInstance, AxiosResponse } from 'axios';

interface Get_oauth_authorizeParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  scope?: string;
}

export class Authentication {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get_oauth_authorize(params?: Get_oauth_authorizeParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/oauth/authorize`, { params });
  }

  async get_users_apitoken(): Promise<AxiosResponse<any>> {
    return this.client.get(`/users/api_token`, {});
  }

  /**
   * OAuth token exchange endpoint - exchange authorization code for access token
   */
  async post_oauth_token(data?: any): Promise<AxiosResponse<any>> {
    const formData = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key].toString());
        }
      });
    }
    
    return this.client.post(`/oauth/token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}