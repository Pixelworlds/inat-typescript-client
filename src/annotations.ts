import type { HttpClient, ApiResponse } from './types';

export class Annotations {
  constructor(private http: HttpClient) {}

  /**
   * Create an annotation
   */
  async post_annotations(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/annotations`, { data });
  }

  /**
   * Delete an annotation
   */
  async delete_annotations_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/annotations/${id}`, {});
  }
}
