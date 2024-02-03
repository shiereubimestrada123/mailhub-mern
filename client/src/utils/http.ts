import axios, { AxiosResponse, AxiosError } from "axios";

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "http://localhost:5000/api/account";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response.status === 401) {
    // }
    return Promise.reject(error);
  }
);

interface ApiResponse {
  data: any;
}

const handleRequest = async (
  method: string,
  url: string,
  data?: any,
  headers?: any
): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios({
      method,
      url,
      data,
      headers,
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

export const get = async (url: string, headers?: any): Promise<any> => {
  return await handleRequest("get", url, undefined, headers);
};

export const post = async (url: string, data: any): Promise<any> =>
  await handleRequest("post", url, data);

export const put = async (url: string, data: any): Promise<any> =>
  await handleRequest("put", url, data);

export const patch = async (url: string, data: any): Promise<any> =>
  await handleRequest("patch", url, data);

export const remove = async (url: string): Promise<any> =>
  await handleRequest("delete", url);
