import type { AxiosInstance, AxiosResponse } from 'axios';

export class ObservationPhotos {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Observation Photo Update
   *
   * Update an observation photo
   * @requires Authentication
   */
  async observation_photo_update(id: number): Promise<AxiosResponse<any>> {
    return this.client.put(`/observation_photos/${id}`);
  }

  /**
   * Observation Photo Delete
   *
   * Delete an observation photo
   * 
   * @requires Authentication
   */
  async observation_photo_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observation_photos/${id}`);
  }

  /**
   * Observation Photo Create
   *
   * Create an observation photo
   * 
   * @requires Authentication
   */
  async observation_photo_create(): Promise<AxiosResponse<any>> {
    return this.client.post(`/observation_photos`);
  }
}