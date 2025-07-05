import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export class Comments {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Comment Create
   *
   * Create a comment
   * 
   * @requires Authentication
   */
  async comment_create(data: Types.PostComment): Promise<AxiosResponse<any>> {
    return this.client.post(`/comments`, data);
  }

  /**
   * Comment Update
   *
   * Update a comment
   * 
   * @requires Authentication
   */
  async comment_update(id: number, data: Types.PostComment): Promise<AxiosResponse<any>> {
    return this.client.put(`/comments/${id}`, data);
  }

  /**
   * Comment Delete
   *
   * Delete a comment
   * 
   * @requires Authentication
   */
  async comment_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/comments/${id}`);
  }
}