import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export interface OauthAuthorizationParams {
  /** Your application's client ID */
  client_id: string;

  /** URL to redirect the user after authorization */
  redirect_uri: string;

  /** OAuth response type */
  response_type: 'code';

  /** Base64-encoded SHA256 hash of the code_verifier (PKCE flow only) */
  code_challenge?: string;

  /** Method used to generate code_challenge (PKCE flow only) */
  code_challenge_method?: 'S256';

  /** Space-separated list of scopes */
  scope?: string;
}

export class OAuth {
  constructor(private http: HttpClient) {}

  /**
   * OAuth Authorization
   *
   * Redirects the user to the OAuth authorization page where they can approve or deny your application's access request. Supports both standard Authorization Code flow and PKCE (Proof Key for Code Exchange) flow for mobile/SPA applications.
   */
  async oauth_authorization(params: OauthAuthorizationParams): Promise<ApiResponse<any>> {
    return this.http.get(`/oauth/authorize`, { params });
  }

  /**
   * OAuth Token Exchange
   *
   * Exchange authorization code for access token. Supports multiple grant types including Authorization Code, PKCE, and Resource Owner Password Credentials flows.
   */
  async oauth_token_exchange(data: any): Promise<ApiResponse<Types.TokenResponse>> {
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

  /**
   * OAuth Assertion Token
   *
   * Exchange a third-party access token (Facebook, Google) for an iNaturalist access token. This endpoint is only available to authorized partners.
   */
  async oauth_assertion_token(data: any): Promise<ApiResponse<Types.TokenResponse>> {
    const formData = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key].toString());
        }
      });
    }
    
    return this.http.post(`/oauth/assertion_token`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}