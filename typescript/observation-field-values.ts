import type { AxiosInstance, AxiosResponse } from 'axios';

export class ObservationFieldValues {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_observationfieldvalues_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observation_field_values/${id}`, {});
  }

  async post_observationfieldvalues(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observation_field_values`, { data });
  }

  async put_observationfieldvalues_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observation_field_values/${id}`, { data });
  }
}
