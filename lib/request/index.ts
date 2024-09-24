import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T = unknown> {
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
      (response: AxiosResponse) => {
        const formattedResponse = this.formatResponse(response);
        return { ...response, data: formattedResponse };
      },
      (error: AxiosError) => Promise.reject(this.formatError(error))
    );
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      message: response.statusText,
      status: response.status,
    };
  }

  private formatError(error: AxiosError): ApiResponse<null> {
    const { response } = error;
    const errorMsg =
      (response?.data as { error?: string })?.error || 'An unexpected error occurred';
    if (errorMsg) {
      toast({
        title: errorMsg,
        description: response?.status || 500,
        variant: 'destructive',
      });
    }
    return {
      data: null,
      message: errorMsg,
      status: response?.status || 500,
    };
  }

  public get = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    this.instance.get(url, config).then((response) => response.data);

  public post = <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    this.instance.post(url, data, config).then((response) => response.data);

  public put = <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    this.instance.put(url, data, config).then((response) => response.data);

  public del = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    this.instance.delete(url, config).then((response) => response.data);
}

const api = new Request('/api/v1');
export default api;
