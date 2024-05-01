import axiosInstance from "./interceptor.js";

export const GET_REQUEST = (url,canObj) => {
  return axiosInstance({
    method: "get",
    url: url,
  });
};
export const POST_REQUEST = (url, data, isImage = false, headers) => {
  return axiosInstance({
    method: "post",
    url,
    data,
    headers,
  });
};
export const PATCH_REQUEST = (url,data) =>{
   return axiosInstance({
    method:"patch",
    url,
    data
   })
}
export const DELETE_REQUEST = (url) => {
  return axiosInstance({
    method: "delete",
    url,
  });
};
export const DELETE_REQUEST_BY_KEY = (url,data) => {
  return axiosInstance({
    method: "delete",
    url,
    data
  });
};

export const PUT_REQUEST = (url, data, isImage = false,headers) => {
  if (isImage) {
    headers['Content-Type'] = 'multipart/form-data';
    return axiosInstance({
      method: "put",
      url,
    data,
    });
  }
  return axiosInstance({
    method: "put",
    url,
    data,
    headers,
  });
};
