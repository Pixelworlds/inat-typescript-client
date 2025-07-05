import type { HttpClient, ApiResponse } from './types';

export class Projects {
  constructor(private http: HttpClient) {}

  async delete_projects_id_leave(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/projects/${id}/leave`, {});
  }

  /**
   * Retrieve information about projects on iNaturalist.
   */
  async get_projects(): Promise<ApiResponse<any>> {
    return this.http.get(`/projects`, {});
  }

  /**
   * Retrieve information about a single project.  :id is the project ID or slug.
   */
  async get_projects_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}`, {});
  }

  /**
   * This returns a complete web page without header or footer suitable for use in an IFRAME.
   */
  async get_projects_idiframetrue(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}?iframe=true`, {});
  }

  /**
   * JS widget snippet of the top contributors to a project.
   */
  async get_projects_id_contributorswidget(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}/contributors.widget`, {});
  }

  async get_projects_id_members(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}/members`, {});
  }

  async get_projects_user_login(login: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/user/${login}`, {});
  }

  async post_projects_id_join(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/projects/${id}/join`, { data });
  }
}
