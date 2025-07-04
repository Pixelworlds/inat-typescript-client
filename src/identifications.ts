import type { HttpClient, ApiResponse } from './types';

export class Identifications {
  constructor(private http: HttpClient) {}

  async delete_identifications_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/identifications/${id}`, {});
  }

  async post_identifications(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/identifications`, { data });
  }

  async put_identifications_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/identifications/${id}`, { data });
  }
}
