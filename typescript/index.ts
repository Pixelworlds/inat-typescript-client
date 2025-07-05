import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { Annotations } from './annotations';
import { Comments } from './comments';
import { ControlledTerms } from './controlled-terms';
import { Flags } from './flags';
import { Identifications } from './identifications';
import { Messages } from './messages';
import { Observations } from './observations';
import { ObservationFieldValues } from './observation-field-values';
import { ObservationPhotos } from './observation-photos';
import { Photos } from './photos';
import { Places } from './places';
import { Posts } from './posts';
import { ProjectObservations } from './project-observations';
import { Projects } from './projects';
import { Search } from './search';
import { Taxa } from './taxa';
import { Users } from './users';
import { ObservationTiles } from './observation-tiles';
import { UTFGrid } from './utfgrid';
import { PolygonTiles } from './polygon-tiles';

export class INaturalistClient {
  private client: AxiosInstance;
  public annotations: Annotations;
  public comments: Comments;
  public controlled_terms: ControlledTerms;
  public flags: Flags;
  public identifications: Identifications;
  public messages: Messages;
  public observations: Observations;
  public observation_field_values: ObservationFieldValues;
  public observation_photos: ObservationPhotos;
  public photos: Photos;
  public places: Places;
  public posts: Posts;
  public project_observations: ProjectObservations;
  public projects: Projects;
  public search: Search;
  public taxa: Taxa;
  public users: Users;
  public observation_tiles: ObservationTiles;
  public utfgrid: UTFGrid;
  public polygon_tiles: PolygonTiles;

  constructor(baseURL: string = 'https://api.inaturalist.org/v1', apiToken?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(apiToken && { 'Authorization': `Bearer ${apiToken}` })
      }
    });

    this.annotations = new Annotations(this.client);
    this.comments = new Comments(this.client);
    this.controlled_terms = new ControlledTerms(this.client);
    this.flags = new Flags(this.client);
    this.identifications = new Identifications(this.client);
    this.messages = new Messages(this.client);
    this.observations = new Observations(this.client);
    this.observation_field_values = new ObservationFieldValues(this.client);
    this.observation_photos = new ObservationPhotos(this.client);
    this.photos = new Photos(this.client);
    this.places = new Places(this.client);
    this.posts = new Posts(this.client);
    this.project_observations = new ProjectObservations(this.client);
    this.projects = new Projects(this.client);
    this.search = new Search(this.client);
    this.taxa = new Taxa(this.client);
    this.users = new Users(this.client);
    this.observation_tiles = new ObservationTiles(this.client);
    this.utfgrid = new UTFGrid(this.client);
    this.polygon_tiles = new PolygonTiles(this.client);
  }

  setApiToken(token: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeApiToken(): void {
    delete this.client.defaults.headers['Authorization'];
  }
}

export { Annotations, Comments, ControlledTerms, Flags, Identifications, Messages, Observations, ObservationFieldValues, ObservationPhotos, Photos, Places, Posts, ProjectObservations, Projects, Search, Taxa, Users, ObservationTiles, UTFGrid, PolygonTiles };