import type { HttpClient, ApiResponse } from './types';

export class Places {
  constructor(private http: HttpClient) {}

  async get_places(): Promise<ApiResponse<any>> {
    return this.http.get(`/places`, {});
  }
}
