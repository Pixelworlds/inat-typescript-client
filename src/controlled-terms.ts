import type { HttpClient, ApiResponse } from './types';

export class ControlledTerms {
  constructor(private http: HttpClient) {}

  /**
   * Get controlled terms for annotations
   */
  async get_controlled_terms(): Promise<ApiResponse<any>> {
    return this.http.get(`/controlled_terms`, {});
  }

  /**
   * Get controlled terms for a specific taxon
   */
  async get_controlled_terms_for_taxon(): Promise<ApiResponse<any>> {
    return this.http.get(`/controlled_terms/for_taxon`, {});
  }
}
