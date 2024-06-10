import powerBIApiAxiosInstance from "./powerBiInterceptor.js";

export const POWERBI_GET_REQUEST = (url, canObj) => {
  return powerBIApiAxiosInstance({
    method: "get",
    url: url,
  });
};
export const POWERBI_POST_REQUEST = (url, data, headers) => {
  return powerBIApiAxiosInstance({
    method: "post",
    url,
    data,
    headers,
  });
};
export const POWERBI_PATCH_REQUEST = (url, data) => {
  return powerBIApiAxiosInstance({
    method: "patch",
    url,
    data,
  });
};
export const POWERBI_DELETE_REQUEST = (url) => {
  return powerBIApiAxiosInstance({
    method: "delete",
    url,
  });
};

export const POWERBI_PUT_REQUEST = (url, data, headers) => {
  return powerBIApiAxiosInstance({
    method: "put",
    url,
    data,
    headers,
  });
};
