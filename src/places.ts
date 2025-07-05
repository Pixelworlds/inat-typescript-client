import type { HttpClient, ApiResponse } from './types';

export class Places {
  constructor(private http: HttpClient) {}

  /**
   * Retrieve information about places.
   */
  async get_places(): Promise<ApiResponse<any>> {
    return this.http.get(`/places`, {});
  }
}
