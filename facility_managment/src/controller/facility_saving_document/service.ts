import { IUserToken } from '../../interfaces/usertoken.interface';
import { ResponseHandler } from '../../utils/response-handler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS } from '../../utils/status';
import { FACILITY_ID_GENERAL_STATUS } from '../../utils/facility-status';
import { Facility } from '../../models/facility.model';
import { IBaseInterface } from '../../interfaces/baseline.interface';
import { FacilitySavingDocument } from '../../models/facility_saving_document.model';


export class FacilitySavingDocumentService {



  static async getFacilitySavingDocumentById(userToken: IUserToken, id: number): Promise<FacilitySavingDocument[]> {
    try {
      const result = await FacilitySavingDocument.findOne({ where: { id: id } })

      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;

    } catch (error) {
      throw error;

    }

  }
  static async getFacilitySavingDocument(userToken: IUserToken, facilityId: number): Promise<FacilitySavingDocument[]> {
    try {
      const result = await FacilitySavingDocument.findAndCountAll({ where: { facility_id: facilityId } })

      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;

    } catch (error) {
      throw error;

    }

  }


  static async addFacilitySavingDocument(userToken: IUserToken, body: IBaseInterface): Promise<FacilitySavingDocument[]> {
    try {
      const findFacility = await Facility.findOne({ where: { id: body.facility_id } })
      if (!findFacility) {
        return ResponseHandler.getResponse(HTTP_STATUS_CODES.RECORD_NOT_FOUND, RESPONSE_MESSAGES.notFound404, []);
      } else {
        const obj: any = {
          facility_id: body.facility_id,
          is_active: STATUS.IS_ACTIVE,
          document_desc: body.document_desc,
          document_name: body.document_name,
          file_upload: body.file_upload,
          created_by: userToken.id
        };

        const result = await FacilitySavingDocument.create(obj);
        return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      }
    } catch (error) {
      return ResponseHandler.getResponse(HTTP_STATUS_CODES.BAD_REQUEST, error, []);
    }

  }

  static async editFacilitySavingDocument(userToken: IUserToken, body: IBaseInterface, id: number): Promise<FacilitySavingDocument[]> {
    try {
      const obj: any = {
        facility_id: body.facility_id,
        is_active: STATUS.IS_ACTIVE,
        document_desc: body.document_desc,
        document_name: body.document_name,
        file_upload: body.file_upload,
        updated_by: userToken.id
      };

      const result = await FacilitySavingDocument.update(obj, { where: { id } })
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
    }
  }





}