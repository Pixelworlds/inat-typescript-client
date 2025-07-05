import type { AxiosInstance, AxiosResponse } from 'axios';

export interface PlaceTilesParams {
  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export interface TaxonPlaceTilesParams {
  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export interface TaxonRangeTilesParams {
  /** Primary color to use in tile creation. Accepts common colors by string
(e.g. `color=blue`), and accepts escaped color HEX codes
(e.g. `color=%2386a91c`)
 */
  color?: string;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export class PolygonTiles {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Place Tiles
   *
   * Returns a PNG map tile representing the boundary of this place,
   * following the XYZ tiling scheme
   * 
   */
  async place_tiles(place_id: number, zoom: number, x: number, y: number, params?: PlaceTilesParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/places/${place_id}/${zoom}/${x}/${y}.png`, { params });
  }

  /**
   * Taxon Place Tiles
   *
   * Returns a PNG map tile representing the boundaries of places this taxon
   * is known to occur, following the XYZ tiling scheme
   * 
   */
  async taxon_place_tiles(taxon_id: number, zoom: number, x: number, y: number, params?: TaxonPlaceTilesParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/taxon_places/${taxon_id}/${zoom}/${x}/${y}.png`, { params });
  }

  /**
   * Taxon Range Tiles
   *
   * Returns a PNG map tile representing the range of this taxon, following
   * the XYZ tiling scheme
   * 
   */
  async taxon_range_tiles(taxon_id: number, zoom: number, x: number, y: number, params?: TaxonRangeTilesParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/taxon_ranges/${taxon_id}/${zoom}/${x}/${y}.png`, { params });
  }
}