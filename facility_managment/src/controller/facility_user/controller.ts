import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilityService } from "./service";
import { ResponseHandler } from '../../utils/response-handler';
import { Facility } from "../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { decodeToken } from "../../helper/authantication.helper";
import { IUserToken } from "../../interfaces/usertoken.interface";



export class FacilityController {
  static errorMessage: { message: string; statusCode: number; };

  /**
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacility (decodedToken: IUserToken, offset:number, limit:number, colName:string, order:string, searchPromt:string, companyId:number): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacility(Object(decodedToken), offset, limit, colName, order, searchPromt, companyId);  
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
  static async  getFacilityById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacilityById(Object(decodedToken), Number(event.params.id));
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
  static async  createNewFacility (decodedToken: IUserToken, event:HttpRequest, body:IBaseInterface): Promise<Facility[]> {
    try {
      
      const result = await FacilityService.createFacility(Object(decodedToken), body);
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
  static async  editFacilityDetailsById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const requestData = await event.json(); 
      const result = await FacilityService.editFacility(Object(decodedToken), Object(requestData) , Number(event.params.id));
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
   * Delete facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  deleteFacility (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await FacilityService.deleteFacility(Object(decodedToken), Number(event.params.id));  
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
   * User submit facility for approval.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  submitForApproval (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await FacilityService.submitForapprovalByUser(Object(decodedToken), Number(event.params.id));
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
   * User facility Submmission status.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getCurrentStatus (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await FacilityService.getCurrentStatusOfFacility(Object(decodedToken), Number(event.params.id));
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
  static async  editFacilityStatusById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const requestData = await event.json(); 
      const result = await FacilityService.editStatusOfFacility(Object(decodedToken), Object(requestData) , Number(event.params.id));
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
   * User facility naic code.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getFacilityNaic (decodedToken: IUserToken, facilityCategory:string, facilityType:string): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacilityNaicCode(Object(decodedToken), facilityCategory, facilityType );
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };


 


}
