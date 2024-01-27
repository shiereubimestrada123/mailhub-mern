import axios, { AxiosResponse, AxiosError, Method } from 'axios';

axios.defaults.timeout = 100000;
axios.defaults.baseURL = 'http://localhost:5000/api/account';

// Add the interceptor here
// axios.interceptors.request.use(
//   (config) => {
//     // console.log('config', config);
//     console.log('Request Config:', config);
//     // config.headers['Content-Type'] = 'application/json';
//     config.headers['Authorization'] = localStorage.getItem('token');
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   (response) => {
//     // Do something with successful responses
//     // console.log('response', response);
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       // Handle 401 Unauthorized error
//       // Redirect to login page or perform any other action
//       // console.error('Unauthorized error:', error);
//       // For example, you can redirect to the login page
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

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
      // console.error(`Request failed for ${method} ${url}`, axiosError);
      throw axiosError;
    } else {
      // console.error(`Request failed for ${method} ${url}`, error);
      throw error;
    }
  }
};

// export const get = async (url: string, params?: any): Promise<any> =>
//   await handleRequest('get', url, { params });

export const get = async (url: string, headers?: any): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(url, {
      headers: headers, // Pass headers here
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      throw axiosError;
    } else {
      throw error;
    }
  }
};

export const post = async (url: string, data: any): Promise<any> =>
  await handleRequest('post', url, data);

export const put = async (url: string, data: any): Promise<any> =>
  await handleRequest('put', url, data);

export const patch = async (url: string, data: any): Promise<any> =>
  await handleRequest('patch', url, data);

export const remove = async (url: string): Promise<any> =>
  await handleRequest('delete', url);
