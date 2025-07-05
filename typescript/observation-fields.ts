import type { AxiosInstance, AxiosResponse } from 'axios';

export class ObservationFields {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * List / search observation fields. ObservationFields are basically
      typed data fields that users can attach to observation.
   */
  async get_observation_fields(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observation_fields`, {});
  }
}
