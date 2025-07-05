import { INaturalistHttpClient } from './http-client';
import type { INaturalistConfig, HttpClient } from './types';

import { Comments } from './comments';
import { ObservationFieldValues } from './observation-field-values';
import { Annotations } from './annotations';
import { ObservationFields } from './observation-fields';
import { Projects } from './projects';
import { Search } from './search';
import { Authentication } from './authentication';
import { Taxa } from './taxa';
import { Identifications } from './identifications';
import { ProjectObservations } from './project-observations';
import { ControlledTerms } from './controlled-terms';
import { Observations } from './observations';
import { Flags } from './flags';
import { Places } from './places';
import { ObservationPhotos } from './observation-photos';
import { Users } from './users';

export type { INaturalistConfig, RequestConfig, ApiResponse } from './types';

export {
  Comments,
  ObservationFieldValues,
  Annotations,
  ObservationFields,
  Projects,
  Search,
  Authentication,
  Taxa,
  Identifications,
  ProjectObservations,
  ControlledTerms,
  Observations,
  Flags,
  Places,
  ObservationPhotos,
  Users
};

export class INaturalistClient {
  private http: HttpClient;

  public readonly comments: Comments;
  public readonly observation_field_values: ObservationFieldValues;
  public readonly annotations: Annotations;
  public readonly observation_fields: ObservationFields;
  public readonly projects: Projects;
  public readonly search: Search;
  public readonly authentication: Authentication;
  public readonly taxa: Taxa;
  public readonly identifications: Identifications;
  public readonly project_observations: ProjectObservations;
  public readonly controlled_terms: ControlledTerms;
  public readonly observations: Observations;
  public readonly flags: Flags;
  public readonly places: Places;
  public readonly observation_photos: ObservationPhotos;
  public readonly users: Users;

  constructor(baseURL?: string, apiToken?: string);
  constructor(config?: INaturalistConfig);
  constructor(configOrBaseURL?: string | INaturalistConfig, apiToken?: string) {
    let config: INaturalistConfig;
    
    if (typeof configOrBaseURL === 'string') {
      config = {
        baseURL: configOrBaseURL,
        apiToken: apiToken
      };
    } else {
      config = configOrBaseURL || {};
    }

    this.http = new INaturalistHttpClient(config);

    this.comments = new Comments(this.http);
    this.observation_field_values = new ObservationFieldValues(this.http);
    this.annotations = new Annotations(this.http);
    this.observation_fields = new ObservationFields(this.http);
    this.projects = new Projects(this.http);
    this.search = new Search(this.http);
    this.authentication = new Authentication(this.http);
    this.taxa = new Taxa(this.http);
    this.identifications = new Identifications(this.http);
    this.project_observations = new ProjectObservations(this.http);
    this.controlled_terms = new ControlledTerms(this.http);
    this.observations = new Observations(this.http);
    this.flags = new Flags(this.http);
    this.places = new Places(this.http);
    this.observation_photos = new ObservationPhotos(this.http);
    this.users = new Users(this.http);
  }

  setApiToken(token: string): void {
    (this.http as INaturalistHttpClient).setApiToken(token);
  }

  removeApiToken(): void {
    (this.http as INaturalistHttpClient).removeApiToken();
  }
}

export default INaturalistClient;
