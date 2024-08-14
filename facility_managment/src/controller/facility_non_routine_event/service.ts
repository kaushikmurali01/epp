import { IUserToken } from "../../interfaces/usertoken.interface";
import { ResponseHandler } from "../../utils/response-handler";
import {
  HTTP_STATUS_CODES,
  PERFORMANCE_TYPE,
  RESPONSE_MESSAGES,
} from "../../utils/status";
import { Facility } from "../../models/facility.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { NonRoutineModel } from "../../models/facility_non_routine_event.model";
import { NonRoutineDataEntryModel } from "../../models/non_routine_data_entry.model";
import { Model, Op } from "sequelize";
import { MeterHourlyEntries } from "../../models/meter_hourly_entries.model";
import { errorMonitor } from "events";
import { number } from "yup";
import { FacilitySavePerformance } from "../../models/facility_save_performance.model";
import { IncentiveSettings } from "../../models/incentiveSettings.model";

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
        offset: Number(offset * limit),
        limit,
        order: [["created_at", "desc"]],
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

  static async geteHourlyEntries(
    decodedToken: any,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      let start_date = new Date(body.start_date);
      let end_date = new Date(body.end_date);
      let facility_id = body.facility_id;
      let obj: any = {};
      if (body.independent_variable_id) {
        obj.independent_variable_id = body.independent_variable_id;
        obj.is_independent_variable = true;
      }
      if (body.meter_type) {
        obj.meter_id = body.meter_id;
        obj.meter_type = body.meter_type;
      }
      if (body.start_date && body.end_date) {
        const startOffset = new Date(start_date).getTimezoneOffset() * 60000;
        const endOffset = new Date(end_date).getTimezoneOffset() * 60000;
        const start = new Date(start_date.getTime() - startOffset);
        start.setHours(0, 0, 0, 0); // Set to start of the day in local time

        const end = new Date(end_date.getTime() - endOffset);
        end.setHours(23, 59, 59, 999);
        obj = {
          ...obj,
          start_date: {
            [Op.gte]: start,
          },
          end_date: {
            [Op.lte]: end,
          },
        };
      }
      if (facility_id) {
        let data = await MeterHourlyEntries.findAndCountAll({
          where: {
            ...obj,
            facility_id,
          },
          offset: body.offset || 0,
          limit: body.limit || 10,
          order: [["start_date", "asc"]],
        });
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          data
        );
      } else {
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.BAD_REQUEST,
          RESPONSE_MESSAGES.invalidJson
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
  static async waterfallData(
    decodedToken: any,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      let findSetting = await IncentiveSettings.findOne({
        where: { facility_id: body.facility_id },
      });
      let minimumSaving = Number(findSetting?.minimumSavings) || 0;

      let findData1p4p: any = await FacilitySavePerformance.findOne({
        where: {
          facility_id: body.facility_id,
          meter_type: body.meter_type,
          performance_type: PERFORMANCE_TYPE.p4p1,
        },
      });
      let findData2p4p: any = await FacilitySavePerformance.findOne({
        where: {
          facility_id: body.facility_id,
          meter_type: body.meter_type,
          performance_type: PERFORMANCE_TYPE.p4p2,
        },
      });
      let findData3p4p: any = await FacilitySavePerformance.findOne({
        where: {
          facility_id: body.facility_id,
          meter_type: body.meter_type,
          performance_type: PERFORMANCE_TYPE.p4p3,
        },
      });
      let returnObj = [],
        finalResult = {};
      if (body.energySaving) {
        if (findSetting || findData1p4p || findData2p4p || findData3p4p) {
          returnObj = [
            {
              name: "3rd P4P",
              value:
                Number(findData3p4p?.parameter_data?.on_peak_energy_savings) +
                Number(findData3p4p?.parameter_data?.off_peak_energy_savings),
              onPeak: Number(
                findData3p4p?.parameter_data?.on_peak_energy_savings
              ),
              offPeak: Number(
                findData3p4p?.parameter_data?.off_peak_energy_savings
              ),
            },
            {
              name: "2nd P4P",
              value:
                Number(findData2p4p?.parameter_data?.on_peak_energy_savings) +
                Number(findData2p4p?.parameter_data?.off_peak_energy_savings),
              onPeak: Number(
                findData2p4p?.parameter_data?.on_peak_energy_savings
              ),
              offPeak: Number(
                findData2p4p?.parameter_data?.off_peak_energy_savings
              ),
            },
            {
              name: "1st P4P",
              value:
                Number(findData1p4p?.parameter_data?.on_peak_energy_savings) +
                Number(findData1p4p?.parameter_data?.off_peak_energy_savings),
              onPeak: Number(
                findData1p4p?.parameter_data?.on_peak_energy_savings
              ),
              offPeak: Number(
                findData1p4p?.parameter_data?.off_peak_energy_savings
              ),
            },
          ];
          finalResult = { data: returnObj, minimumSaving };
        } else {
          returnObj = [
            { name: "3rd P4P", value: 0, onPeak: 0, offPeak: 0 },
            { name: "2nd P4P", value: 0, onPeak: 0, offPeak: 0 },
            { name: "1st P4P", value: 0, onPeak: 0, offPeak: 0 },
          ];
        }
        finalResult = { data: returnObj, minimumSaving };
      } else {
        if (findSetting || findData1p4p || findData2p4p || findData3p4p) {
          returnObj = [
            {
              name: "3rd P4P",
              value:
                Number(
                  findData3p4p?.parameter_data?.on_peak_energy_savings_incentive
                ) +
                Number(
                  findData3p4p?.parameter_data
                    ?.off_peak_energy_savings_incentive
                ),
              onPeak: Number(
                findData3p4p?.parameter_data?.on_peak_energy_savings_incentive
              ),
              offPeak: Number(
                findData3p4p?.parameter_data?.off_peak_energy_savings_incentive
              ),
            },
            {
              name: "2nd P4P",
              value:
                Number(
                  findData2p4p?.parameter_data?.on_peak_energy_savings_incentive
                ) +
                Number(
                  findData2p4p?.parameter_data
                    ?.off_peak_energy_savings_incentive
                ),
              onPeak: Number(
                findData2p4p?.parameter_data?.on_peak_energy_savings_incentive
              ),
              offPeak: Number(
                findData2p4p?.parameter_data?.off_peak_energy_savings_incentive
              ),
            },
            {
              name: "1st P4P",
              value:
                Number(
                  findData1p4p?.parameter_data?.on_peak_energy_savings_incentive
                ) +
                Number(
                  findData1p4p?.parameter_data
                    ?.off_peak_energy_savings_incentive
                ),
              onPeak: Number(
                findData1p4p?.parameter_data?.on_peak_energy_savings_incentive
              ),
              offPeak: Number(
                findData1p4p?.parameter_data?.off_peak_energy_savings_incentive
              ),
            },
            {
              name: "Pre-Project",
              value: Number(findSetting?.preProjectIncentive),
              onPeak: Number(findSetting?.preProjectIncentive),
              offPeak: 0,
            },
          ];
          let totalValueobj: any = {};
          returnObj.map((ele) => {
            totalValueobj.value += ele.value;
            totalValueobj.onPeak += ele.onPeak;
            totalValueobj.offPeak += ele.offPeak;
          }),
            returnObj.unshift({
              name: "Total",
              value: totalValueobj.value,
              onPeak: totalValueobj.onPeak,
              offPeak: totalValueobj.offPeak,
            });
          finalResult = { data: returnObj };
        } else {
          returnObj = [
            { name: "Total", value: 0, onPeak: 0, offPeak: 0 },
            { name: "3rd P4P", value: 0, onPeak: 0, offPeak: 0 },
            { name: "2nd P4P", value: 0, onPeak: 0, offPeak: 0 },
            { name: "1st P4P", value: 0, onPeak: 0, offPeak: 0 },
            { name: "Pre-Project", value: 0, onPeak: 0, offPeak: 0 },
          ];
        }
        finalResult = { data: returnObj };
      }

      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        finalResult
      );
    } catch (error) {
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.BAD_REQUEST,
        error,
        []
      );
    }
  }
  static async deleteHourlyEntries(
    userToken: IUserToken,
    body: any
  ): Promise<NonRoutineModel[]> {
    try {
      let start_date = new Date(body.start_date);
      let end_date = new Date(body.end_date);
      let facility_id = body.facility_id;
      let obj: any = {};
      if (body.independent_variable_id) {
        obj.independent_variable_id = body.independent_variable_id;
        obj.is_independent_variable = true;
      }
      if (body.meter_type) {
        obj.meter_id = body.meter_id;
        obj.meter_type = body.meter_type;
      }
      if (body.start_date && body.end_date) {
        const startOffset = new Date(start_date).getTimezoneOffset() * 60000;
        const endOffset = new Date(end_date).getTimezoneOffset() * 60000;
        const start = new Date(start_date.getTime() - startOffset);
        start.setHours(0, 0, 0, 0); // Set to start of the day in local time

        const end = new Date(end_date.getTime() - endOffset);
        end.setHours(23, 59, 59, 999);
        obj = {
          ...obj,
          start_date: {
            [Op.and]: {
              [Op.gte]: start,
              [Op.lte]: end,
            },
          },
        };
      }
      if (facility_id) {
        await MeterHourlyEntries.destroy({
          where: {
            ...obj,
            facility_id,
          },
        });
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success
        );
      } else {
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.BAD_REQUEST,
          RESPONSE_MESSAGES.invalidJson
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
  static async removeFacilityNonRoutineDataEntry(
    userToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      await NonRoutineDataEntryModel.destroy({
        where: { id },
      });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success
      );
    } catch (error) {
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.BAD_REQUEST,
        error,
        []
      );
    }
  }
  static async removeFacilityNonRoutine(
    userToken: IUserToken,
    id: number
  ): Promise<NonRoutineModel[]> {
    try {
      await NonRoutineDataEntryModel.destroy({
        where: { non_routine_id: id },
      });
      await NonRoutineModel.destroy({
        where: { id },
      });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success
      );
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
        dataEntries = JSON.parse(JSON.stringify(dataEntries));
        if (dataEntries.length) {
          for (let i = 0; i < dataEntries.length; i++) {
            if (dataEntries[i].id) {
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
              await NonRoutineDataEntryModel.update(obj, {
                where: { id: dataEntries[i].id },
              });
            } else {
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
            }
          }
          result = await NonRoutineDataEntryModel.bulkCreate(array);
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
          result = await NonRoutineDataEntryModel.create(obj);
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
