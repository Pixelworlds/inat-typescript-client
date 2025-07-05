import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export class Annotations {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Annotation Create
   *
   * Create an annotation
   * 
   * @requires Authentication
   */
  async annotation_create(data: Types.PostAnnotation): Promise<AxiosResponse<any>> {
    return this.client.post(`/annotations`, data);
  }

  /**
   * Annotation Delete
   *
   * Delete an annotation
   * 
   * @requires Authentication
   */
  async annotation_delete(id: string): Promise<AxiosResponse<any>> {
    return this.client.delete(`/annotations/${id}`);
  }

  /**
   * Annotation Vote
   *
   * Vote on an annotation
   * 
   * @requires Authentication
   */
  async annotation_vote(id: string, data: Types.PostVote): Promise<AxiosResponse<any>> {
    return this.client.post(`/votes/vote/annotation/${id}`, data);
  }

  /**
   * Annotation Unvote
   *
   * Remove a vote from annotation
   * 
   * @requires Authentication
   */
  async annotation_unvote(id: string): Promise<AxiosResponse<any>> {
    return this.client.delete(`/votes/unvote/annotation/${id}`);
  }
}