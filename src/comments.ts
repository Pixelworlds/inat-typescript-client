import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export class Comments {
  constructor(private http: HttpClient) {}

  /**
   * Comment Create
   *
   * Create a comment
   * 
   * @requires Authentication
   */
  async comment_create(data: Types.PostComment): Promise<ApiResponse<any>> {
    return this.http.post(`/comments`, data);
  }

  /**
   * Comment Update
   *
   * Update a comment
   * 
   * @requires Authentication
   */
  async comment_update(id: number, data: Types.PostComment): Promise<ApiResponse<any>> {
    return this.http.put(`/comments/${id}`, data);
  }

  /**
   * Comment Delete
   *
   * Delete a comment
   * 
   * @requires Authentication
   */
  async comment_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/comments/${id}`);
  }
}