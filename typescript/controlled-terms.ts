import type { AxiosInstance, AxiosResponse } from 'axios';

export class ControlledTerms {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Get controlled terms for annotations
   */
  async get_controlled_terms(): Promise<AxiosResponse<any>> {
    return this.client.get(`/controlled_terms`, {});
  }

  /**
   * Get controlled terms for a specific taxon
   */
  async get_controlled_terms_for_taxon(): Promise<AxiosResponse<any>> {
    return this.client.get(`/controlled_terms/for_taxon`, {});
  }
}
