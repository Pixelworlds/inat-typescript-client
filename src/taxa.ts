import type { HttpClient, ApiResponse } from './types';

export class Taxa {
  constructor(private http: HttpClient) {}

  /**
   * Search taxa
   */
  async get_taxa(): Promise<ApiResponse<any>> {
    return this.http.get(`/taxa`, {});
  }

  /**
   * Get taxon details
   */
  async get_taxa_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/taxa/${id}`, {});
  }
}
