import type { AxiosInstance, AxiosResponse } from 'axios';

export class Observations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_observations_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observations/${id}`, {});
  }

  async delete_observations_id_quality_metric(
    id: string | number,
    metric: string | number
  ): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observations/${id}/quality/${metric}`, {});
  }

  async get_observations(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations`, {});
  }

  async get_observations_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/${id}`, {});
  }

  async get_observations_username(username: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/${username}`, {});
  }

  async get_observations_project_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/project/${id}`, {});
  }

  async get_observations_taxonstats(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/taxon_stats`, {});
  }

  async get_observations_userstats(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/user_stats`, {});
  }

  async post_observations(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observations`, { data });
  }

  async post_observations_id_quality_metric(
    id: string | number,
    metric: string | number,
    data?: any
  ): Promise<AxiosResponse<any>> {
    return this.client.post(`/observations/${id}/quality/${metric}`, { data });
  }

  async put_observations_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observations/${id}`, { data });
  }

  async put_observations_id_viewedupdates(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observations/${id}/viewed_updates`, { data });
  }
}
