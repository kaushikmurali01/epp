import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { FacilityService } from "./service";
import { ResponseHandler } from "../../utils/response-handler";
import { Facility } from "../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { decodeToken } from "../../helper/authantication.helper";
import { IUserToken } from "../../interfaces/usertoken.interface";
import { off } from "process";
import { ParticipantAgreement } from "../../models/participant_agreement.model";

export class FacilityController {
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
    colName: string,
    order: string,
    searchPromt: string,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacility(
        Object(decodedToken),
        offset,
        limit,
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
  static async getFacility2(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacility2(
        Object(decodedToken),
        offset,
        limit,
        colName,
        order,
        data,
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
  static async getAllFacilityInprocess(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getAllFacilityInprocess(
        Object(decodedToken),
        offset,
        limit,
        colName,
        order,
        data,
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
      const result = await FacilityService.getFacilityById(
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
      const result = await FacilityService.createFacility(
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
  static async addBaselineData(
    decodedToken: IUserToken,
    facility_id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.addBaselineData(
        Object(decodedToken),
        facility_id,
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
  static async editBaselineData(
    decodedToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.editBaselineData(
        Object(decodedToken),
        id,
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
  static async submitRejectBaseline(
    decodedToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.submitRejectBaseline(
        Object(decodedToken),
        id,
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
  static async acceptRejectBaseline(
    decodedToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.acceptRejectBaseline(
        Object(decodedToken),
        id,
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
  
  static async assigneToBaseline(
    decodedToken: IUserToken,
    id: number,
    user_id: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.assigneToBaseline(
        Object(decodedToken),
        id,
        user_id
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
  static async getBaselineData(facility_id: number): Promise<Facility[]> {
    try {
      const result = await FacilityService.getBaselineData(facility_id);
      return result;
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  }
  static async getBaselineList(
    decodedToken: IUserToken,
    offset: number,
    limit: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getBaselineList(
        decodedToken,
        offset,
        limit
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
      const result = await FacilityService.editFacility(
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
      const result = await FacilityService.deleteFacility(
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
   * User submit facility for approval.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async submitForApproval(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.submitForapprovalByUser(
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
   * User facility Submmission status.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getCurrentStatus(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getCurrentStatusOfFacility(
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
   * Patch edit facility detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async editFacilityStatusById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const requestData = await event.json();
      const result = await FacilityService.editStatusOfFacility(
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
   * User facility naic code.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getFacilityNaic(
    decodedToken: IUserToken,
    facilityCategory: string,
    facilityType: string
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.getFacilityNaicCode(
        Object(decodedToken),
        facilityCategory,
        facilityType
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
   * Download List Of created facilities CSV by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getDownloadedCsvFacilities(
    decodedToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    searchPromt: string,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.downloadFacilities(
        Object(decodedToken),
        offset,
        limit,
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
   * Download facility csv by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async getDonwloadedCsvFacilityById(
    decodedToken: IUserToken,
    event: HttpRequest
  ): Promise<Facility[]> {
    try {
      const result = await FacilityService.downloadFacilityById(
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
