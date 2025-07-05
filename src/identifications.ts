import type { HttpClient, ApiResponse } from './types';

export class Identifications {
  constructor(private http: HttpClient) {}

  /**
   * Search identifications with various filters
   */
  async get_identifications(): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications`, {});
  }

  /**
   * Retrieve identification details
   */
  async get_identifications_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/${id}`, {});
  }

  async delete_identifications_id(id: string | number): Promise<ApiResponse<any>> {
    return this.http.delete(`/identifications/${id}`, {});
  }

  /**
   * Get identification categories
   */
  async get_identifications_categories(): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/categories`, {});
  }

  /**
   * Get species counts for identifications
   */
  async get_identifications_species_counts(): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/species_counts`, {});
  }

  /**
   * Get identification identifiers
   */
  async get_identifications_identifiers(): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/identifiers`, {});
  }

  /**
   * Get identification observers
   */
  async get_identifications_observers(): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/observers`, {});
  }

  async post_identifications(data?: any): Promise<ApiResponse<any>> {
    return this.http.post(`/identifications`, { data });
  }

  async put_identifications_id(id: string | number, data?: any): Promise<ApiResponse<any>> {
    return this.http.put(`/identifications/${id}`, { data });
  }
}
