import { IUserToken } from "../../interfaces/usertoken.interface";
import { ResponseHandler } from "../../utils/response-handler";
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "../../utils/status";
import { Facility } from "../../models/facility.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { NonRoutineModel } from "../../models/facility_non_routine_event.model";
import { NonRoutineDataEntryModel } from "../../models/non_routine_data_entry.model";
import { Model } from "sequelize";

export class FacilityNonRoutineEventSevice {
  static async getFacilityNonRoutineEventById(
    userToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      let result: any = await NonRoutineModel.findOne({
        where: {
          id: id,
        },
      });
      result = JSON.parse(JSON.stringify(result));
      let findNonRoutineEntry = await NonRoutineDataEntryModel.findAll({
        where: { non_routine_id: id },
      });
      result.dataEntries = findNonRoutineEntry || [];
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
  static async getFacilityNonRoutineEvent(
    userToken: IUserToken,
    facilityId: number,
    offset: number,
    limit: number,
    meter_type: any
  ): Promise<NonRoutineModel[]> {
    try {
      let whereObj: any = {};
      if (meter_type) {
        whereObj.meter_type = meter_type;
      }
      const result = await NonRoutineModel.findAndCountAll({
        where: { facility_id: facilityId, ...whereObj },
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

  static async addFacilityNonRoutineEvent(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
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
          event_name: body.event_name,
          event_to_period: body.event_to_period,
          event_from_period: body.event_from_period,
          event_description: body.event_description,
          meter_type: body.meter_type,
          created_by: userToken.id,
          updated_by: userToken.id,
        };

        const result = await NonRoutineModel.create(obj);
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
  static async addFacilityNonRoutineDataEntry(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<NonRoutineModel[]> {
    try {
      const findNonRoutine = await NonRoutineModel.findOne({
        where: { id: body.non_routine_id },
      });
      if (!findNonRoutine) {
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.RECORD_NOT_FOUND,
          RESPONSE_MESSAGES.notFound404,
          []
        );
      } else {
        let dataEntries = body.data_entries;
        let array = [];
        let result;
        if (dataEntries.length) {
          for (let i = 0; i < dataEntries.length; i++) {
            const obj: any = {
              non_routine_adjustment: dataEntries[i].non_routine_adjustment,
              start_date: dataEntries[i].start_date || null,
              end_date: dataEntries[i].end_date || null,
              non_routine_id: body.non_routine_id,
              file_url: body.file_url,
              type: body.type,
              created_by: userToken.id,
              updated_by: userToken.id,
            };
            array.push(obj);
            result = await NonRoutineDataEntryModel.bulkCreate(array);
          }
        } else {
          const obj: any = {
            non_routine_adjustment: null,
            start_date: null,
            end_date: null,
            non_routine_id: body.non_routine_id,
            file_url: body.file_url,
            type: body.type,
            created_by: userToken.id,
            updated_by: userToken.id,
          };
          result = await NonRoutineDataEntryModel.create(array);
        }

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
  static async editFacilityNonRoutineDataEntry(
    userToken: IUserToken,
    body: IBaseInterface,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      const obj: any = {
        non_routine_id: body.non_routine_id,
        file_url: body.file_url,
        non_routine_adjustment: body.non_routine_adjustment,
        type: body.type,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        updated_by: userToken.id,
      };

      const result = await NonRoutineDataEntryModel.update(obj, {
        where: { id },
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
  static async editFacilityNonRoutineEvent(
    userToken: IUserToken,
    body: IBaseInterface,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      const obj: any = {
        facility_id: body.facility_id,
        event_name: body.event_name,
        event_description: body.event_description,
        event_to_period: body.event_to_period,
        event_from_period: body.event_from_period,
        meter_type: body.meter_type,
        updated_by: userToken.id,
      };

      const result = await NonRoutineModel.update(obj, { where: { id } });
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
  static async deleteFacilityNonRoutineEvent(
    userToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      const result = await NonRoutineModel.destroy({ where: { id } });
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
