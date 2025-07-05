import type { HttpClient, ApiResponse } from './types';

export class Users {
  constructor(private http: HttpClient) {}

  async get_users_edit(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/edit`, {});
  }

  async get_users_new_updates(): Promise<ApiResponse<any>> {
    return this.http.get(`/users/new_updates`, {});
  }

  /**
   * Create a new iNaturalist user
   */
  async post_users(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/users`, { data });
  }

  async put_users_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/users/${id}`, { data });
  }
}
