import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../enerva-utils/utils/status";
import { ResponseHandler } from '../enerva-utils/utils/responseHandler';
import { FacilityMeterService } from "./service";
import { FacilityMeterMonthlyEntries } from "../enerva-utils/models/facility_meter_monthly_entries";
import { FacilityMeterDetail } from "../enerva-utils/models/facility_meter_details.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../enerva-utils/interfaces/baseline.interface";
import { IUserToken } from "../enerva-utils/interfaces/usertoken.interface";



export class FacilityMeterController {
  static errorMessage: { message: string; statusCode: number; };

 /**
   * Get List Of meter of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMeters (decodedToken:IUserToken, offset:number, limit:number, colName:string, order:string, facilityId :number): Promise<FacilityMeterDetail[]> {
  try {
    const result = await FacilityMeterService.getFacilityMeterListing(Object(decodedToken), offset, limit, colName, order, facilityId);  
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
   * Post add new meter by the user in facility.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async addNewMeter (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityMeterDetail[]> {
  try {
    const result = await FacilityMeterService.createNewMeterInFacility(Object(decodedToken), body);
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
   * Patch edit facility meter detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async editFacilityMeterDetailsById (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityMeterDetail[]> {
  try {
    const result = await FacilityMeterService.editMeterDetails(Object(decodedToken), body, Number(event.params.id));
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
   * Delete facility meter by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async deleteFacilityMeter (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterService.removeMeter(Object(decodedToken), Number(event.params.id));
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
   * Get facility meter by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getFacilityMeterById (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterService.getFacilitieMeterById(Object(decodedToken), Number(event.params.id));
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
   * Get facility meter by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getMeterStatistics (decodedToken:IUserToken, event:HttpRequest, facilityId :number): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterService.getMeterStatistics(Object(decodedToken), facilityId);
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
