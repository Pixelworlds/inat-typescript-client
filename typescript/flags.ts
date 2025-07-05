import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export class Flags {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Flag Create
   *
   * Create a flag. To create a custom flag beyond the standard `spam` and
   * `inappropriate` flags, set `flag` to `other` and include a `flag_explanation`
   * 
   * @requires Authentication
   */
  async flag_create(data: Types.PostFlag): Promise<AxiosResponse<any>> {
    return this.client.post(`/flags`, data);
  }

  /**
   * Flag Update
   *
   * Update a flag. Generally only used to resolve the flag.
   * 
   * @requires Authentication
   */
  async flag_update(id: number, data: Types.PutFlag): Promise<AxiosResponse<any>> {
    return this.client.put(`/flags/${id}`, data);
  }

  /**
   * Flag Delete
   *
   * Delete a flag
   * 
   * @requires Authentication
   */
  async flag_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/flags/${id}`);
  }
}