import type { AxiosInstance } from 'axios';
import axios from 'axios';

import { Authentication } from './authentication';
import { Comments } from './comments';
import { Identifications } from './identifications';
import { ObservationFieldValues } from './observation-field-values';
import { ObservationFields } from './observation-fields';
import { ObservationPhotos } from './observation-photos';
import { Observations } from './observations';
import { Places } from './places';
import { ProjectObservations } from './project-observations';
import { Projects } from './projects';
import { Users } from './users';

export class INaturalistClient {
  private client: AxiosInstance;
  public authentication: Authentication;
  public observations: Observations;
  public identifications: Identifications;
  public users: Users;
  public projects: Projects;
  public project_observations: ProjectObservations;
  public places: Places;
  public comments: Comments;
  public observation_fields: ObservationFields;
  public observation_field_values: ObservationFieldValues;
  public observation_photos: ObservationPhotos;

  constructor(baseURL: string = 'https://api.inaturalist.org/v1', apiToken?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
    });

    this.authentication = new Authentication(this.client);
    this.observations = new Observations(this.client);
    this.identifications = new Identifications(this.client);
    this.users = new Users(this.client);
    this.projects = new Projects(this.client);
    this.project_observations = new ProjectObservations(this.client);
    this.places = new Places(this.client);
    this.comments = new Comments(this.client);
    this.observation_fields = new ObservationFields(this.client);
    this.observation_field_values = new ObservationFieldValues(this.client);
    this.observation_photos = new ObservationPhotos(this.client);
  }

  setApiToken(token: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeApiToken(): void {
    delete this.client.defaults.headers['Authorization'];
  }
}

export {
  Authentication,
  Comments,
  Identifications,
  ObservationFields,
  ObservationFieldValues,
  ObservationPhotos,
  Observations,
  Places,
  ProjectObservations,
  Projects,
  Users,
};
