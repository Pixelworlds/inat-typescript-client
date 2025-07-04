import type { AxiosInstance, AxiosResponse } from 'axios';

export class Places {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get_places(): Promise<AxiosResponse<any>> {
    return this.client.get(`/places`, {});
  }
}
