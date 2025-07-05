import type { AxiosInstance, AxiosResponse } from 'axios';

export class Taxa {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Search taxa
   */
  async get_taxa(): Promise<AxiosResponse<any>> {
    return this.client.get(`/taxa`, {});
  }

  /**
   * Get taxon details
   */
  async get_taxa_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/taxa/${id}`, {});
  }
}
