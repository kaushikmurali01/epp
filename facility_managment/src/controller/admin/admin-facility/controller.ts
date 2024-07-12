import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../../utils/status";
import { AdminFacilityService } from "./service";
import { ResponseHandler } from "../../../utils/response-handler";
import { Facility } from "../../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../../interfaces/baseline.interface";
import { createSignedPDF } from "../../../helper/sign-document.helper";
import { IUserToken } from "../../../interfaces/usertoken.interface";
import { creatSignDocumentUrlForUser } from "../../../helper/create-doc.helper";

export class AdminFacilityController {
  static errorMessage: { message: string; statusCode: number };

  /**
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacility(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    status: number,
    colName: string,
    order: string,
    searchPromt: string,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacility(
        Object(decodedToken),
        offset,
        limit,
        status,
        colName,
        order,
        searchPromt,
        companyId
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
   * Get facility by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilityById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacilityById(
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
   * Post create new facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async createNewFacility(
    decodedToken: IUserToken,
    event: HttpRequest,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.createFacility(
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

  /**
   * Patch edit facility detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async editFacilityDetailsById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const requestData = await event.json();
      const result = await AdminFacilityService.editFacility(
        Object(decodedToken),
        Object(requestData),
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
  static async getAllFacilityInprocess(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getAllFacilityInprocess(
        Object(decodedToken),
        offset,
        limit,
        colName,
        order,
        data
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
  static async getUsersFromFacility(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getUsersFromFacility(
        Object(decodedToken),
        offset,
        limit,
        colName,
        order,
        data,
        facility_id
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

  static async getFacility2(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacility2(
        Object(decodedToken),
        offset,
        limit,
        colName,
        order,
        data
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
   * Delete facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async deleteFacility(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.deleteFacility(
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
   * User facility stats status.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getCurrentStats(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacilityStats(
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

  /**
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getPaData(
    decodedToken: IUserToken,
    event: HttpRequest,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getPaData(
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

  /**
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getPaDataById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getPaDataById(
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
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  //  static async  getDashboardStats (event:HttpRequest): Promise<Facility[]> {
  static async getDashboardStats(
    decodedToken: IUserToken,
    event: HttpRequest,
    facilityId: number,
    companyId: number
  ): Promise<any> {
    try {
      const result = await AdminFacilityService.getDashboardStats(
        Object(decodedToken),
        Number(facilityId),
        Number(companyId)
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
   *
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async signPaById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const requestData = await event.json();
      const result = await AdminFacilityService.signPaById(
        Object(decodedToken),
        Object(requestData),
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
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilityDropDown(
    decodedToken: IUserToken,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacilityDropDown(
        Object(decodedToken),
        companyId
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
