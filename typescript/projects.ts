import type { AxiosInstance, AxiosResponse } from 'axios';

export class Projects {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_projects_id_leave(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/projects/${id}/leave`, {});
  }

  /**
   * Retrieve information about projects on iNaturalist.
   */
  async get_projects(): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects`, {});
  }

  /**
   * Retrieve information about a single project.  :id is the project ID or slug.
   */
  async get_projects_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}`, {});
  }

  /**
   * This returns a complete web page without header or footer suitable for use in an IFRAME.
   */
  async get_projects_idiframetrue(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}?iframe=true`, {});
  }

  /**
   * JS widget snippet of the top contributors to a project.
   */
  async get_projects_id_contributorswidget(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}/contributors.widget`, {});
  }

  async get_projects_id_members(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}/members`, {});
  }

  async get_projects_user_login(login: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/user/${login}`, {});
  }

  async post_projects_id_join(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/projects/${id}/join`, { data });
  }
}
