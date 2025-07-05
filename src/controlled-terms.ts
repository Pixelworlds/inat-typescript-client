import type { HttpClient, ApiResponse } from './types';

export interface TermsForTaxonParams {
  /** Filter by this taxon */
  taxon_id: number;
}

export class ControlledTerms {
  constructor(private http: HttpClient) {}

  /**
   * Terms Index
   *
   * List all attribute controlled terms
   * 
   */
  async terms_index(): Promise<ApiResponse<any>> {
    return this.http.get(`/controlled_terms`);
  }

  /**
   * Terms for Taxon
   *
   * Returns attribute controlled terms relevant to a taxon
   * 
   */
  async terms_for_taxon(params: TermsForTaxonParams): Promise<ApiResponse<any>> {
    return this.http.get(`/controlled_terms/for_taxon`, { params });
  }
}