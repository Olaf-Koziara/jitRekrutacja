import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from './types';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: '/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }
  //interceptor mimo braku backendu jako przyklad
  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.data) {
          return Promise.reject(error.response.data);
        }
        const apiError: ApiError = {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred',
          timestamp: new Date().toISOString(),
        };
        console.error('API Error:', error);

        return Promise.reject(apiError);
      }
    );
  }

  get client() {
    return this.instance;
  }
}

export const apiClient = new ApiClient().client;
