import type { HttpClient, ApiResponse } from './types';

export class ObservationFieldValues {
  constructor(private http: HttpClient) {}

  async delete_observationfieldvalues_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observation_field_values/${id}`, {});
  }

  async post_observationfieldvalues(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/observation_field_values`, { data });
  }

  async put_observationfieldvalues_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/observation_field_values/${id}`, { data });
  }
}
