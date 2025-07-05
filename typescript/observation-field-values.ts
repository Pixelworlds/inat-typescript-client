import type { AxiosInstance, AxiosResponse } from 'axios';

export class ObservationFieldValues {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_observation_field_values_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observation_field_values/${id}`, {});
  }

  async post_observation_field_values(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observation_field_values`, { data });
  }

  async put_observation_field_values_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observation_field_values/${id}`, { data });
  }
}
