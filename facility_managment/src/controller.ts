import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "./enerva-utils/utils/status";
import { FacilityService } from "./service";
import { ResponseHandler } from './enerva-utils/utils/responseHandler';
import { Facility } from "./enerva-utils/models/facility.model";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as multipart from "parse-multipart";



export class FacilityController {
  static errorMessage: { message: any; statusCode: number; };

  /**
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacility (offset:number, limit:number): Promise<Facility[]> {
    try {

      
      const decodedToken = {};
      const result = await FacilityService.getFacilities(decodedToken, offset, limit);  
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };


  /**
   * Get facility by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacilityById (event:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.getFacilitieById(decodedToken, event.params.id);
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };

  /**
   * Post create new facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  createNewFacility (event:any): Promise<any> {
    try {
      const decodedToken = {};

      
      const result = await FacilityService.createFacilitie(decodedToken, event);
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };

  /**
   * Patch edit facility detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  editFacilityDetailsById (event:any, body:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.editFacilitie(decodedToken, body, event.params.id);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);  
      return resp
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };


  /**
   * Delete facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  deleteFacility (event:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.deleteFacilitie(decodedToken, event.params.id);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);  
      return resp
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };

  /**
   * Enerva approve facility Details.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  approveFacilityDetails (event:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.enervaApproveFacilitieById(decodedToken, event.params.id);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);  
      return resp
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };

  static async  uploadMedia (request:any, context:any): Promise<any> {

    console.log(request.headers.connection)

    return request.headers

    // const accountName = process.env.STORAGE_ACCOUNT_NAME;
    // const accountKey = process.env.STORAGE_ACCOUNT_KEY;
    // console.log("ACName",accountName);
    // console.log("ACKey",accountKey);

 
    // const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
 
 
    // const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`,sharedKeyCredential);
    try {

      // const imageUrl  = uploadMediaStream()
      
      
      
      // return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };



}
