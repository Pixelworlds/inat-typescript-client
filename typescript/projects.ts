import type { AxiosInstance, AxiosResponse } from 'axios';

interface Get_projects_idiframetrueParams {
  iframe?: string;
}

export class Projects {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_projects_id_leave(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/projects/${id}/leave`, {});
  }

  async get_projects(): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects`, {});
  }

  async get_projects_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}`, {});
  }

  async get_projects_idiframetrue(
    id: string | number,
    params?: Get_projects_idiframetrueParams
  ): Promise<AxiosResponse<any>> {
    return this.client.get(`/projects/${id}`, { params });
  }

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
