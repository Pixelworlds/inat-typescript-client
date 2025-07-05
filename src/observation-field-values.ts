import type { HttpClient, ApiResponse } from './types';

export class ObservationFieldValues {
  constructor(private http: HttpClient) {}

  async delete_observation_field_values_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observation_field_values/${id}`, {});
  }

  async post_observation_field_values(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/observation_field_values`, { data });
  }

  async put_observation_field_values_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/observation_field_values/${id}`, { data });
  }
}
