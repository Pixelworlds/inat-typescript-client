import type { AxiosInstance, AxiosResponse } from 'axios';

export interface SiteSearchParams {
  /** Search object properties */
  q?: string;

  /** Must be of this type */
  sources?: string[];

  /** Must be associated with this place */
  place_id?: string[];

  /** Include taxon ancestors in the response */
  include_taxon_ancestors?: boolean;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Locale preference for taxon common names
 */
  locale?: string;

  /** Place preference for regional taxon common names
 */
  preferred_place_id?: number;
}

export class Search {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Site Search
   *
   * Given zero to many of following parameters, returns object matching the search criteria
   * 
   */
  async site_search(params?: SiteSearchParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/search`, { params });
  }
}