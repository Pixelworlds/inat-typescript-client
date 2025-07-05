import type { HttpClient, ApiResponse } from './types';

export class Flags {
  constructor(private http: HttpClient) {}

  /**
   * Create a flag
   */
  async post_flags(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/flags`, { data });
  }

  /**
   * Update a flag
   */
  async put_flags_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/flags/${id}`, { data });
  }

  /**
   * Delete a flag
   */
  async delete_flags_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/flags/${id}`, {});
  }
}
