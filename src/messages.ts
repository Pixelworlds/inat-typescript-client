import type { HttpClient, ApiResponse } from './types';
import type * as Types from '../src/types/swagger-types';

export interface RetrieveMessagesForTheAuthenticatedUserThisDoesNotMarkThemAsReadParams {
  /** Pagination `page` number */
  page?: string;

  /** Whether to view messages the user has received (default) or messages the user has sent */
  box?: 'inbox' | 'sent' | 'any';

  /** Search query for subject and body */
  q?: string;

  /** User ID or username of correspondent to filter by */
  user_id?: string;

  /** Groups results by `thread_id`, only shows the latest message per
thread, and includes a `thread_messages_count` attribute showing the
total number of messages in that thread. Note that this will not
work with the `q` param, and it probably should only be used with
`box=any` because the `thread_messages_count` will be inaccurate when
you restrict it to `inbox` or `sent`.
 */
  threads?: boolean;
}

export class Messages {
  constructor(private http: HttpClient) {}

  /**
   * Retrieve messages for the authenticated user. This does not mark them as read.
   *
   * Show the user's inbox or sent box
   * @requires Authentication
   */
  async retrieve_messages_for_the_authenticated_user_this_does_not_mark_them_as_read(params?: RetrieveMessagesForTheAuthenticatedUserThisDoesNotMarkThemAsReadParams): Promise<ApiResponse<any>> {
    return this.http.get(`/messages`, { params });
  }

  /**
   * Create a new message
   *
   * Create and deliver a new message to another user
   * @requires Authentication
   */
  async create_a_new_message(data: Types.PostMessage): Promise<ApiResponse<Types.Message>> {
    return this.http.post(`/messages`, data);
  }

  /**
   * Retrieve messages in a thread
   *
   * Retrieves all messages in the thread the specified message belongs to
   * and marks them all as read.
   * 
   * @requires Authentication
   */
  async retrieve_messages_in_a_thread(id: number): Promise<ApiResponse<any>> {
    return this.http.get(`/messages/${id}`);
  }

  /**
   * Delete a message / thread
   *
   * This will all of the authenticated user's copies of the messages in tha
   * thread to which the specified message belongs.
   * 
   * @requires Authentication
   */
  async delete_a_message_thread(id: number): Promise<ApiResponse<any>> {
    return this.http.delete(`/messages/${id}`);
  }

  /**
   * Gets a count of messages the authenticated user has not read
   * @requires Authentication
   */
  async gets_a_count_of_messages_the_authenticated_user_has_not_read(): Promise<ApiResponse<any>> {
    return this.http.get(`/messages/unread`);
  }
}