import { Annotations } from './annotations';
import { Authentication } from './authentication';
import { Comments } from './comments';
import { ControlledTerms } from './controlled-terms';
import { Flags } from './flags';
import { INaturalistHttpClient } from './http-client';
import { Identifications } from './identifications';
import { Messages } from './messages';
import { OAuth } from './oauth';
import { ObservationFieldValues } from './observation-field-values';
import { ObservationFields } from './observation-fields';
import { ObservationPhotos } from './observation-photos';
import { ObservationTiles } from './observation-tiles';
import { Observations } from './observations';
import { Photos } from './photos';
import { Places } from './places';
import { PolygonTiles } from './polygon-tiles';
import { Posts } from './posts';
import { ProjectObservations } from './project-observations';
import { Projects } from './projects';
import { Search } from './search';
import { Taxa } from './taxa';
import { Users } from './users';
import { UTFGrid } from './utfgrid';

import type { HttpClient, INaturalistConfig } from './types';

export type { ApiResponse, INaturalistConfig, RequestConfig } from './types';
export * from './types/swagger-types';

export {
  Annotations,
  Authentication,
  Comments,
  ControlledTerms,
  Flags,
  Identifications,
  Messages,
  OAuth,
  ObservationFields,
  ObservationFieldValues,
  ObservationPhotos,
  Observations,
  ObservationTiles,
  Photos,
  Places,
  PolygonTiles,
  Posts,
  ProjectObservations,
  Projects,
  Search,
  Taxa,
  Users,
  UTFGrid,
};

export class INaturalistClient {
  private http: HttpClient;

  public readonly comments: Comments;
  public readonly oauth: OAuth;
  public readonly observation_field_values: ObservationFieldValues;
  public readonly photos: Photos;
  public readonly annotations: Annotations;
  public readonly observation_fields: ObservationFields;
  public readonly projects: Projects;
  public readonly polygon_tiles: PolygonTiles;
  public readonly search: Search;
  public readonly messages: Messages;
  public readonly authentication: Authentication;
  public readonly taxa: Taxa;
  public readonly identifications: Identifications;
  public readonly project_observations: ProjectObservations;
  public readonly controlled_terms: ControlledTerms;
  public readonly posts: Posts;
  public readonly utfgrid: UTFGrid;
  public readonly observations: Observations;
  public readonly flags: Flags;
  public readonly places: Places;
  public readonly observation_photos: ObservationPhotos;
  public readonly users: Users;
  public readonly observation_tiles: ObservationTiles;

  constructor(baseURL?: string, apiToken?: string);
  constructor(config?: INaturalistConfig);
  constructor(configOrBaseURL?: string | INaturalistConfig, apiToken?: string) {
    let config: INaturalistConfig;

    if (typeof configOrBaseURL === 'string') {
      config = {
        baseURL: configOrBaseURL,
        apiToken: apiToken,
      };
    } else {
      config = configOrBaseURL || {};
    }

    this.http = new INaturalistHttpClient(config);

    this.comments = new Comments(this.http);
    this.oauth = new OAuth(this.http);
    this.observation_field_values = new ObservationFieldValues(this.http);
    this.photos = new Photos(this.http);
    this.annotations = new Annotations(this.http);
    this.observation_fields = new ObservationFields(this.http);
    this.projects = new Projects(this.http);
    this.polygon_tiles = new PolygonTiles(this.http);
    this.search = new Search(this.http);
    this.messages = new Messages(this.http);
    this.authentication = new Authentication(this.http);
    this.taxa = new Taxa(this.http);
    this.identifications = new Identifications(this.http);
    this.project_observations = new ProjectObservations(this.http);
    this.controlled_terms = new ControlledTerms(this.http);
    this.posts = new Posts(this.http);
    this.utfgrid = new UTFGrid(this.http);
    this.observations = new Observations(this.http);
    this.flags = new Flags(this.http);
    this.places = new Places(this.http);
    this.observation_photos = new ObservationPhotos(this.http);
    this.users = new Users(this.http);
    this.observation_tiles = new ObservationTiles(this.http);
  }

  setApiToken(token: string): void {
    (this.http as INaturalistHttpClient).setApiToken(token);
  }

  removeApiToken(): void {
    (this.http as INaturalistHttpClient).removeApiToken();
  }
}

export default INaturalistClient;
