import type { AxiosInstance, AxiosResponse } from 'axios';

export class Photos {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Photo Create
   *
   * Create a photo
   * 
   * @requires Authentication
   */
  async photo_create(): Promise<AxiosResponse<any>> {
    return this.client.post(`/photos`);
  }
}