import type { HttpClient, ApiResponse } from './types';
import type * as Types from './types/swagger-types';

export class Annotations {
  constructor(private http: HttpClient) {}

  /**
   * Annotation Create
   *
   * Create an annotation
   * 
   * @requires Authentication
   */
  async annotation_create(data: Types.PostAnnotation): Promise<ApiResponse<any>> {
    return this.http.post(`/annotations`, data);
  }

  /**
   * Annotation Delete
   *
   * Delete an annotation
   * 
   * @requires Authentication
   */
  async annotation_delete(id: string): Promise<ApiResponse<any>> {
    return this.http.delete(`/annotations/${id}`);
  }

  /**
   * Annotation Vote
   *
   * Vote on an annotation
   * 
   * @requires Authentication
   */
  async annotation_vote(id: string, data: Types.PostVote): Promise<ApiResponse<any>> {
    return this.http.post(`/votes/vote/annotation/${id}`, data);
  }

  /**
   * Annotation Unvote
   *
   * Remove a vote from annotation
   * 
   * @requires Authentication
   */
  async annotation_unvote(id: string): Promise<ApiResponse<any>> {
    return this.http.delete(`/votes/unvote/annotation/${id}`);
  }
}