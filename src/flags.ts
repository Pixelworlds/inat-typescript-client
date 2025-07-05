import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export class Flags {
  constructor(private http: HttpClient) {}

  /**
   * Flag Create
   *
   * Create a flag. To create a custom flag beyond the standard `spam` and
   * `inappropriate` flags, set `flag` to `other` and include a `flag_explanation`
   * 
   * @requires Authentication
   */
  async flag_create(data: Types.PostFlag): Promise<ApiResponse<any>> {
    return this.http.post(`/flags`, data);
  }

  /**
   * Flag Update
   *
   * Update a flag. Generally only used to resolve the flag.
   * 
   * @requires Authentication
   */
  async flag_update(id: number, data: Types.PutFlag): Promise<ApiResponse<any>> {
    return this.http.put(`/flags/${id}`, data);
  }

  /**
   * Flag Delete
   *
   * Delete a flag
   * 
   * @requires Authentication
   */
  async flag_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/flags/${id}`);
  }
}