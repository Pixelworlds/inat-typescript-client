import type { AxiosInstance, AxiosResponse } from 'axios';

export class Flags {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Create a flag
   */
  async post_flags(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/flags`, { data });
  }

  /**
   * Update a flag
   */
  async put_flags_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/flags/${id}`, { data });
  }

  /**
   * Delete a flag
   */
  async delete_flags_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/flags/${id}`, {});
  }
}
