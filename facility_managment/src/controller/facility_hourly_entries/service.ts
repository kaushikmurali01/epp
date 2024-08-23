import { IUserToken } from "../../interfaces/usertoken.interface";
import { ResponseHandler } from "../../utils/response-handler";
import {
  HTTP_STATUS_CODES,
  RESPONSE_MESSAGES,
  STATUS,
} from "../../utils/status";
import {
  FACILITY_APPROVAL_STATUS,
  FACILITY_ID_GENERAL_STATUS,
  FACILITY_ID_SUBMISSION_STATUS,
} from "../../utils/facility-status";
import { Facility } from "../../models/facility.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { FacilityMeterHourlyEntries } from "../../models/facility_meter_hourly_entries.model";
import { Workflow } from "../../models/workflow.model";

export class FacilityMeterHourlyEntriesService {
  static async getFacilityMeterEntriesListing(
    userToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    facilityMeterId: number
  ): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const result = await FacilityMeterHourlyEntries.findAndCountAll({
        where: {
          facility_meter_detail_id: facilityMeterId,
          is_active: STATUS.IS_ACTIVE,
        },
        offset: offset,
        limit: limit,
        order: [[colName, order]],
      });
      if (result) {
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          result
        );
        return resp;
      } else {
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.noContent,
          []
        );
        return resp;
      }
    } catch (error) {
      throw error;
    }
  }

  static async createNewMeterEntry(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const obj = {
        facility_id: body.facility_id,
        facility_meter_detail_id: body.facility_meter_detail_id,
        meter_id: body.meter_id,
        year: body.year,
        month: body.month,
        media_url: body.media_url,
        usage: body.usage,
        demand: body.demand,
        total_cost: body.total_cost,
        last_updated: body.last_updated,
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.id,
        updated_at: new Date(),
        created_at: new Date(),
      };

      const result = await FacilityMeterHourlyEntries.create(obj);
      // await Workflow.update(
      //   { ew: true },
      //   { where: { facility_id: body.facility_id } }
      // );
      await Facility.update(
        {
          facility_id_submission_status:
            FACILITY_ID_SUBMISSION_STATUS.READY_FOR_SUBMISSION,
        },
        { where: { id: body.facility_id } }
      );
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }

  static async editMeterDetails(
    userToken: IUserToken,
    body: IBaseInterface,
    facilityId: number
  ): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const obj = {
        facility_id: body.facility_id,
        facility_meter_detail_id: body.facility_meter_detail_id,
        meter_id: body.meter_id,
        year: body.year,
        month: body.month,
        media_url: body.media_url,
        usage: body.usage,
        demand: body.demand,
        total_cost: body.total_cost,
        last_updated: body.last_updated,
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
      };
      const result = await FacilityMeterHourlyEntries.update(obj, {
        where: { id: facilityId },
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

  static async removeMeter(
    userToken: IUserToken,
    facilityId: number
  ): Promise<FacilityMeterHourlyEntries[]> {
    try {
      const findFacility = await FacilityMeterHourlyEntries.findOne({
        where: { id: facilityId },
      });
      const result = await FacilityMeterHourlyEntries.update(
        { is_active: STATUS.IS_DELETED },
        { where: { id: facilityId } }
      );
      if (findFacility.facility_id) {
        let findAllFaciltyMeter = await FacilityMeterHourlyEntries.findAll({
          where: {
            facility_id: findFacility.facility_id,
            is_active: STATUS.IS_ACTIVE,
          },
        });
        if (findAllFaciltyMeter && !findAllFaciltyMeter.length) {
          // await Workflow.update(
          //   { ew: false },
          //   { where: { facility_id: findFacility.facility_id } }
          // );
        }
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
