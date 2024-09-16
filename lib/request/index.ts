import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

class Request {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 添加token
    this.instance.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    // response 预处理
    this.instance.interceptors.response.use(
      // @ts-ignore
      (response) => this.formatResponse(response),
      (error) => Promise.reject(this.formatError(error))
    );
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      message: response.statusText,
      status: response.status,
    };
  }

  private formatError(error: AxiosError): ApiResponse {
    return {
      data: null,
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
  }

  public get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    this.instance.get(url, config);

  public post = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => this.instance.post(url, data, config);

  public put = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => this.instance.put(url, data, config);

  public del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    this.instance.delete(url, config);
}

const api = new Request('/api/v1');
export default api;
