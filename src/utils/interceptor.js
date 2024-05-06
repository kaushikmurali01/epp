import axios from "axios";
import { authEndpoints } from "constants/endPoints";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
     Accept: "application/json",
  },
});

// const AxiosInstance = axios.create({
//   // baseURL: base_url,
//   headers: {
//     'Content-Type': 'application/json',
//      Accept: "application/json",
//   },
// });

//request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
