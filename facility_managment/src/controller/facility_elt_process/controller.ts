import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { ResponseHandler } from '../../utils/response-handler';
import { FacilityMeterMonthlyEntries } from "../../models/facility_meter_monthly_entries";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from "../../interfaces/usertoken.interface";
import { FacilityEtlService } from "./service";



export class FacilityEtlController {
  static errorMessage: { message: string; statusCode: number; };

 /**
   * Get List Of meter entry of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersMonthlyEntries (decodedToken:IUserToken, offset:number, limit:number, colName:string, order:string, facilityId:number): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityEtlService.getFacilityMeterMonthlyEntriesListing(Object(decodedToken), offset, limit, colName, order, facilityId);  
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
   * Get List Of meter entry by Id of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersMonthlyEntryById (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityEtlService.getFacilityMeterMonthlyEntryById(Object(decodedToken),  Number(event.params.id));  
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
   * Get List Of meter entry of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersHourlyEntries (decodedToken:IUserToken, offset:number, limit:number, colName:string, order:string, facilityId:number): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityEtlService.getFacilityMeterHourlyEntriesListing(Object(decodedToken), offset, limit, colName, order, facilityId);  
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
   * Get List Of meter entry by Id of facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
 static async  getFacilityMetersHourlyEntryById (decodedToken:IUserToken, event:HttpRequest): Promise<FacilityMeterMonthlyEntries[]> {
  try {
    const result = await FacilityEtlService.getFacilityMeterHourlyEntryById(Object(decodedToken),  Number(event.params.id));
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
