import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { ResponseHandler } from '../../utils/response-handler';
import { FacilityEnervaService } from "./service";
import { HttpRequest } from "@azure/functions";
import { Facility } from "../../models/facility.model";
import { IUserToken } from "../../interfaces/usertoken.interface";



export class FacilityEnervaController {
  static errorMessage: { message: string; statusCode: number; };

 
   /**
   * Enerva approve facility Details.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  approveFacilityDetails (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await FacilityEnervaService.enervaApproveFacilitieById(Object(decodedToken), Number(event.params.id));
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
