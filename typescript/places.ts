import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export interface PlaceDetailsParams {
  /** Admin level of a place, or an array of admin levels
in comma-delimited format. Supported admin levels are: -10
(continent), 0 (country), 10 (state), 20 (county), 30 (town),
100 (park) */
  admin_level?: number[];
}

export interface PlaceAutocompleteParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q: string;

  /** Sort field */
  order_by?: 'area';
}

export interface NearbyPlacesParams {
  /** Must be nearby this bounding box (*nelat, *nelng, *swlat, *swlng)
 */
  nelat: string;

  /** Must be nearby this bounding box (*nelat, *nelng, *swlat, *swlng)
 */
  nelng: string;

  /** Must be nearby this bounding box (*nelat, *nelng, *swlat, *swlng)
 */
  swlat: string;

  /** Must be nearby this bounding box (*nelat, *nelng, *swlat, *swlng)
 */
  swlng: string;

  /** Name must match this value */
  name?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export class Places {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Place Details
   *
   * Given an ID, or an array of IDs in comma-delimited format, returns
   * corresponding places. A maximum of 500 results will be returned
   * 
   */
  async place_details(id: string[], params?: PlaceDetailsParams): Promise<AxiosResponse<Types.PlacesResponse>> {
    return this.client.get(`/places/${id}`, { params });
  }

  /**
   * Place Autocomplete
   *
   * Given an string, returns places with names starting with the search
   * term.
   * 
   */
  async place_autocomplete(params: PlaceAutocompleteParams): Promise<AxiosResponse<Types.PlacesResponse>> {
    return this.client.get(`/places/autocomplete`, { params });
  }

  /**
   * Nearby Places
   *
   * Given an bounding box, and an optional name query, return `standard`
   * iNaturalist curator approved and `community` non-curated places nearby
   * 
   */
  async nearby_places(params: NearbyPlacesParams): Promise<AxiosResponse<Types.NearbyPlacesResponse>> {
    return this.client.get(`/places/nearby`, { params });
  }
}