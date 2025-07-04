import type { AxiosInstance, AxiosResponse } from 'axios';

export class Comments {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async delete_comments_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/comments/${id}`, {});
  }

  async post_comments(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/comments`, { data });
  }

  async put_comments_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/comments/${id}`, { data });
  }
}
