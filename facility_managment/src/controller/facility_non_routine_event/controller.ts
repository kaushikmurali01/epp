import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilityNonRoutineEventSevice } from "./service";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { IUserToken } from "../../interfaces/usertoken.interface";
import { NonRoutineModel } from "../../models/facility_non_routine_event.model";

export class FacilityNonRoutineEventController {
  static errorMessage: { message: string; statusCode: number };

  static async getFacilityNonRoutineEvent(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<NonRoutineModel[]> {
    try {
      const result =
        await FacilityNonRoutineEventSevice.getFacilityNonRoutineEvent(
          Object(decodedToken),
          Number(event.params.facility_id),
          Number(event.params.offset),
          Number(event.params.limit),
          event.query.get("meter_type") || ""
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
   * Get facility non routine by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilityNonRoutineEventById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<NonRoutineModel[]> {
    try {
      const result =
        await FacilityNonRoutineEventSevice.getFacilityNonRoutineEventById(
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
   * Post create new facility non routine .
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async addFacilityNonRoutineEvent(
    decodedToken: IUserToken,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.addFacilityNonRoutineEvent(
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
  static async addFacilityNonRoutineDataEntry(
    decodedToken: IUserToken,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.addFacilityNonRoutineDataEntry(
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
  
  static async deleteHourlyEntries(
    decodedToken: IUserToken,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.deleteHourlyEntries(
          Object(decodedToken),
          body,
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
  static async geteHourlyEntries(
    decodedToken: IUserToken,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.geteHourlyEntries(
          Object(decodedToken),
          body,
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
  static async waterfallData(
    decodedToken: IUserToken,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.waterfallData(
          Object(decodedToken),
          body,
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
  
  static async removeFacilityNonRoutineDataEntry(
    decodedToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.removeFacilityNonRoutineDataEntry(
          Object(decodedToken),
          id
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
  deleteHourlyEntries
  static async removeFacilityNonRoutine(
    decodedToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(addFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.removeFacilityNonRoutine(
          Object(decodedToken),
          id
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
   * Patch edit facility non routine detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async editFacilityNonRoutineEvent(
    decodedToken: IUserToken,
    event: HttpRequest,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.editFacilityNonRoutineEvent(
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
  static async editFacilityNonRoutineDataEntry(
    decodedToken: IUserToken,
    event: HttpRequest,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.editFacilityNonRoutineDataEntry(
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
  static async deleteFacilityNonRoutineEvent(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<NonRoutineModel[]> {
    try {
      // await validatorApiResponse(editFacilityCharSchema, body);
      const result =
        await FacilityNonRoutineEventSevice.deleteFacilityNonRoutineEvent(
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
}
