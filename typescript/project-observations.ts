import type { AxiosInstance, AxiosResponse } from 'axios';

export class ProjectObservations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async post_projectobservations(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/project_observations`, { data });
  }
}
