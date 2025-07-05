import type { HttpClient, ApiResponse } from './types';
import type * as Types from './types/swagger-types';

export interface ObservationSearchParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'geo_score' | 'id' | 'observed_on' | 'random' | 'species_guess' | 'updated_at' | 'votes';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface ObservationsDeletedParams {
  /** Deleted at or after this time */
  since: string;
}

export interface ObservationHistogramParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;

  /** Histogram basis: when the observation was created or observed
   */
  date_field?: 'created' | 'observed';

  /** Time interval for histogram, with groups starting on or contained within
the group value. The year, month, week, day, and hour options will set
default values for `d1` or `created_d1` depending on the value of
`date_field`, to limit the number of groups returned. You can override
those values if you want data from a longer or shorter time span. The
`hour` interval only works with `date_field=created`, and this you
should filter dates with `created_d[1,2]`
 */
  interval?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'month_of_year' | 'week_of_year';
}

export interface ObservationIdentifiersParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export interface ObservationObserversParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export interface ObservationPopularFieldValuesParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;
}

export interface ObservationSpeciesCountsParams {
  /** Whether or not positional accuracy / coordinate uncertainty has been specified */
  acc?: boolean;

  /** Captive or cultivated observations */
  captive?: boolean;

  /** Observations whose taxa are endemic to their location */
  endemic?: boolean;

  /** Observations that are georeferenced */
  geo?: boolean;

  /** Observations with the deprecated `ID, Please!` flag. Note that this will return observations, but that this attribute is no longer used. */
  id_please?: boolean;

  /** Observations that have community identifications */
  identified?: boolean;

  /** Observations whose taxa are introduced in their location
   */
  introduced?: boolean;

  /** Observations that show on map tiles */
  mappable?: boolean;

  /** Observations whose taxa are native to their location */
  native?: boolean;

  /** Observations whose taxa are outside their known ranges */
  out_of_range?: boolean;

  /** Observations identified by the curator of a project. If
the `project_id` parameter is also specified, this will only consider
observations identified by curators of the specified project(s)
 */
  pcid?: boolean;

  /** Observations with photos */
  photos?: boolean;

  /** Observations that have been favorited by at least one user
   */
  popular?: boolean;

  /** Observations with sounds */
  sounds?: boolean;

  /** Observations of active taxon concepts
   */
  taxon_is_active?: boolean;

  /** Observations whose taxa are threatened in their location
   */
  threatened?: boolean;

  /** Observations with a `quality_grade` of either `needs_id` or
`research`. Equivalent to `quality_grade=needs_id,research`
 */
  verifiable?: boolean;

  /** License attribute of an observation must not be null */
  licensed?: boolean;

  /** License attribute of at least one photo of an observation must not be null */
  photo_licensed?: boolean;

  /** Observation taxon is expected nearby */
  expected_nearby?: boolean;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Observation must have this license */
  license?: string[];

  /** Must have an observation field value with this datatype */
  ofv_datatype?: string[];

  /** Must have at least one photo with this license */
  photo_license?: string[];

  /** Must be observed within the place with this ID */
  place_id?: number[];

  /** Must be added to the project this ID or slug */
  project_id?: string[];

  /** Taxon must have this rank */
  rank?: string[];

  /** Must be affiliated with the iNaturalist network website with this ID
   */
  site_id?: string[];

  /** Must have at least one sound with this license */
  sound_license?: string[];

  /** Only show observations of these taxa and their descendants */
  taxon_id?: string[];

  /** Exclude observations of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Taxon must have a scientific or common name matching this string
   */
  taxon_name?: string[];

  /** User must have this ID or login */
  user_id?: string[];

  /** User must have this login */
  user_login?: string[];

  /** Observations identified by a particular user */
  ident_user_id?: number;

  /** Must be observed within this hour of the day */
  hour?: string[];

  /** Must be observed within this day of the month */
  day?: string[];

  /** Must be observed within this month */
  month?: string[];

  /** Must be observed within this year */
  year?: string[];

  /** Must be created within this day of the month */
  created_day?: string[];

  /** Must be created within this month */
  created_month?: string[];

  /** Must be created within this year */
  created_year?: string[];

  /** Must have an annotation using this controlled term ID */
  term_id?: number[];

  /** Must have an annotation using this controlled value ID. Must be combined
with the `term_id` parameter
 */
  term_value_id?: number[];

  /** Exclude observations with annotations using this controlled value ID.
   */
  without_term_id?: number;

  /** Exclude observations with annotations using this controlled value ID.
Must be combined with the `term_id` parameter
 */
  without_term_value_id?: number[];

  /** Must be combined with the `term_value_id` or the `without_term_value_id` parameter.
Must have an annotation using this controlled term ID and associated term value IDs
or be missing this annotation.
 */
  term_id_or_unknown?: number[];

  /** Must have an annotation created by this user
   */
  annotation_user_id?: string[];

  /** Must have a positional accuracy above this value (meters) */
  acc_above?: string;

  /** Must have a positional accuracy below this value (meters) */
  acc_below?: string;

  /** Positional accuracy must be below this value (in meters) or be unknown */
  acc_below_or_unknown?: string;

  /** Must be observed on or after this date */
  d1?: string;

  /** Must be observed on or before this date */
  d2?: string;

  /** Must be created at or after this time */
  created_d1?: string;

  /** Must be created at or before this time */
  created_d2?: string;

  /** Must be created on this date */
  created_on?: string;

  /** Must be observed on this date */
  observed_on?: string;

  /** Must not be of a taxon previously observed by this user */
  unobserved_by_user_id?: number;

  /** Must match the rules of the project with this ID or slug */
  apply_project_rules_for?: string;

  /** Taxon must have this conservation status code. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  cs?: string;

  /** Taxon must have a conservation status from this authority. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csa?: string;

  /** Taxon must have this IUCN conservation status. If
the `place_id` parameter is also specified, this will only consider
statuses specific to that place
 */
  csi?: string[];

  /** Must have this geoprivacy setting */
  geoprivacy?: string[];

  /** Filter observations by the most conservative geoprivacy applied by a
conservation status associated with one of the taxa proposed in the
current identifications.
 */
  taxon_geoprivacy?: string[];

  /** Must have `geoprivacy` or `taxon_geoprivacy` fields matching these values
   */
  obscuration?: string[];

  /** Taxon must have this rank or lower */
  hrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must have this rank or higher */
  lrank?:
    | 'kingdom'
    | 'phylum'
    | 'subphylum'
    | 'superclass'
    | 'class'
    | 'subclass'
    | 'superorder'
    | 'order'
    | 'suborder'
    | 'infraorder'
    | 'superfamily'
    | 'epifamily'
    | 'family'
    | 'subfamily'
    | 'supertribe'
    | 'tribe'
    | 'subtribe'
    | 'genus'
    | 'genushybrid'
    | 'species'
    | 'hybrid'
    | 'subspecies'
    | 'variety'
    | 'form';

  /** Taxon must by within this iconic taxon */
  iconic_taxa?: string[];

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Identifications must meet these criteria */
  identifications?: 'most_agree' | 'most_disagree' | 'some_agree';

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  radius?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  nelng?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlat?: string;

  /** Must be within this bounding box (*nelat, *nelng, *swlat, *swlng)
   */
  swlng?: string;

  /** Taxon must be in the list with this ID */
  list_id?: number;

  /** Must not be in the project with this ID or slug */
  not_in_project?: string;

  /** Must not match the rules of the project with this ID or slug */
  not_matching_project_rules_for?: string;

  /** Must included in this observation accuracy experiment */
  observation_accuracy_experiment_id?: number[];

  /** Search observation properties. Can be combined with `search_on` */
  q?: string;

  /** Properties to search on, when combined with `q`.
Searches across all properties by default
 */
  search_on?: 'names' | 'tags' | 'description' | 'place';

  /** Must have this quality grade */
  quality_grade?: 'casual' | 'needs_id' | 'research';

  /** Must be updated since this time */
  updated_since?: string;

  /** See `reviewed` */
  viewer_id?: string;

  /** Observations have been reviewed by the user with ID equal to
the value of the `viewer_id` parameter
 */
  reviewed?: boolean;

  /** Locale preference for taxon common names
   */
  locale?: string;

  /** Place preference for regional taxon common names
   */
  preferred_place_id?: number;

  /** Set the `Cache-Control` HTTP header with this value as `max-age`, in
seconds. This means subsequent identical requests will be cached on
iNaturalist servers, and commonly within web browsers
 */
  ttl?: string;

  /** Include taxon ancestors in the response */
  include_ancestors?: boolean;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is 500
   */
  per_page?: string;
}

export interface ObservationUserUpdatesParams {
  /** Must be created at or after this time */
  created_after?: string;

  /** Notification has been viewed by the user before */
  viewed?: boolean;

  /** Only show updates on observations owned by the currently authenticated
user or on observations the authenticated user is following but does not
own.
 */
  observations_by?: 'owner' | 'following';

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export class Observations {
  constructor(private http: HttpClient) {}

  /**
   * Observation Details
   *
   * Given an ID, or an array of IDs in comma-delimited format, returns
   * corresponding observations. A maximum of 200 results will be returned
   *
   */
  async observation_details(id: number[]): Promise<ApiResponse<Types.ObservationsShowResponse>> {
    return this.http.get(`/observations/${id}`);
  }

  /**
   * Observation Update
   *
   * Update an observation
   *
   * @requires Authentication
   */
  async observation_update(id: number, data: Types.PostObservation): Promise<ApiResponse<any>> {
    return this.http.put(`/observations/${id}`, data);
  }

  /**
   * Observation Delete
   *
   * Delete an observation
   *
   * @requires Authentication
   */
  async observation_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}`);
  }

  /**
   * Observations Fave
   *
   * Fave an observation
   *
   * @requires Authentication
   */
  async observations_fave(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/observations/${id}/fave`);
  }

  /**
   * Observations Unfave
   *
   * Unfave an observation
   *
   * @requires Authentication
   */
  async observations_unfave(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}/unfave`);
  }

  /**
   * Observations Review
   *
   * Review an observation
   *
   * @requires Authentication
   */
  async observations_review(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/observations/${id}/review`);
  }

  /**
   * Observations Unreview
   *
   * Unreview an observation
   *
   * @requires Authentication
   */
  async observations_unreview(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}/review`);
  }

  /**
   * Observation Subscriptions
   *
   * Fetches any subscriptions the current user has to this observation
   * or the observer
   *
   * @requires Authentication
   */
  async observation_subscriptions(id: number): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/${id}/subscriptions`);
  }

  /**
   * Quality Metric Set
   *
   * Set the value of a quality metric
   *
   * @requires Authentication
   */
  async quality_metric_set(
    id: number,
    metric: 'date' | 'location' | 'wild',
    data: Types.PostQuality
  ): Promise<ApiResponse<any>> {
    return this.http.post(`/observations/${id}/quality/${metric}`, data);
  }

  /**
   * Quality Metric Delete
   *
   * Delete a quality metric
   *
   * @requires Authentication
   */
  async quality_metric_delete(id: number, metric: 'date' | 'location' | 'wild'): Promise<ApiResponse<any>> {
    return this.http.delete(`/observations/${id}/quality/${metric}`);
  }

  /**
   * Observation Taxon Summary
   *
   * Fetches information about this observation's taxon, within the context
   * of this observation's location
   *
   */
  async observation_taxon_summary(id: number): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/${id}/taxon_summary`);
  }

  /**
   * Observation Subscribe
   *
   * Toggles current user's subscription to this observation. If the logged-in
   * user is not subscribed, POSTing here will subscribe them. If they are already
   * subscribed, this will remove the subscription
   *
   * @requires Authentication
   */
  async observation_subscribe(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/subscriptions/observation/${id}/subscribe`);
  }

  /**
   * Observation Vote
   *
   * Vote on an observation. A vote with an empty `scope` is recorded as a
   * `fave` of the observation. A vote with scope `needs_id` is recorded as a
   * vote on the Quality Grade criterion "can the Community ID still be
   * confirmed or improved?", and can be an up or down vote
   *
   * @requires Authentication
   */
  async observation_vote(id: number, data: Types.PostObservationVote): Promise<ApiResponse<any>> {
    return this.http.post(`/votes/vote/observation/${id}`, data);
  }

  /**
   * Observation Unvote
   *
   * Remove a vote from an observation
   * @requires Authentication
   */
  async observation_unvote(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/votes/unvote/observation/${id}`);
  }

  /**
   * Observation Search
   *
   * Given zero to many of following parameters, returns observations
   * matching the search criteria. The large size of the observations index
   * prevents us from supporting the `page` parameter when retrieving records
   * from large result sets. If you need to retrieve large numbers of
   * records, use the `per_page` and `id_above` or `id_below` parameters
   * instead.
   *
   */
  async observation_search(params?: ObservationSearchParams): Promise<ApiResponse<Types.ObservationsResponse>> {
    return this.http.get(`/observations`, { params });
  }

  /**
   * Observation Create
   *
   * Create an observation
   *
   * @requires Authentication
   */
  async observation_create(data: Types.PostObservation): Promise<ApiResponse<any>> {
    return this.http.post(`/observations`, data);
  }

  /**
   * Observations Deleted
   *
   * Given a starting date, return an array of IDs of the authenticated
   * user's observations that have been deleted since that date. Requires
   * authentication
   *
   * @requires Authentication
   */
  async observations_deleted(params: ObservationsDeletedParams): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/deleted`, { params });
  }

  /**
   * Observation Histogram
   *
   * Given zero to many of following parameters, returns histogram data about
   * observations matching the search criteria
   *
   */
  async observation_histogram(params?: ObservationHistogramParams): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/histogram`, { params });
  }

  /**
   * Observation Identifiers
   *
   * Given zero to many of following parameters, returns identifiers of
   * observations matching the search criteria and the count of
   * observations they have identified, ordered by count descending. A
   * maximum of 500 results will be returned
   *
   */
  async observation_identifiers(
    params?: ObservationIdentifiersParams
  ): Promise<ApiResponse<Types.UserCountsResponse>> {
    return this.http.get(`/observations/identifiers`, { params });
  }

  /**
   * Observation Observers
   *
   * Given zero to many of following parameters, returns observers of
   * observations matching the search criteria and the count of
   * observations and distinct taxa of rank `species` they have observed. A
   * maximum of 500 results will be returned
   *
   */
  async observation_observers(
    params?: ObservationObserversParams
  ): Promise<ApiResponse<Types.ObservationsObserversResponse>> {
    return this.http.get(`/observations/observers`, { params });
  }

  /**
   * Observation Popular Field Values
   *
   * Given zero to many of following parameters, returns an array of
   * relevant controlled terms values and a monthly histogram
   *
   */
  async observation_popular_field_values(params?: ObservationPopularFieldValuesParams): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/popular_field_values`, { params });
  }

  /**
   * Observation Species Counts
   *
   * Given zero to many of following parameters, returns `leaf taxa`
   * associated with observations matching the search criteria and the count of
   * observations they are associated with, ordered by count descending.
   * `Leaf taxa` are the leaves of the taxonomic tree containing only the
   * taxa associated with observations matching the search criteria.
   *
   */
  async observation_species_counts(
    params?: ObservationSpeciesCountsParams
  ): Promise<ApiResponse<Types.SpeciesCountsResponse>> {
    return this.http.get(`/observations/species_counts`, { params });
  }

  /**
   * Observation User Updates
   *
   * Given zero to many of following parameters, returns an array of objects
   * representing new comments and identifications on observations the authenticated
   * user has subscribed to. Requires authentication
   *
   * @requires Authentication
   */
  async observation_user_updates(params?: ObservationUserUpdatesParams): Promise<ApiResponse<any>> {
    return this.http.get(`/observations/updates`, { params });
  }

  /**
   * Observation Field Value Update
   *
   * Mark all updates associated with this observation as viewed by logged-in user
   *
   * @requires Authentication
   */
  async observation_field_value_update(id: number): Promise<ApiResponse<any>> {
    return this.http.put(`/observations/${id}/viewed_updates`);
  }
}
