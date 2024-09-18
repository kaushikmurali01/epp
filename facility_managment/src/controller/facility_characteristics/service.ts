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
import { FacilityCharacteristics } from "../../models/facility_characteristics.model";
import { IBaseInterface } from "../../interfaces/baseline.interface";
import { Workflow } from "../../models/workflow.model";
import { where } from "sequelize";

export class FacilityCharacteristicsService {
  static async getFacilityCharacteristicsById(
    userToken: IUserToken,
    facilityId: number
  ): Promise<FacilityCharacteristics[]> {
    try {
      const result = await FacilityCharacteristics.findOne({
        where: { facility_id: facilityId },
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

  static async addFacilityCharacteristics(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<FacilityCharacteristics[]> {
    try {
      const oldResilt = await FacilityCharacteristics.findOne({
        where: { facility_id: body.facility_id },
      });

      if (oldResilt) {
        return ResponseHandler.getResponse(
          HTTP_STATUS_CODES.CONFLICT_ERROR,
          RESPONSE_MESSAGES.dataUnique,
          []
        );
      } else {
        const obj = {
          facility_id: body.facility_id,
          operational_hours: body.operational_hours,
          year_of_construction: body.year_of_construction,
          gross_floor_area: body.gross_floor_area,
          number_of_storeys: body.number_of_storeys,
          conditioned_gross_floor_area_including_common_area:
            body.conditioned_gross_floor_area_including_common_area,
          unonditioned_gross_floor_area: body.unonditioned_gross_floor_area,
          unique_features_that_impact_energy_usage:
            body.unique_features_that_impact_energy_usage,
          unique_features_of_facility: body.unique_features_of_facility,
          space_cooling_fuel_source: body.space_cooling_fuel_source,
          space_cooling_technology: body.space_cooling_technology,
          space_heating_fuel_source: body.space_heating_fuel_source,
          water_heating_fuel_source: body.water_heating_fuel_source,
          water_heating_technology: body.water_heating_technology,
          not_standard_hvac_equipment: body.not_standard_hvac_equipment,
          space_cooling_technology_description:
            body.space_cooling_technology_description,
          space_cooling_technology_age: body.space_cooling_technology_age,
          space_heating_technology: body.space_heating_technology,
          space_cooling_technology_capacity:
            body.space_cooling_technology_capacity,
          space_cooling_efficiency: body.space_cooling_efficiency,
          facility_electricity_service_size:
            body.facility_electricity_service_size,
          facility_service_entrance_voltage:
            body.facility_service_entrance_voltage,
          space_cooling_efficiency_unit: body.space_cooling_efficiency_unit,
          space_heating_efficiency_unit: body.space_heating_efficiency_unit,
          water_heating_efficiency_unit: body.water_heating_efficiency_unit,
          gross_floor_area_size_category: body.gross_floor_area_size_category,
          space_heating_technology_description:
            body.space_heating_technology_description,
          space_heating_technology_age: body.space_heating_technology_age,
          space_heating_technology_capacity:
            body.space_heating_technology_capacity,
          space_heating_efficiency: body.space_heating_efficiency,
          water_heating_technology_description:
            body.water_heating_technology_description,
          water_heating_technology_age: body.water_heating_technology_age,
          water_heating_technology_capacity:
            body.water_heating_technology_capacity,
          water_heating_efficiency: body.water_heating_efficiency,
          maximum_number_of_occupants: body.maximum_number_of_occupants,
          average_number_of_occupants: body.average_number_of_occupants,
          year_round_or_seasonal: body.year_round_or_seasonal,
          occupants_months_detail: body.occupants_months_detail,
          is_lighting_controlled_for_occupancy:
            body.is_lighting_controlled_for_occupancy,
          is_space_heating_controlled_for_occupancy:
            body.is_space_heating_controlled_for_occupancy,
          is_space_cooling_controlled_for_occupancy:
            body.is_space_cooling_controlled_for_occupancy,
          facility_site_layout_media_url: body.facility_site_layout_media_url,
          facility_wall_assembly_and_ceiling_assembly_media_url:
            body.facility_wall_assembly_and_ceiling_assembly_media_url,
          is_active: STATUS.IS_ACTIVE,
          created_by: userToken.id,
        };

        const result = await FacilityCharacteristics.create(obj);

        await Facility.update(
          {
            facility_id_general_status:
              FACILITY_ID_GENERAL_STATUS.ENETR_FACILITY_DATA,
          },
          { where: { id: body.facility_id } }
        );
        await Workflow.update(
          { detail: true },
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

  static async editFacilityCharacteristics(
    userToken: IUserToken,
    body: IBaseInterface,
    facilityId: number
  ): Promise<FacilityCharacteristics[]> {
    try {
      const obj = {
        operational_hours: body.operational_hours,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        conditioned_gross_floor_area_including_common_area:
          body.conditioned_gross_floor_area_including_common_area,
        unonditioned_gross_floor_area: body.unonditioned_gross_floor_area,
        unique_features_that_impact_energy_usage:
          body.unique_features_that_impact_energy_usage,
        unique_features_of_facility: body.unique_features_of_facility,
        space_cooling_fuel_source: body.space_cooling_fuel_source,
        space_cooling_technology: body.space_cooling_technology,
        space_heating_fuel_source: body.space_heating_fuel_source,
        water_heating_fuel_source: body.water_heating_fuel_source,
        water_heating_technology: body.water_heating_technology,
        facility_electricity_service_size:
          body.facility_electricity_service_size,
        facility_service_entrance_voltage:
          body.facility_service_entrance_voltage,
        space_cooling_efficiency_unit: body.space_cooling_efficiency_unit,
        space_heating_efficiency_unit: body.space_heating_efficiency_unit,
        water_heating_efficiency_unit: body.water_heating_efficiency_unit,
        gross_floor_area_size_category: body.gross_floor_area_size_category,
        not_standard_hvac_equipment: body.not_standard_hvac_equipment,
        space_heating_technology: body.space_heating_technology,
        space_cooling_technology_description:
          body.space_cooling_technology_description,
        space_cooling_technology_age: body.space_cooling_technology_age,
        space_cooling_technology_capacity:
          body.space_cooling_technology_capacity,
        space_cooling_efficiency: body.space_cooling_efficiency,
        space_heating_technology_description:
          body.space_heating_technology_description,
        space_heating_technology_age: body.space_heating_technology_age,
        space_heating_technology_capacity:
          body.space_heating_technology_capacity,
        space_heating_efficiency: body.space_heating_efficiency,
        water_heating_technology_description:
          body.water_heating_technology_description,
        water_heating_technology_age: body.water_heating_technology_age,
        water_heating_technology_capacity:
          body.water_heating_technology_capacity,
        water_heating_efficiency: body.water_heating_efficiency,
        maximum_number_of_occupants: body.maximum_number_of_occupants,
        average_number_of_occupants: body.average_number_of_occupants,
        year_round_or_seasonal: body.year_round_or_seasonal,
        occupants_months_detail: body.occupants_months_detail,
        is_lighting_controlled_for_occupancy:
          body.is_lighting_controlled_for_occupancy,
        is_space_heating_controlled_for_occupancy:
          body.is_space_heating_controlled_for_occupancy,
        is_space_cooling_controlled_for_occupancy:
          body.is_space_cooling_controlled_for_occupancy,
        facility_site_layout_media_url: body.facility_site_layout_media_url,
        facility_wall_assembly_and_ceiling_assembly_media_url:
          body.facility_wall_assembly_and_ceiling_assembly_media_url,
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
      };

      const result = await FacilityCharacteristics.update(obj, {
        where: { facility_id: facilityId },
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
}
