import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export interface UserProjectsParams {
  /** Return more information about project rules, for example return a full
taxon object instead of simply an ID
 */
  rule_details?: 'true';

  /** Specify the type of project to return
 */
  project_type?: 'traditional' | 'collection' | 'umbrella';

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export interface UserAutocompleteParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q: string;

  /** Only show users with memberships to this project */
  project_id?: number;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export class Users {
  constructor(private http: HttpClient) {}

  /**
   * User Details
   *
   * Given an ID, returns corresponding user
   */
  async user_details(id: number): Promise<ApiResponse<any>> {
    return this.http.get(`/users/${id}`);
  }

  /**
   * User Update
   *
   * Update a user
   * 
   * @requires Authentication
   */
  async user_update(id: number): Promise<ApiResponse<any>> {
    return this.http.put(`/users/${id}`);
  }

  /**
   * User Projects
   *
   * Return projects as user has joined / followed
   * 
   */
  async user_projects(id: number, params?: UserProjectsParams): Promise<ApiResponse<any>> {
    return this.http.get(`/users/${id}/projects`, { params });
  }

  /**
   * User Autocomplete
   *
   * Given an string, returns users with names or logins starting with the search term
   * 
   */
  async user_autocomplete(params: UserAutocompleteParams): Promise<ApiResponse<any>> {
    return this.http.get(`/users/autocomplete`, { params });
  }

  /**
   * Users Me
   *
   * Fetch the logged-in user
   * @requires Authentication
   */
  async users_me(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/me`);
  }

  /**
   * Mute a User
   *
   * Make it so the authenticated user stops receiving notifications about
   * activity by the user specified by {id}.
   * 
   * @requires Authentication
   */
  async mute_a_user(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/users/${id}/mute`);
  }

  /**
   * Unmute a User
   *
   * Remove a mute on the user specified by {id}
   * @requires Authentication
   */
  async unmute_a_user(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/users/${id}/mute`);
  }

  /**
   * User Resend Confirmation
   *
   * Resend an email confirmation
   * @requires Authentication
   */
  async user_resend_confirmation(): Promise<ApiResponse<any>> {
    return this.http.post(`/users/resend_confirmation`);
  }

  /**
   * User Update Session
   *
   * Update the logged-in user's session
   * @requires Authentication
   */
  async user_update_session(data: Types.PostUserUpdateSession): Promise<ApiResponse<any>> {
    return this.http.put(`/users/update_session`, data);
  }

  /**
   * Get JWT API Token
   *
   * Exchange an OAuth access token for a JWT (JSON Web Token) that can be used to authenticate API requests. The JWT expires after 24 hours.
   * @requires Authentication
   */
  async get_jwt_api_token(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/api_token`);
  }

  /**
   * Get User Edit Profile
   *
   * Retrieve the authenticated user's profile data in edit format. This endpoint is used to verify OAuth token functionality.
   * @requires Authentication
   */
  async get_user_edit_profile(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/edit.json`);
  }
}