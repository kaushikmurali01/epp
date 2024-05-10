import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../enerva-utils/utils/status";
import { ResponseHandler } from '../enerva-utils/utils/responseHandler';
import { FacilityMeterEntriesService } from "./service";
import { FacilityMeterMonthlyEntries } from "../enerva-utils/models/facility_meter_monthly_entries";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../enerva-utils/interfaces/baseline.interface";
import { IUserToken } from "../enerva-utils/interfaces/usertoken.interface";



export class FacilityMeterEntriesController {
  static errorMessage: { message: string; statusCode: number; };

 /**
   * Get List Of meter entry of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersEntries (decodedToken:IUserToken, offset:number, limit:number, colName:string, order:string, facilityMeterId:number): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityMeterEntriesService.getFacilityMeterEntriesListing(Object(decodedToken), offset, limit, colName, order, facilityMeterId);  
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
   * Post add new meter entry by the user in facility.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async addNewEntry (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityMeterEntriesService.createNewMeterEntry(Object(decodedToken), body);
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
   * Patch edit facility meter entry detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async editFacilityMeterEntryById (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityMeterEntriesService.editMeterDetails(Object(decodedToken), body, Number(event.params.id)); 
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
   * Delete facility meter entry by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async deleteFacilityMeterEntry (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const result = await FacilityMeterEntriesService.removeMeter(Object(decodedToken), Number(event.params.id));
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
