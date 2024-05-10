import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../enerva-utils/utils/status";
import { AdminFacilityService } from "./service";
import { ResponseHandler } from '../enerva-utils/utils/responseHandler';
import { Facility } from "../enerva-utils/models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../enerva-utils/interfaces/baseline.interface";
import { createSignedPDF } from "../lib/signDocument";
import { createPDF } from "../lib/testFilePdf";
import { IUserToken } from "../enerva-utils/interfaces/usertoken.interface";
const fs = require('fs');



export class AdminFacilityController {
  static errorMessage: { message: string; statusCode: number; };

  /**
   * Get List Of created facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacility (decodedToken: IUserToken, offset:number, limit:number, status:number, colName:string, order:string): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacility(Object(decodedToken), offset, limit, status, colName, order);  
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
   * Get facility by ID.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  getFacilityById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacilityById(Object(decodedToken), Number(event.params.id));
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
   * Post create new facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  createNewFacility (decodedToken: IUserToken, event:HttpRequest, body:IBaseInterface): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.createFacility(Object(decodedToken), body);
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
   * Patch edit facility detail by the user.
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  editFacilityDetailsById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const requestData = await event.json(); 
      const result = await AdminFacilityService.editFacility(Object(decodedToken), Object(requestData) , Number(event.params.id));
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
   * Delete facility by the user.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  static async  deleteFacility (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.deleteFacility(Object(decodedToken), Number(event.params.id));  
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
   * User facility stats status.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getCurrentStats (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getFacilityStats(Object(decodedToken));
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
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getPaData (decodedToken: IUserToken, event:HttpRequest, body:IBaseInterface): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getPaData(Object(decodedToken),  body);
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
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  getPaDataById (decodedToken: IUserToken, event:HttpRequest, ): Promise<Facility[]> {
    try {
      const result = await AdminFacilityService.getPaDataById(Object(decodedToken),  Number(event.params.id));
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
   *.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
  //  static async  getDashboardStats (event:HttpRequest): Promise<Facility[]> {
    static async  getDashboardStats (decodedToken: IUserToken, event:HttpRequest): Promise<any> {
    try {
      // const originalPdfPath = "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf"
      // const signatureImagePath = "https://eppdevstorage.blob.core.windows.net/agreement-docs/img"

      // const result = await createSignedPDF(originalPdfPath, signatureImagePath)
      // .then(modifiedPdfBytes => {
      //   // Once you have the modified PDF bytes, write them to a file
      //   fs.writeFile('signed_document.pdf', Buffer.from(modifiedPdfBytes), (err) => {
      //     if (err) {
      //       console.error('Error saving signed PDF:', err);
      //       return;
      //     }
      //     console.log('Signed PDF saved successfully as signed_document.pdf');
      //     console.log('Please manually download the signed document from the file system.');
      //   });
      // })
      // .catch(error => {
      //   console.error('Error creating signed PDF:', error);
      // });
      
      const result = await AdminFacilityService.getDashboardStats(Object(decodedToken));
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
   *
   * @param {number} event.params.facilityId - Facility Id.
   * @returns {number} response_code - API Response Code
   * @returns {string} response_message - API Response Message
   * @returns {object[]} response_data - API Response Data
   */
   static async  signPaById (decodedToken: IUserToken, event:HttpRequest): Promise<Facility[]> {
    try {
      
      const requestData = await event.json(); 
      const result = await AdminFacilityService.signPaById(Object(decodedToken), Object(requestData) , Number(event.params.id));
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
