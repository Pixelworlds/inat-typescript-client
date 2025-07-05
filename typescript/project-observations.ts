import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export class ProjectObservations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Project Observation Update
   *
   * Update a project observation
   * @requires Authentication
   */
  async project_observation_update(id: number, data: Types.UpdateProjectObservation): Promise<AxiosResponse<any>> {
    return this.client.put(`/project_observations/${id}`, data);
  }

  /**
   * Project Observation Delete
   *
   * Delete a project observation
   * @requires Authentication
   */
  async project_observation_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/project_observations/${id}`);
  }

  /**
   * Project Observation Create
   *
   * Add an observation to a project
   * @requires Authentication
   */
  async project_observation_create(data: Types.PostProjectObservation): Promise<AxiosResponse<any>> {
    return this.client.post(`/project_observations`, data);
  }
}