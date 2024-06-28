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
  FACILITY_METER_TYPE,
  FACILITY_METER_TYPE_TEXT,
} from "../../utils/facility-status";
import { Facility } from "../../models/facility.model";
import { FacilityMeterDetail } from "../../models/facility_meter_details.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { rawQuery } from "../../services/database";

export class FacilityMeterService {
  static async getFacilityMeterListing(
    userToken: IUserToken,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    facilityId: number
  ): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterDetail.findAndCountAll({
        where: { facility_id: facilityId, is_active: STATUS.IS_ACTIVE },
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

  static async createNewMeterInFacility(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<FacilityMeterDetail[]> {
    try {
      const obj = {
        facility_id: body.facility_id,
        meter_name: body.meter_name,
        meter_type: body.meter_type,
        meter_id: body.meter_id,
        meter_active: body.meter_active,
        meter_inactive: body.meter_inactive,
        stil_in_use: body.stil_in_use,
        is_rg_meter: body.is_rg_meter,
        meter_specification_url: body.meter_specification_url,
        meter_spec_as_per_measurement: body.meter_spec_as_per_measurement,
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.id,
        purchased_from_the_grid: body.purchased_from_the_grid,
        unit: body.unit,
      };
      const result = await FacilityMeterDetail.create(obj);
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
    id: number
  ): Promise<FacilityMeterDetail[]> {
    try {
      const obj = {
        meter_name: body.meter_name,
        meter_type: body.meter_type,
        meter_id: body.meter_id,
        meter_active: body.meter_active,
        meter_inactive: body.meter_inactive,
        stil_in_use: body.stil_in_use,
        is_rg_meter: body.is_rg_meter,
        meter_spec_as_per_measurement: body.meter_spec_as_per_measurement,
        meter_specification_url: body.meter_specification_url,
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
        unit: body.unit,
        updated_at: new Date(),
        purchased_from_the_grid: body.purchased_from_the_grid,
      };
      const result = await FacilityMeterDetail.update(obj, {
        where: { id: id },
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
    id: number
  ): Promise<FacilityMeterDetail[]> {
    try {
      let findFacilityId = await FacilityMeterDetail.findOne({
        where: { id: id },
      });
      const result = await FacilityMeterDetail.update(
        { is_active: STATUS.IS_DELETED },
        { where: { id: id } }
      );
      let findFacility = await FacilityMeterDetail.findAll({
        where: {
          facility_id: findFacilityId.facility_id,
          is_active: STATUS.IS_ACTIVE,
        },
      });
      if (findFacility && !findFacility.length) {
        await Facility.update(
          { facility_id_submission_status: 0 },
          { where: { id: findFacilityId.facility_id } }
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

  static async getFacilitieMeterById(
    userToken: IUserToken,
    facilityId: number
  ): Promise<FacilityMeterDetail[]> {
    try {
      const result = await FacilityMeterDetail.findOne({
        where: { id: facilityId, is_active: STATUS.IS_ACTIVE },
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

  static async getMeterStatistics(
    userToken: IUserToken,
    facilityId: number
  ): Promise<FacilityMeterDetail[]> {
    try {
      const totalElectricMeter = await FacilityMeterDetail.count({
        where: {
          meter_type: FACILITY_METER_TYPE.ELECTRICITY,
          facility_id: facilityId,
          is_active: STATUS.IS_ACTIVE,
        },
      });
      const totalWaterMeter = await FacilityMeterDetail.count({
        where: {
          meter_type: FACILITY_METER_TYPE.WATER,
          facility_id: facilityId,
          is_active: STATUS.IS_ACTIVE,
        },
      });
      const totalNGMeter = await FacilityMeterDetail.count({
        where: {
          meter_type: FACILITY_METER_TYPE.NATURAL_GAS,
          facility_id: facilityId,
          is_active: STATUS.IS_ACTIVE,
        },
      });
      let data: any =
        await rawQuery(`select * from (select meter_type ,id ,facility_id from 
    "facility_meter_detail" where facility_id=${facilityId}
          group by "meter_type",id,facility_id) t inner join facility_meter_hourly_entries fmh
on fmh.facility_meter_detail_id =t.id order by fmh.updated_at desc`);
      let result = [
        {
          "Meter type": FACILITY_METER_TYPE_TEXT.ELECTRICITY,
          "Meter type Number": FACILITY_METER_TYPE.ELECTRICITY,
          "Total meters": totalElectricMeter,
          "Current energy date": null,
        },
        {
          "Meter type": FACILITY_METER_TYPE_TEXT.WATER,
          "Meter type Number": FACILITY_METER_TYPE.WATER,
          "Total meters": totalWaterMeter,
          "Current energy date": null,
        },
        {
          "Meter type": FACILITY_METER_TYPE_TEXT.NATURAL_GAS,
          "Meter type Number": FACILITY_METER_TYPE.NATURAL_GAS,
          "Total meters": totalNGMeter,
          "Current energy date": null,
        },
      ];
      if (data && data.length) {
        for (let i = 0; i < result.length; i++) {
          let item: any = result[i];
          let ouptut = data.filter(
            (ele: { meter_type: number }) =>
              ele.meter_type == item["Meter type Number"]
          );
          result[i]["Current energy date"] =
            ouptut[0]?.created_at || ouptut[0]?.updated_at || null;
        }
      }
      console.log(result);
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
