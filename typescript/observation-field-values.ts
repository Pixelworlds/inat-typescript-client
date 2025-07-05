import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export class ObservationFieldValues {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Observation Field Value Update
   *
   * Update an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_update(id: number, data: Types.PostObservationFieldValue): Promise<AxiosResponse<any>> {
    return this.client.put(`/observation_field_values/${id}`, data);
  }

  /**
   * Observation Field Value Delete
   *
   * Delete an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observation_field_values/${id}`);
  }

  /**
   * Observation Field Value Create
   *
   * Create an observation field value
   * 
   * @requires Authentication
   */
  async observation_field_value_create(data: Types.PostObservationFieldValue): Promise<AxiosResponse<any>> {
    return this.client.post(`/observation_field_values`, data);
  }
}