import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilitySavingDocumentService } from "./service";
import { ResponseHandler } from '../../utils/response-handler';
import { Facility } from "../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from '../../interfaces/usertoken.interface';
import { addFacilityCharSchema, editFacilityCharSchema } from "../../validator/validator.schema";
import { validatorApiResponse } from "../../helper/validator.handler";
import { FacilitySavingDocument } from "../../models/facility_saving_document.model";


export class FacilitySavingDocumentController {
  static errorMessage: { message: string; statusCode: number; };


  static async getFacilitySavingDocument(decodedToken: IUserToken, event: HttpRequest): Promise<FacilitySavingDocument[]> {
    try {
      const result = await FacilitySavingDocumentService.getFacilitySavingDocument(Object(decodedToken), Number(event.params.facility_id), Number(event.params.offset), Number(event.params.limit), event.query.get("document_type") || "");
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
   * Get facility Characteristics by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilitySavingDocumentById(decodedToken: IUserToken, event: HttpRequest): Promise<FacilitySavingDocument[]> {
    try {
      const result = await FacilitySavingDocumentService.getFacilitySavingDocumentById(Object(decodedToken), Number(event.params.id));
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
  static async addFacilitySavingDocument(decodedToken: IUserToken, body: IBaseInterface): Promise<FacilitySavingDocument[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result = await FacilitySavingDocumentService.addFacilitySavingDocument(Object(decodedToken), body);
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
  static async editFacilitySavingDocument(decodedToken: IUserToken, event: HttpRequest, body: IBaseInterface): Promise<FacilitySavingDocument[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result = await FacilitySavingDocumentService.editFacilitySavingDocument(Object(decodedToken), body, Number(event.params.id));
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };
  static async deleteFacilitySavingDocument(decodedToken: IUserToken, event: HttpRequest): Promise<FacilitySavingDocument[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result = await FacilitySavingDocumentService.deleteFacilitySavingDocument(Object(decodedToken), Number(event.params.id));
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
