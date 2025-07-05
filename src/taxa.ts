import type { HttpClient, ApiResponse } from './types';
import type * as Types from './types/swagger-types';

export interface TaxonDetailsParams {
  /** Taxon must have this rank level. Some example values are 70 (kingdom),
60 (phylum), 50 (class), 40 (order), 30 (family), 20 (genus),
10 (species), 5 (subspecies)
 */
  rank_level?: string;
}

export interface TaxonSearchParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q?: string;

  /** Taxon is `active` */
  is_active?: boolean;

  /** Only show taxa with this ID, or its descendants */
  taxon_id?: string[];

  /** Taxon's parent must have this ID */
  parent_id?: number;

  /** Taxon must have this rank */
  rank?: string[];

  /** Taxon must have this rank level. Some example values are 70 (kingdom),
60 (phylum), 50 (class), 40 (order), 30 (family), 20 (genus),
10 (species), 5 (subspecies)
 */
  rank_level?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

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

  /** Return only the record IDs */
  only_id?: boolean;

  /** Include all taxon names in the response */
  all_names?: boolean;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'id' | 'created_at' | 'observations_count';
}

export interface TaxonAutocompleteParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q: string;

  /** Taxon is `active` */
  is_active?: boolean;

  /** Only show taxa with this ID, or its descendants */
  taxon_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Taxon must have this rank level. Some example values are 70 (kingdom),
60 (phylum), 50 (class), 40 (order), 30 (family), 20 (genus),
10 (species), 5 (subspecies)
 */
  rank_level?: string;

  /** Number of results to return in a `page`. The maximum value is 30 for this endpoint */
  per_page?: string;

  /** Locale preference for taxon common names
 */
  locale?: string;

  /** Place preference for regional taxon common names
 */
  preferred_place_id?: number;

  /** Include all taxon names in the response */
  all_names?: boolean;
}

export class Taxa {
  constructor(private http: HttpClient) {}

  /**
   * Taxon Details
   *
   * Given an ID, or an array of IDs in comma-delimited format, returns
   * corresponding taxa. A maximum of 30 results will be returned
   * 
   */
  async taxon_details(id: number[], params?: TaxonDetailsParams): Promise<ApiResponse<Types.TaxaShowResponse>> {
    return this.http.get(`/taxa/${id}`, { params });
  }

  /**
   * Taxon Search
   *
   * Given zero to many of following parameters, returns taxa matching the search criteria
   * 
   */
  async taxon_search(params?: TaxonSearchParams): Promise<ApiResponse<Types.TaxaShowResponse>> {
    return this.http.get(`/taxa`, { params });
  }

  /**
   * Taxon Autocomplete
   *
   * Given an string, returns taxa with names starting with the search term
   * 
   */
  async taxon_autocomplete(params: TaxonAutocompleteParams): Promise<ApiResponse<Types.TaxaAutocompleteResponse>> {
    return this.http.get(`/taxa/autocomplete`, { params });
  }
}