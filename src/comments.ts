import type { HttpClient, ApiResponse } from './types';

export class Comments {
  constructor(private http: HttpClient) {}

  async delete_comments_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/comments/${id}`, {});
  }

  async post_comments(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/comments`, { data });
  }

  async put_comments_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/comments/${id}`, { data });
  }
}
