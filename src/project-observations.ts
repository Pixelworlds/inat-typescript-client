import type { HttpClient, ApiResponse } from './types';

export class ProjectObservations {
  constructor(private http: HttpClient) {}

  async post_project_observations(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/project_observations`, { data });
  }
}
