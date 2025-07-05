import type { HttpClient, ApiResponse } from './types';
import type * as Types from './types/swagger-types';

export class ProjectObservations {
  constructor(private http: HttpClient) {}

  /**
   * Project Observation Update
   *
   * Update a project observation
   * @requires Authentication
   */
  async project_observation_update(id: number, data: Types.UpdateProjectObservation): Promise<ApiResponse<any>> {
    return this.http.put(`/project_observations/${id}`, data);
  }

  /**
   * Project Observation Delete
   *
   * Delete a project observation
   * @requires Authentication
   */
  async project_observation_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/project_observations/${id}`);
  }

  /**
   * Project Observation Create
   *
   * Add an observation to a project
   * @requires Authentication
   */
  async project_observation_create(data: Types.PostProjectObservation): Promise<ApiResponse<any>> {
    return this.http.post(`/project_observations`, data);
  }
}