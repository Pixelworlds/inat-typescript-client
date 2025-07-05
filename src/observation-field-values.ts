import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export class ObservationFieldValues {
  constructor(private http: HttpClient) {}

  /**
   * Observation Field Value Update
   *
   * Update an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_update(id: number, data: Types.PostObservationFieldValue): Promise<ApiResponse<any>> {
    return this.http.put(`/observation_field_values/${id}`, data);
  }

  /**
   * Observation Field Value Delete
   *
   * Delete an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observation_field_values/${id}`);
  }

  /**
   * Observation Field Value Create
   *
   * Create an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_create(data: Types.PostObservationFieldValue): Promise<ApiResponse<any>> {
    return this.http.post(`/observation_field_values`, data);
  }
}