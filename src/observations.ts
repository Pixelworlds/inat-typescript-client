import type { HttpClient, ApiResponse } from './types';

export class Observations {
  constructor(private http: HttpClient) {}

  async delete_observations_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}`, {});
  }

  async delete_observations_id_quality_metric(
    id: string | number,
    metric: string | number
  ): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}/quality/${metric}`, {});
  }

  async get_observations(): Promise<ApiResponse<any>> {
    return this.http.get(`/observations`, {});
  }

  async get_observations_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/${id}`, {});
  }

  async get_observations_username(username: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/${username}`, {});
  }

  async get_observations_project_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/project/${id}`, {});
  }

  async get_observations_taxonstats(): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/taxon_stats`, {});
  }

  async get_observations_userstats(): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/user_stats`, {});
  }

  async post_observations(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/observations`, { data });
  }

  async post_observations_id_quality_metric(
    id: string | number,
    metric: string | number,
    data?: any
  ): Promise<ApiResponse<any>> {
    return this.http.post(`/observations/${id}/quality/${metric}`, { data });
  }

  async put_observations_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/observations/${id}`, { data });
  }

  async put_observations_id_viewedupdates(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/observations/${id}/viewed_updates`, { data });
  }
}
