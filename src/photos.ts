import type { HttpClient, ApiResponse } from './types';

export class Photos {
  constructor(private http: HttpClient) {}

  /**
   * Photo Create
   *
   * Create a photo
   * 
   * @requires Authentication
   */
  async photo_create(): Promise<ApiResponse<any>> {
    return this.http.post(`/photos`);
  }
}