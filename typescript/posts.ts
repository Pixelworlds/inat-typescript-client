import type { AxiosInstance, AxiosResponse } from 'axios';
import type * as Types from '../src/types/swagger-types';

export interface PostsSearchParams {
  /** Return posts by this user */
  login?: string;

  /** Return posts from this project */
  project_id?: number;

  /** Pagination `page` number */
  page?: string;

  /** Number of results to return in a `page`. The maximum value is generally
200 unless otherwise noted
 */
  per_page?: string;
}

export interface PostsForUserParams {
  /** returns posts newer than the post with this ID */
  newer_than?: string;

  /** returns posts older than the post with this ID */
  older_than?: string;

  /** Pagination `page` number */
  page?: string;
}

export class Posts {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Posts Search
   *
   * Return journal posts from the iNaturalist site
   * 
   * @requires Authentication
   */
  async posts_search(params?: PostsSearchParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/posts`, { params });
  }

  /**
   * Post Create
   *
   * Create a post
   * 
   * @requires Authentication
   */
  async post_create(data: Types.PostPost): Promise<AxiosResponse<any>> {
    return this.client.post(`/posts`, data);
  }

  /**
   * Post Update
   *
   * Update a post
   * 
   * @requires Authentication
   */
  async post_update(id: number, data: Types.PostPost): Promise<AxiosResponse<any>> {
    return this.client.put(`/posts/${id}`, data);
  }

  /**
   * Post Delete
   *
   * Delete a post
   * 
   * @requires Authentication
   */
  async post_delete(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/posts/${id}`);
  }

  /**
   * Posts For User
   *
   * Return journal posts from the iNaturalist site. If the user is logged-in,
   * also return posts from projects the user is subscribed to
   * 
   * @requires Authentication
   */
  async posts_for_user(params?: PostsForUserParams): Promise<AxiosResponse<any>> {
    return this.client.get(`/posts/for_user`, { params });
  }
}