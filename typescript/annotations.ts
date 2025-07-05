import type { AxiosInstance, AxiosResponse } from 'axios';

export class Annotations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Create an annotation
   */
  async post_annotations(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/annotations`, { data });
  }

  /**
   * Delete an annotation
   */
  async delete_annotations_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/annotations/${id}`, {});
  }
}
