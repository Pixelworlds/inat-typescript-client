import type { AxiosInstance, AxiosResponse } from 'axios';

export class Observations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_observations_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observations/${id}`, {});
  }

  async delete_observations_id_quality_metric(id: string | number, metric: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/observations/${id}/quality/${metric}`, {});
  }

  /**
   * Primary endpoint for retrieving observations. If you're looking for
pagination info, check the X headers in the response. You should see
   */
  async get_observations(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations`, {});
  }

  /**
   * Retrieve information about an observation
   */
  async get_observations_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/${id}`, {});
  }

  /**
   * Mostly the same as /observations except filtered by a username.
   */
  async get_observations_username(username: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/${username}`, {});
  }

  /**
   * Just like /observations except filtered by a project.  :id can be a project ID or slug. CSV response will return some extra project-specific daa.
   */
  async get_observations_project_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/project/${id}`, {});
  }

  /**
   * Retrieve some stats about taxa within a range of observations.
   */
  async get_observations_taxon_stats(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/taxon_stats`, {});
  }

  /**
   * Retrieve some stats about users within a range of observations.
      You must include the
   */
  async get_observations_user_stats(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observations/user_stats`, {});
  }

  async post_observations(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observations`, { data });
  }

  async post_observations_id_quality_metric(id: string | number, metric: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/observations/${id}/quality/${metric}`, { data });
  }

  async put_observations_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observations/${id}`, { data });
  }

  /**
   * Mark updates associated with this observation (e.g. new comment notifications) as viewed. Response should be NO CONTENT.
   */
  async put_observations_id_viewed_updates(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/observations/${id}/viewed_updates`, { data });
  }
}
