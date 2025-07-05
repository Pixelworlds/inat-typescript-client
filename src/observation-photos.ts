import type { HttpClient, ApiResponse } from './types';

export class ObservationPhotos {
  constructor(private http: HttpClient) {}

  /**
   * Observation Photo Update
   *
   * Update an observation photo
   * @requires Authentication
   */
  async observation_photo_update(id: number): Promise<ApiResponse<any>> {
    return this.http.put(`/observation_photos/${id}`);
  }

  /**
   * Observation Photo Delete
   *
   * Delete an observation photo
   * 
   * @requires Authentication
   */
  async observation_photo_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observation_photos/${id}`);
  }

  /**
   * Observation Photo Create
   *
   * Create an observation photo
   * 
   * @requires Authentication
   */
  async observation_photo_create(): Promise<ApiResponse<any>> {
    return this.http.post(`/observation_photos`);
  }
}