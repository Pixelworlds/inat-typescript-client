import type { AxiosInstance, AxiosResponse } from 'axios';

export class Identifications {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Search identifications with various filters
   */
  async get_identifications(): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications`, {});
  }

  /**
   * Retrieve identification details
   */
  async get_identifications_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications/${id}`, {});
  }

  async delete_identifications_id(id: string | number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/identifications/${id}`, {});
  }

  /**
   * Get identification categories
   */
  async get_identifications_categories(): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications/categories`, {});
  }

  /**
   * Get species counts for identifications
   */
  async get_identifications_species_counts(): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications/species_counts`, {});
  }

  /**
   * Get identification identifiers
   */
  async get_identifications_identifiers(): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications/identifiers`, {});
  }

  /**
   * Get identification observers
   */
  async get_identifications_observers(): Promise<AxiosResponse<any>> {
    return this.client.get(`/identifications/observers`, {});
  }

  async post_identifications(data?: any): Promise<AxiosResponse<any>> {
    return this.client.post(`/identifications`, { data });
  }

  async put_identifications_id(id: string | number, data?: any): Promise<AxiosResponse<any>> {
    return this.client.put(`/identifications/${id}`, { data });
  }
}
