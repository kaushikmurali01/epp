import AxiosInstance from "./interceptor.js";
const API_URL = 'https://companyfacility.azurewebsites.net/api';

export const GET_REQUEST = (url,canObj) => {
  return AxiosInstance({
    method: "get",
    url: url,
  });
};
export const POST_REQUEST = (url, data, isImage = false, headers) => {
  console.log(url)
 const apiURL = API_URL + url;
 console.log(apiURL)

 debugger
  return AxiosInstance({
    method: "post",
    apiURL,
    data,
    headers,
  });
};
export const PATCH_REQUEST = (url,data) =>{
   return AxiosInstance({
    method:"patch",
    url,
    data
   })
}
export const DELETE_REQUEST = (url) => {
  return AxiosInstance({
    method: "delete",
    url,
  });
};
export const DELETE_REQUEST_BY_KEY = (url,data) => {
  return AxiosInstance({
    method: "delete",
    url,
    data
  });
};

export const PUT_REQUEST = (url, data, isImage = false,headers) => {
  if (isImage) {
    headers['Content-Type'] = 'multipart/form-data';
    return AxiosInstance({
      method: "put",
      url,
    data,
    });
  }
  return AxiosInstance({
    method: "put",
    url,
    data,
    headers,
  });
};
