import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilityCharacteristicsService } from "./service";
import { ResponseHandler } from '../../utils/responseHandler';
import { Facility } from "../../models/facility.model";
import { FacilityCharacteristics } from "../../models/facility_characteristics.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from '../../interfaces/usertoken.interface';



export class FacilityCharacteristicsController {
  static errorMessage: { message: string; statusCode: number; };




  /**
   * Get facility Characteristics by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacilityCharacteristicsById (decodedToken: IUserToken, event:HttpRequest): Promise<FacilityCharacteristics[]> {
    try {
      const result = await FacilityCharacteristicsService.getFacilityCharacteristicsById(Object(decodedToken), Number(event.params.id));
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
   * Post create new facility Characteristics by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  addFacilityCharacteristics (decodedToken: IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityCharacteristics[]> {
    try {
      const result = await FacilityCharacteristicsService.addFacilityCharacteristics(Object(decodedToken), body);
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
   * Patch edit facility Characteristics detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  editFacilityDetailsById (decodedToken: IUserToken, event:HttpRequest, body:IBaseInterface): Promise<FacilityCharacteristics[]> {
    try {
      const result = await FacilityCharacteristicsService.editFacilityCharacteristics(Object(decodedToken), body, Number(event.params.id));
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
