import type { AxiosInstance, AxiosResponse } from 'axios';

export class Search {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Global search across observations, taxa, projects, etc.
   */
  async get_search(): Promise<AxiosResponse<any>> {
    return this.client.get(`/search`, {});
  }
}
