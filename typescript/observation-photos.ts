import type { AxiosInstance, AxiosResponse } from 'axios';

export class ObservationPhotos {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async post_observationphotos(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observation_photos`, { data });
  }
}
