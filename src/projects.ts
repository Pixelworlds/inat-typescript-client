import type { ApiResponse, HttpClient } from './types';
import type * as Types from './types/swagger-types';

export interface ProjectSearchParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q?: string;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be associated with this place */
  place_id?: string[];

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius). Defaults to 500km
 */
  radius?: string;

  /** Must be marked featured for the relevant site */
  featured?: 'true';

  /** Must be marked noteworthy for the relevant site */
  noteworthy?: 'true';

  /** Site ID that applies to `featured` and `noteworthy`. Defaults to the site
of the authenticated user, or to the main iNaturalist site
https://www.inaturalist.org
 */
  site_id?: number;

  /** Return more information about project rules, for example return a full
taxon object instead of simply an ID
 */
  rule_details?: 'true';

  /** Projects must be of this type */
  type?: string[];

  /** Project must have member with this user ID */
  member_id?: number;

  /** Must have search parameter requirements */
  has_params?: boolean;

  /** Must have posts */
  has_posts?: boolean;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;

  /** Sort field */
  order_by?: 'recent_posts' | 'created' | 'updated' | 'distance' | 'featured';
}

export interface ProjectDetailsParams {
  /** Return more information about project rules, for example return a full
taxon object instead of simply an ID
 */
  rule_details?: 'true';
}

export interface ProjectMembersParams {
  /** Membership role */
  role?: 'curator' | 'manager';

  /** If counts are not needed, consider setting this to true to save on
processing time, resulting in faster responses
 */
  skip_counts?: boolean;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export interface ProjectAutocompleteParams {
  /** Search by name (must start with this value) or by ID (exact match). */
  q: string;

  /** Must have this ID */
  id?: string[];

  /** Must not have this ID */
  not_id?: string[];

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lat?: string;

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius)
 */
  lng?: string;

  /** Must be associated with this place */
  place_id?: string[];

  /** Must be within a {`radius`} kilometer circle around this lat/lng
(*lat, *lng, radius). Defaults to 500km
 */
  radius?: string;

  /** Must be marked featured for the relevant site */
  featured?: 'true';

  /** Must be marked noteworthy for the relevant site */
  noteworthy?: 'true';

  /** Site ID that applies to `featured` and `noteworthy`. Defaults to the site
of the authenticated user, or to the main iNaturalist site
https://www.inaturalist.org
 */
  site_id?: number;

  /** Return more information about project rules, for example return a full
taxon object instead of simply an ID
 */
  rule_details?: 'true';

  /** Projects must be of this type */
  type?: string[];

  /** Project must have member with this user ID */
  member_id?: number;

  /** Must have search parameter requirements */
  has_params?: boolean;

  /** Must have posts */
  has_posts?: boolean;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export class Projects {
  constructor(private http: HttpClient) {}

  /**
   * Project Search
   *
   * Given zero to many of following parameters, returns projects
   * matching the search criteria
   *
   */
  async project_search(params?: ProjectSearchParams): Promise<ApiResponse<Types.ProjectsResponse>> {
    return this.http.get(`/projects`, { params });
  }

  /**
   * Project Details
   *
   * Given an ID, or an array of IDs in comma-delimited format, returns
   * corresponding projects. A maximum of 100 results will be returned
   *
   */
  async project_details(id: string[], params?: ProjectDetailsParams): Promise<ApiResponse<Types.ProjectsResponse>> {
    return this.http.get(`/projects/${id}`, { params });
  }

  /**
   * Projects Join
   *
   * Join a project
   *
   * @requires Authentication
   */
  async projects_join(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/projects/${id}/join`);
  }

  /**
   * Projects Leave
   *
   * Leave a project
   *
   * @requires Authentication
   */
  async projects_leave(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/projects/${id}/leave`);
  }

  /**
   * Project Members
   *
   * Given an ID, return members of the project
   *
   */
  async project_members(id: number, params?: ProjectMembersParams): Promise<ApiResponse<Types.ProjectMembersResponse>> {
    return this.http.get(`/projects/${id}/members`, { params });
  }

  /**
   * Membership of current user
   *
   * Given an ID, or an array of IDs in comma-delimited format, return the details of the
   * authenticated user's membership in these projects
   *
   * @requires Authentication
   */
  async membership_of_current_user(id: number[]): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}/membership`);
  }

  /**
   * Project Subscriptions
   *
   * [Deprecated] Subscriptions to projects are managed through joining and
   * leaving projects, so this will not return any useful information.
   *
   * Given an ID, return subscription of the current user
   *
   * @requires Authentication
   */
  async project_subscriptions(id: number): Promise<ApiResponse<any>> {
    return this.http.get(`/projects/${id}/subscriptions`);
  }

  /**
   * Project Add
   *
   * Add an observation to a project
   * @requires Authentication
   */
  async project_add(id: number, data: Types.PostProjectAdd): Promise<ApiResponse<any>> {
    return this.http.post(`/projects/${id}/add`, data);
  }

  /**
   * Project Remove
   *
   * Remove an observation from a project
   * @requires Authentication
   */
  async project_remove(id: number, data: Types.PostProjectAdd): Promise<ApiResponse<any>> {
    return this.http.delete(`/projects/${id}/remove`);
  }

  /**
   * Project Autocomplete
   *
   * Given an string, returns projects with titles starting with the search term
   *
   */
  async project_autocomplete(params: ProjectAutocompleteParams): Promise<ApiResponse<Types.ProjectsResponse>> {
    return this.http.get(`/projects/autocomplete`, { params });
  }

  /**
   * Project Subscribe
   *
   * Toggles current user's subscription to this project. If the logged-in
   * user is not subscribed, POSTing here will subscribe them. If they are already
   * subscribed, this will remove the subscription
   *
   * @requires Authentication
   */
  async project_subscribe(id: number): Promise<ApiResponse<any>> {
    return this.http.post(`/subscriptions/project/${id}/subscribe`);
  }
}
