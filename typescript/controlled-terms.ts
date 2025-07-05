import type { AxiosInstance, AxiosResponse } from 'axios';

export interface TermsForTaxonParams {
  /** Filter by this taxon */
  taxon_id: number;
}

export class ControlledTerms {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Terms Index
   *
   * List all attribute controlled terms
   * 
   */
  async terms_index(): Promise<AxiosResponse<any>> {
    return this.client.get(`/controlled_terms`);
  }

  /**
   * Terms for Taxon
   *
   * Returns attribute controlled terms relevant to a taxon
   * 
   */
  async terms_for_taxon(params: TermsForTaxonParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/controlled_terms/for_taxon`, { params });
  }
}