import type { HttpClient, ApiResponse } from './types';

interface Get_projects_idiframetrueParams {
  iframe?: string;
}

export class Projects {
  constructor(private http: HttpClient) {}

  async delete_projects_id_leave(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/projects/${id}/leave`, {});
  }

  async get_projects(): Promise<ApiResponse<any>> {
    return this.http.get(`/projects`, {});
  }

  async get_projects_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}`, {});
  }

  async get_projects_idiframetrue(
    id: string | number,
    params?: Get_projects_idiframetrueParams
  ): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}`, { params });
  }

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
