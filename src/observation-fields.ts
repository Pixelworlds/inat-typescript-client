import type { HttpClient, ApiResponse } from './types';

export class ObservationFields {
  constructor(private http: HttpClient) {}

  async get_observationfields(): Promise<ApiResponse<any>> {
    return this.http.get(`/observation_fields`, {});
  }
}
