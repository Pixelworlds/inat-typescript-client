import type { AxiosResponse } from 'axios';

export interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: any;
  data?: any;
  [key: string]: any;
}

export type ApiResponse<T = any> = AxiosResponse<T>;

export interface INaturalistConfig {
  baseURL?: string;
  apiToken?: string;
  timeout?: number;
}