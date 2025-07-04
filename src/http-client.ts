import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { HttpClient, RequestConfig, ApiResponse, INaturalistConfig } from './types';

export class INaturalistHttpClient implements HttpClient {
  private client: AxiosInstance;

  constructor(config: INaturalistConfig = {}) {
    const baseURL = config.baseURL || 'https://api.inaturalist.org/v1';
    
    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(config.apiToken && { 'Authorization': `Bearer ${config.apiToken}` })
      },
    });
  }

  setApiToken(token: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeApiToken(): void {
    delete this.client.defaults.headers['Authorization'];
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.patch(url, data, config);
  }
}