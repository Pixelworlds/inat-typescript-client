import type { HttpClient, ApiResponse } from './types';

export class ObservationFields {
  constructor(private http: HttpClient) {}

  /**
   * List / search observation fields. ObservationFields are basically
      typed data fields that users can attach to observation.
   */
  async get_observation_fields(): Promise<ApiResponse<any>> {
    return this.http.get(`/observation_fields`, {});
  }
}
