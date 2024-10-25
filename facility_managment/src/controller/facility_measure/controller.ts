import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilityMeasureService } from "./service";
import { ResponseHandler } from "../../utils/response-handler";
import { Facility } from "../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from "../../interfaces/usertoken.interface";
import {
  addFacilityCharSchema,
  editFacilityCharSchema,
} from "../../validator/validator.schema";
import { validatorApiResponse } from "../../helper/validator.handler";
import { FacilityMeasure } from "../../models/facility_measure.model";

export class FacilityMeasureController {
  static errorMessage: { message: string; statusCode: number };

  static async getFacilityMeasure(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<FacilityMeasure[]> {
    try {
      const result = await FacilityMeasureService.getFacilityMeasure(
        Object(decodedToken),
        Number(event.params.facility_id),
        Number(event.params.offset),
        Number(event.params.limit)
      );
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }

  /**
   * Get facility Characteristics by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilityMeasureById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<FacilityMeasure[]> {
    try {
      const result = await FacilityMeasureService.getFacilityMeasureById(
        Object(decodedToken),
        Number(event.params.id)
      );
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }
  /**
   * Post create new facility Characteristics by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async addFacilityMeasure(
    decodedToken: IUserToken,
    body: IBaseInterface
  ): Promise<FacilityMeasure[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result = await FacilityMeasureService.addFacilityMeasure(
        Object(decodedToken),
        body
      );
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }
  // getFacilityMeasure
  /**
   * Patch edit facility Characteristics detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async editFacilityMeasure(
    decodedToken: IUserToken,
    event: HttpRequest,
    body: IBaseInterface
  ): Promise<FacilityMeasure[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result = await FacilityMeasureService.editFacilityMeasure(
        Object(decodedToken),
        body,
        Number(event.params.id)
      );
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }

  static async deleteFacilityMeasure(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<FacilityMeasure[]> {
    try {
      const result = await FacilityMeasureService.deleteFacilityMeasure(
        Number(event.params.id),
        Object(decodedToken)
      );
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }
}
