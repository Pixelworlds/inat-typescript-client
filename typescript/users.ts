import type { AxiosInstance, AxiosResponse } from 'axios';

export class Users {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get_users_edit(): Promise<AxiosResponse<any>> {
    return this.client.get(`/users/edit`, {});
  }

  async get_users_newupdates(): Promise<AxiosResponse<any>> {
    return this.client.get(`/users/new_updates`, {});
  }

  async post_users(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/users`, { data });
  }

  async put_users_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/users/${id}`, { data });
  }
}
