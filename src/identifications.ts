import type { HttpClient, ApiResponse } from './types';
import type * as Types from './types/swagger-types';

export interface IdentificationSearchParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface IdentificationCategoriesParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface IdentificationSpeciesCountsParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;

  /** Source of the taxon for counting */
  taxon_of?: 'identification' | 'observation';
}

export interface IdentificationIdentifiersParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface IdentificationObserversParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface IdentificationRecentTaxaParams {
  /** ID's taxon is the same it's observation's taxon */
  current_taxon?: boolean;

  /** ID was added by the observer */
  own_observation?: boolean;

  /** ID was created as a results of a taxon change */
  is_change?: boolean;

  /** ID's taxon is currently an active taxon */
  taxon_active?: boolean;

  /** Observation's taxon is currently an active taxon */
  observation_taxon_active?: boolean;

  /** Identification ID */
  id?: number[];

  /** ID's taxon must have this rank */
  rank?: string[];

  /** Observation's taxon must have this rank */
  observation_rank?: string[];

  /** Identifier must have this user ID */
  user_id?: number[];

  /** Identifier must have this login */
  user_login?: string[];

  /** Most recent ID on a observation by a user */
  current?: boolean;

  /** Type of identification */
  category?: string[];

  /** Observation must occur in this place */
  place_id?: string[];

  /** Observation must have this quality grade */
  quality_grade?: string[];

  /** Only return identifications that were created as part of the specified taxon change */
  taxon_change_id?: any[];

  /** ID taxa must match the given taxa or their descendants */
  taxon_id?: string[];

  /** Observation taxa must match the given taxa or their descendants */
  observation_taxon_id?: string[];

  /** ID iconic taxon ID */
  iconic_taxon_id?: string[];

  /** Observation iconic taxon ID */
  observation_iconic_taxon_id?: string[];

  /** ID taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** ID taxon must have this rank or lower */
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or higher */
  observation_lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Observation taxon must have this rank or lower */
  observation_hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Exclude IDs of these taxa and their descendants */
  without_taxon_id?: string[];

  /** Exclude IDs of observations of these taxa and their descendants */
  without_observation_taxon_id?: string[];

  /** ID created on or after this time */
  d1?: string;

  /** ID created on or before this time */
  d2?: string;

  /** Observation created on or after this date */
  observation_created_d1?: string;

  /** Observation created on or before this date */
  observation_created_d2?: string;

  /** Observation observed on or after this date */
  observed_d1?: string;

  /** Observation observed on or before this date */
  observed_d2?: string;

  /** Must have an ID above this value */
  id_above?: string;

  /** Must have an ID below this value */
  id_below?: string;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort order */
  order?: 'desc' | 'asc';

  /** Sort field */
  order_by?: 'created_at' | 'id';

  /** Return only the record IDs */
  only_id?: boolean;
}

export interface IdentificationSimilarSpeciesParams {
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
  hrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

  /** Taxon must have this rank or higher */
  lrank?: 'kingdom' | 'phylum' | 'subphylum' | 'superclass' | 'class' | 'subclass' | 'superorder' | 'order' | 'suborder' | 'infraorder' | 'superfamily' | 'epifamily' | 'family' | 'subfamily' | 'supertribe' | 'tribe' | 'subtribe' | 'genus' | 'genushybrid' | 'species' | 'hybrid' | 'subspecies' | 'variety' | 'form';

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

  /** Only show observations of these taxa and their descendants */
  taxon_id: number;
}

export class Identifications {
  constructor(private http: HttpClient) {}

  /**
   * Identification Details
   *
   * Given an ID, or an array of IDs in comma-delimited format, returns
   * corresponding identifications. A maximum of 30 results will be returned
   * 
   */
  async identification_details(id: number[]): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/${id}`);
  }

  /**
   * Identification Update
   *
   * Update an identification. Note that to "withdraw" an observation you
   * send a `PUT` request to this endpoint and set the `current`
   * attribute to false. To "restore" it you do the same but set
   * `current` to `true`. Only one identification by a given user can be
   * `current` for a given observation, so if you "restore" one all the other
   * identifications by the authenticated user for the given observation will
   * be withdrawn.
   * 
   * @requires Authentication
   */
  async identification_update(id: number, data: Types.PostIdentification): Promise<ApiResponse<any>> {
    return this.http.put(`/identifications/${id}`, data);
  }

  /**
   * Identification Delete
   *
   * Delete an identification. See description of `PUT /identifications/{id}
   * for notes on withdrawing and restoring identifications.
   * 
   * @requires Authentication
   */
  async identification_delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/identifications/${id}`);
  }

  /**
   * Identification Create
   *
   * Create an identification
   * @requires Authentication
   */
  async identification_create(data: Types.PostIdentification): Promise<ApiResponse<any>> {
    return this.http.post(`/identifications`, data);
  }

  /**
   * Identification Search
   *
   * Given zero to many of following parameters, returns identifications
   * matching the search criteria
   * 
   */
  async identification_search(params?: IdentificationSearchParams): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications`, { params });
  }

  /**
   * Identification Categories
   *
   * Given zero to many of following parameters, return counts of the
   * categories of identifications matching the search criteria
   * 
   */
  async identification_categories(params?: IdentificationCategoriesParams): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/categories`, { params });
  }

  /**
   * Identification Species Counts
   *
   * Given zero to many of following parameters, returns `leaf taxa`
   * associated with identifications matching the search criteria and the
   * count of identifications they are associated with, ordered by count
   * descending. `Leaf taxa` are the leaves of the taxonomic tree containing
   * only the taxa associated with observations matching the search criteria.
   * 
   */
  async identification_species_counts(params?: IdentificationSpeciesCountsParams): Promise<ApiResponse<Types.SpeciesCountsResponse>> {
    return this.http.get(`/identifications/species_counts`, { params });
  }

  /**
   * Identification Identifiers
   *
   * Given zero to many of following parameters, returns creators of
   * identifications matching the search criteria and the count of
   * matching identifications, ordered by count descending. A
   * maximum of 500 results will be returned
   * 
   */
  async identification_identifiers(params?: IdentificationIdentifiersParams): Promise<ApiResponse<Types.UserCountsResponse>> {
    return this.http.get(`/identifications/identifiers`, { params });
  }

  /**
   * Identification Observers
   *
   * Given zero to many of following parameters, returns creators of
   * observations of identifications matching the search criteria and
   * the count of matching observations, ordered by count descending
   * 
   */
  async identification_observers(params?: IdentificationObserversParams): Promise<ApiResponse<Types.UserCountsResponse>> {
    return this.http.get(`/identifications/observers`, { params });
  }

  /**
   * Identification Recent Taxa
   *
   * Returns an array of objects each containing an identification and a
   * taxon. Returns IDs representing the earliest occurrence of taxa
   * associated with identifications in the filtered set of results
   * 
   */
  async identification_recent_taxa(params?: IdentificationRecentTaxaParams): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/recent_taxa`, { params });
  }

  /**
   * Identification Similar Species
   *
   * Returns species attached to IDs of observations of this taxon, or
   * attached to observations identified as this species, ordered by combined
   * frequency descending. This will only return species in the same iconic
   * taxon, and will never return descendants of the chosen taxon
   * 
   */
  async identification_similar_species(params: IdentificationSimilarSpeciesParams): Promise<ApiResponse<any>> {
    return this.http.get(`/identifications/similar_species`, { params });
  }
}