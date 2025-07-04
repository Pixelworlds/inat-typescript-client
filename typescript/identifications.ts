import type { AxiosInstance, AxiosResponse } from 'axios';

export class Identifications {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_identifications_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/identifications/${id}`, {});
  }

  async post_identifications(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/identifications`, { data });
  }

  async put_identifications_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/identifications/${id}`, { data });
  }
}
