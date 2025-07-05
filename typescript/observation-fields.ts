import type { AxiosInstance, AxiosResponse } from 'axios';



export class ObservationFields {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get_observationfields(): Promise<AxiosResponse<any>> {
    return this.client.get(`/observation_fields`, {});
  }
}