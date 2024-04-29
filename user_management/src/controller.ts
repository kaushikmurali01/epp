import { FacilityService } from "./service";
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "enerva-utils/utils/status"
import { ResponseHandler } from 'enerva-utils/utils/responseHandler';
 
 
 
export class FacilityController {
  static errorMessage: { message: any; statusCode: number; };
 
  /**
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacility (event:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.getFacilities(decodedToken);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
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
      const result = await FacilityService.getFacilitieById(decodedToken, event.params.facilityId);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
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
      const result = await FacilityService.createFacilitie(decodedToken, event.body);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
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
  static async  editFacilityDetailsById (event:any): Promise<any> {
    try {
      const decodedToken = {};
      const result = await FacilityService.editFacilitie(decodedToken, event.body, event.params.facilityId);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
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
      const result = await FacilityService.deleteFacilitie(decodedToken, event.body);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
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
      const result = await FacilityService.enervaApproveFacilitieById(decodedToken, event.params.facilityId);
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return { body: JSON.stringify(resp) };
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };
 
}
 