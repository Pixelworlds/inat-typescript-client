import type { HttpClient, ApiResponse } from './types';

export class Search {
  constructor(private http: HttpClient) {}

  /**
   * Global search across observations, taxa, projects, etc.
   */
  async get_search(): Promise<ApiResponse<any>> {
    return this.http.get(`/search`, {});
  }
}
