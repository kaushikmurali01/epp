import { IUserToken } from "../../interfaces/usertoken.interface";
import { ResponseHandler } from "../../utils/response-handler";
import {
  HTTP_STATUS_CODES,
  RESPONSE_MESSAGES,
  STATUS,
} from "../../utils/status";
import { Facility } from "../../models/facility.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { FacilityMeasure } from "../../models/facility_measure.model";
import { Workflow } from "../../models/workflow.model";

export class FacilityMeasureService {
  static async getFacilityMeasureById(
    userToken: IUserToken,
    id: number
  ): Promise<FacilityMeasure[]> {
    try {
      const result = await FacilityMeasure.findOne({ where: { id: id } });

      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }
  static async getFacilityMeasure(
    userToken: IUserToken,
    facilityId: number,
    offset: number,
    limit: number
  ): Promise<FacilityMeasure[]> {
    try {
      const result = await FacilityMeasure.findAndCountAll({
        where: { facility_id: facilityId, is_active: STATUS.IS_ACTIVE },
        offset,
        limit,
      });

      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }

  static async addFacilityMeasure(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<FacilityMeasure[]> {
    try {
      const findFacility = await Facility.findOne({
        where: { id: body.facility_id },
      });
      if (!findFacility) {
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.RECORD_NOT_FOUND,
          RESPONSE_MESSAGES.notFound404,
          []
        );
      } else {
        const obj: any = {
          facility_id: body.facility_id,
          is_active: STATUS.IS_ACTIVE,
          measure_name: body.measure_name,
          measure_category: body.measure_category,
          measure_install_cost: body.measure_install_cost,
          baseline_detail: body.baseline_detail,
          measure_description: body.measure_description,
          start_date: body.start_date,
          end_date: body.end_date,
          file_upload: body.file_upload,
          file_description: body.file_description,
          created_by: userToken.id,
          updated_by: userToken.id,
        };

        const result = await FacilityMeasure.create(obj);
        await Workflow.update(
          { savings: true },
          { where: { facility_id: body.facility_id } }
        );
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          result
        );
      }
    } catch (error) {
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.BAD_REQUEST,
        error,
        []
      );
    }
  }

  static async editFacilityMeasure(
    userToken: IUserToken,
    body: IBaseInterface,
    id: number
  ): Promise<FacilityMeasure[]> {
    try {
      const obj: any = {
        facility_id: body.facility_id,
        is_active: STATUS.IS_ACTIVE,
        measure_name: body.measure_name,
        measure_category: body.measure_category,
        measure_install_cost: body.measure_install_cost,
        baseline_detail: body.baseline_detail,
        measure_description: body.measure_description,
        start_date: body.start_date,
        end_date: body.end_date,
        file_upload: body.file_upload,
        file_description: body.file_description,
        updated_by: userToken.id,
      };

      const result = await FacilityMeasure.update(obj, { where: { id } });

      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }
  static async deleteFacilityMeasure(id: number): Promise<FacilityMeasure[]> {
    try {
      const findone = await FacilityMeasure.findOne({ where: { id } });
      const result = await FacilityMeasure.destroy({ where: { id } });
      const findAll = await FacilityMeasure.findAll({
        where: {
          facility_id: findone.facility_id,
          is_active: STATUS.IS_ACTIVE,
        },
      });
      if (findAll && !findAll.length) {
        await Workflow.update(
          { savings: false },
          { where: { facility_id: findone.facility_id } }
        );
      }
      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
