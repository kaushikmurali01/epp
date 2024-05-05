import axios from "axios";
import { authEndpoints } from "constants/endPoints";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
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
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2VuZXJ2YWRldi5iMmNsb2dpbi5jb20vODM2Y2M2YjctMTQ1Zi00ZTlkLWE3MmEtODBmNTAzOWU4NmEzL3YyLjAvIiwic3ViIjoiZTNjZmM1ODQtNDFiYy00NzEyLThjOTctNTM2MWRlZDU5NzE1IiwiYXVkIjoiNmNlNzYzZjQtYTBhNi00NzRkLTk1MmItM2JjN2ViNTk4ZDI1IiwiZXhwIjoxNzE0OTg3MTQzLCJub25jZSI6ImRlZmF1bHROb25jZSIsImlhdCI6MTcxNDkwMDc0MywiYXV0aF90aW1lIjoxNzE0OTAwNzQzLCJvaWQiOiJlM2NmYzU4NC00MWJjLTQ3MTItOGM5Ny01MzYxZGVkNTk3MTUiLCJuYW1lIjoidW5rbm93biIsImdpdmVuX25hbWUiOiJUZXN0IE5hcmVzaCIsImVtYWlscyI6WyJuYXJlc2hAeW9wbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnblVwU2lnbkluIiwibmJmIjoxNzE0OTAwNzQzfQ.c25wX7o4Kzeo7zOrmYmEwgcrP-dWyPsjO-VD8RCmVefkxU7-FdnmAIQz-hQGgYUhmgTprAvMwA12OPgwC5G6htA4uAxOz-_5gs7MxOMUgCUglni4L-CTSWcYnzkbgJfN78PUICLEy7E9aES3JyDI8He3cbAHueN5FG2EHJ_IMavo2u4RYVmkcp_HyyP9ynf1h7CF0STNveeOsl8_tcFx93_gnRKi76YZ2K8uR-fc_rwiziwRAV53jsmT1t8er2PkxdDUQLG9Mi0Vf9SeV2NGYqLIoPiMX-35Uj5cC9msmdVp0zmgs7I7Q9I1XC_4XEy9qhJuJxLvmrwT1oS_KVkLZw";
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
      window.location.href = authEndpoints.login;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
