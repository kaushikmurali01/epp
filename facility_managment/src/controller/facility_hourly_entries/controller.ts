import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { ResponseHandler } from '../../utils/response-handler';
import { FacilityMeterHourlyEntriesService } from "./service";
import { FacilityMeterMonthlyEntries } from "../../models/facility_meter_monthly_entries";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from "../../interfaces/usertoken.interface";



export class FacilityMeterHourlyEntriesController {
  static errorMessage: { message: string; statusCode: number; };

 /**
   * Get List Of meter entry of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersHourlyEntries (decodedToken:IUserToken, offset:number, limit:number, colName:string, order:string, facilityMeterId:number): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityMeterHourlyEntriesService.getFacilityMeterEntriesListing(Object(decodedToken), offset, limit, colName, order, facilityMeterId);  
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
 static async addNewHourlyEntry (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<object> {
  try {
    const result = await FacilityMeterHourlyEntriesService.createNewMeterEntry(Object(decodedToken), body);
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
 static async editFacilityMeterHourlyEntryById (decodedToken:IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityMeterHourlyEntriesService.editMeterDetails(Object(decodedToken), body, Number(event.params.id)); 
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
  static async deleteFacilityMeterHourlyEntry (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterMonthlyEntries[]> {
    try {
      const result = await FacilityMeterHourlyEntriesService.removeMeter(Object(decodedToken), Number(event.params.id));
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
