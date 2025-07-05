import type { HttpClient, ApiResponse } from './types';

export class ObservationPhotos {
  constructor(private http: HttpClient) {}

  async post_observation_photos(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/observation_photos`, { data });
  }
}
