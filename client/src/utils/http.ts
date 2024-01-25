import axios, { AxiosResponse, AxiosError, Method } from 'axios';

axios.defaults.timeout = 100000;
axios.defaults.baseURL = 'http://localhost:5000/api/account';

interface ApiResponse {
  data: any;
}

const handleRequest = async (
  method: Method,
  url: string,
  data?: any
): Promise<any> => {
  try {
    // console.log(`Sending request with data:`, data);
    const response: AxiosResponse<ApiResponse> = await axios({
      method,
      url,
      data,
    });
    // console.log('response', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      console.error(`Request failed for ${method} ${url}`, axiosError);
      throw axiosError;
    } else {
      console.error(`Request failed for ${method} ${url}`, error);
      throw error;
    }
  }
};

export const get = async (url: string, params?: any): Promise<any> =>
  await handleRequest('get', url, { params });

export const post = async (url: string, data: any): Promise<any> =>
  await handleRequest('post', url, data);

export const put = async (url: string, data: any): Promise<any> =>
  await handleRequest('put', url, data);

export const patch = async (url: string, data: any): Promise<any> =>
  await handleRequest('patch', url, data);

export const remove = async (url: string): Promise<any> =>
  await handleRequest('delete', url);
