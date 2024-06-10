import axios from "axios";
import { authEndpoints } from "constants/endPoints";

const POWERBI_API_BASE_URL = process.env.REACT_APP_POWERBI_API_BASE_URL

const powerBIApiAxiosInstance = axios.create({
  baseURL: POWERBI_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//power BIrequest interceptor
powerBIApiAxiosInstance.interceptors.request.use(
  (config) => {
    const powerBiToken = localStorage.getItem("powerBiAccessToken");
    if (powerBiToken) {
      config.headers["Authorization"] = "Bearer " + powerBiToken;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor
powerBIApiAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log("error during response", error);
    const originalRequest = error.config;
    if (error?.response?.status === 403) {
    //   localStorage.clear();
    //   window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


export default powerBIApiAxiosInstance;

