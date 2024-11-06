import {
  ADMIN_STATUS,
  BASELINE_USER_TYPE,
  BASE_LINE_STATUS,
  FACILITY_THRESHOLD,
  HTTP_STATUS_CODES,
  RESPONSE_MESSAGES,
  STATUS,
} from "../../../utils/status";
import { ResponseHandler } from "../../../utils/response-handler";
import { Facility } from "../../../models/facility.model";
import { IBaseInterface } from "../../../interfaces/baseline.interface";
import { IUserToken } from "../../../interfaces/usertoken.interface";
import {
  FACILITY_APPROVAL_STATUS,
  FACILITY_ID_GENERAL_STATUS,
  FACILITY_ID_SUBMISSION_STATUS,
  FACILITY_METER_TYPE,
} from "../../../utils/facility-status";
import { Company } from "../../../models/company.model";
import { ParticipantAgreement } from "../../../models/participant_agreement.model";
import { User } from "../../../models/user.model";
import { creatSignDocumentUrlForUser } from "../../../helper/create-doc.helper";
import { Op } from "sequelize";
import { rawQuery } from "../../../services/database";
import { UserResourceFacilityPermission } from "../../../models/user-resource-permission";
import { Baseline } from "../../../models/facility_baseline.model";
import { Workflow } from "../../../models/workflow.model";
import { FacilityThreshold } from "../../../models/facility_threshold.model";
import axios from "axios";
import { EnergyEmailTemplate } from "../../../utils/email-templates";
import { EmailService } from "../../sentEmail/service";
import { CompanyLogsService } from "../../facility_logs/service";

export class AdminFacilityService {
  static async getFacility(
    userToken: IUserToken,
    offset: number,
    limit: number,
    status: number,
    colName: string,
    order: string,
    searchPromt: string,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const whereClause: any = {
        is_active: STATUS.IS_ACTIVE,
        [Op.or]: [
          { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
          { street_number: { [Op.iLike]: `%${searchPromt}%` } },
          { street_name: { [Op.iLike]: `%${searchPromt}%` } },
          { city: { [Op.iLike]: `%${searchPromt}%` } },
          { country: { [Op.iLike]: `%${searchPromt}%` } },
        ],
      };

      if (companyId) {
        whereClause.company_id = companyId;
      }

      if (status) {
        whereClause.facility_id_submission_status = status;
      }

      const result = await Facility.findAndCountAll({
        include: [
          {
            model: User,
            as: "submitted_by",
            attributes: ["id", "first_name", "email"],
          },
          {
            model: Company,
            as: "company",
            attributes: ["id", "company_name"],
          },
        ],
        where: whereClause,
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

  static async setThresholdValue(
    userToken: IUserToken,
    facilityId: number,
    body: any
  ): Promise<Facility[]> {
    try {
      let result = await FacilityThreshold.findOne({
        where: { facility_id: facilityId },
      });
      let updateObj = {
        nmbe: body.nmbe || FACILITY_THRESHOLD.NMBE,
        rmse: body.rmse || FACILITY_THRESHOLD.RMSE,
        daily_coverage_threshold:
          body.daily_coverage_threshold ||
          FACILITY_THRESHOLD.DAILY_COVERAGE_THRESHOLD,
        hourly_coverage_threshold:
          body.hourly_coverage_threshold ||
          FACILITY_THRESHOLD.HOURLY_COVERAGE_THRESHOLD,
        monthly_covergae_threshold:
          body.monthly_covergae_threshold ||
          FACILITY_THRESHOLD.MONTHLY_COVERGAE_THRESHOLD,
      };
      if (result && result.id) {
        await FacilityThreshold.update(updateObj, {
          where: { id: result.id },
        });
        result = await FacilityThreshold.findOne({
          where: { facility_id: facilityId },
        });
      } else {
        result = await FacilityThreshold.create({
          facility_id: facilityId,
          ...updateObj,
        });
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
  static async getThresholdValue(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const result = await FacilityThreshold.findOne({
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
  static async getFacilityById(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({
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

  static async createFacility(
    userToken: IUserToken,
    decodedToken: any,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const obj = {
        facility_construction_status: body.facility_construction_status,
        facility_name: body.facility_name,
        naic_code: body.naic_code,
        facility_category: body.facility_category,
        facility_type: body.facility_type,
        target_saving: body.target_saving,
        display_pic_url: body.display_pic_url,
        unit_number: body.unit_number,
        street_number: body.street_number,
        street_name: body.street_name,
        city: body.city,
        country: body.country,
        province: body.province,
        facility_ubi: body.facility_ubi,
        postal_code: body.postal_code,
        address: body.address,
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(
          FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY
        ),
        facility_id_submission_status: Number(
          FACILITY_ID_SUBMISSION_STATUS.DRAFT
        ),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:
          body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.id,
        updated_by: userToken.id,
      };

      const result = await Facility.create(obj);
      await FacilityThreshold.create({
        facility_id: result.id,
        nmbe: FACILITY_THRESHOLD.NMBE,
        rmse: FACILITY_THRESHOLD.RMSE,
        daily_coverage_threshold: FACILITY_THRESHOLD.DAILY_COVERAGE_THRESHOLD,
        hourly_coverage_threshold: FACILITY_THRESHOLD.HOURLY_COVERAGE_THRESHOLD,
        monthly_covergae_threshold:
          FACILITY_THRESHOLD.MONTHLY_COVERGAE_THRESHOLD,
      });
      await Workflow.create({ facility_id: result.id });
      const meter_type1: any = {
        facility_id: result.id,
        parameter_data: [],
        meter_type: FACILITY_METER_TYPE.ELECTRICITY,
        status: BASE_LINE_STATUS.draft,
        admin_status: ADMIN_STATUS.pending,
        user_type: BASELINE_USER_TYPE.USER,
        created_by: userToken.id,
        updated_by: userToken.id,
      };
      const meter_type2: any = {
        facility_id: result.id,
        parameter_data: [],
        meter_type: FACILITY_METER_TYPE.NATURAL_GAS,
        admin_status: ADMIN_STATUS.pending,
        status: BASE_LINE_STATUS.draft,
        created_by: userToken.id,
        user_type: BASELINE_USER_TYPE.USER,
        updated_by: userToken.id,
      };
      const meter_type3: any = {
        facility_id: result.id,
        parameter_data: [],
        admin_status: ADMIN_STATUS.pending,
        meter_type: FACILITY_METER_TYPE.WATER,
        user_type: BASELINE_USER_TYPE.USER,
        status: BASE_LINE_STATUS.draft,
        created_by: userToken.id,
        updated_by: userToken.id,
      };
      await Baseline.create(meter_type1);
      await Baseline.create(meter_type2);
      await Baseline.create(meter_type3);

      let python_response = await axios.post(
        `${process.env.PYTHON_API}/weather/v1/pull-station-data`,
        { facility_id: result.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: decodedToken,
          },
        }
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

  static async editFacility(
    userToken: IUserToken,
    body: IBaseInterface,
    facilityId: number,
    decodedToken: any
  ): Promise<Facility[]> {
    try {
      let checkFacility = await Facility.findOne({ where: { id: facilityId } });
      if (body.company_id && body.company_id != checkFacility?.company_id) {
        const obj = {
          facility_construction_status: body.facility_construction_status,
          facility_name: body.facility_name,
          naic_code: body.naic_code,
          facility_category: body.facility_category,
          facility_type: body.facility_type,
          target_saving: body.target_saving,
          display_pic_url: body.display_pic_url,
          unit_number: body.unit_number,
          street_number: body.street_number,
          street_name: body.street_name,
          city: body.city,
          country: body.country,
          province: body.province,
          postal_code: body.postal_code,
          address: body.address,
          sector: body.sector,
          year_of_construction: body.year_of_construction,
          gross_floor_area: body.gross_floor_area,
          number_of_storeys: body.number_of_storeys,
          occupancy: body.occupancy,
          number_of_building: body.number_of_building,
          facility_ubi: body.facility_ubi,
          latitude: body.latitude,
          longitude: body.longitude,
          company_id: body.company_id,
          facility_id_general_status: Number(
            FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY
          ),
          facility_id_submission_status: Number(
            FACILITY_ID_SUBMISSION_STATUS.DRAFT
          ),
          ng_distribution_company: body.ng_distribution_company,
          ng_distribution_company_data_extraction:
            body.ng_distribution_company_data_extraction,
          facility_bas: body.facility_bas,
          facility_bas_connectivity: body.facility_bas_connectivity,
          is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
          is_active: STATUS.IS_ACTIVE,
          created_by: userToken.id,
        };

        await Facility.update(
          { is_active: STATUS.NOT_ACTIVE },
          { where: { id: facilityId } }
        );
        const result = await Facility.create(obj);
        await FacilityThreshold.create({
          facility_id: result.id,
          nmbe: FACILITY_THRESHOLD.NMBE,
          rmse: FACILITY_THRESHOLD.RMSE,
          daily_coverage_threshold: FACILITY_THRESHOLD.DAILY_COVERAGE_THRESHOLD,
          hourly_coverage_threshold:
            FACILITY_THRESHOLD.HOURLY_COVERAGE_THRESHOLD,
          monthly_covergae_threshold:
            FACILITY_THRESHOLD.MONTHLY_COVERGAE_THRESHOLD,
        });
        await Workflow.create({ facility_id: result.id });

        const meter_type1: any = {
          facility_id: result.id,
          parameter_data: [],
          meter_type: FACILITY_METER_TYPE.ELECTRICITY,
          status: BASE_LINE_STATUS.draft,
          admin_status: ADMIN_STATUS.pending,
          user_type: BASELINE_USER_TYPE.USER,
          created_by: userToken.id,
          updated_by: userToken.id,
        };
        const meter_type2: any = {
          facility_id: result.id,
          parameter_data: [],
          meter_type: FACILITY_METER_TYPE.NATURAL_GAS,
          admin_status: ADMIN_STATUS.pending,
          status: BASE_LINE_STATUS.draft,
          created_by: userToken.id,
          user_type: BASELINE_USER_TYPE.USER,
          updated_by: userToken.id,
        };
        const meter_type3: any = {
          facility_id: result.id,
          parameter_data: [],
          admin_status: ADMIN_STATUS.pending,
          meter_type: FACILITY_METER_TYPE.WATER,
          user_type: BASELINE_USER_TYPE.USER,
          status: BASE_LINE_STATUS.draft,
          created_by: userToken.id,
          updated_by: userToken.id,
        };
        await Baseline.create(meter_type1);
        await Baseline.create(meter_type2);
        await Baseline.create(meter_type3);
        let python_response = await axios.post(
          `${process.env.PYTHON_API}/weather/v1/pull-station-data`,
          { facility_id: result.id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: decodedToken,
            },
          }
        );
        console.log(python_response.data);
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          result
        );
        return resp;
      } else {
        const obj = {
          facility_construction_status: body.facility_construction_status,
          facility_name: body.facility_name,
          naic_code: body.naic_code,
          facility_category: body.facility_category,
          facility_type: body.facility_type,
          target_saving: body.target_saving,
          display_pic_url: body.display_pic_url,
          unit_number: body.unit_number,
          street_number: body.street_number,
          street_name: body.street_name,
          city: body.city,
          country: body.country,
          province: body.province,
          postal_code: body.postal_code,
          facility_ubi: body.facility_ubi,
          latitude: body.latitude,
          longitude: body.longitude,
          address: body.address,
          sector: body.sector,
          year_of_construction: body.year_of_construction,
          gross_floor_area: body.gross_floor_area,
          number_of_storeys: body.number_of_storeys,
          occupancy: body.occupancy,
          number_of_building: body.number_of_building,
          // company_id: body.company_id,
          facility_id_general_status: Number(
            FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY
          ),
          facility_id_submission_status: Number(
            FACILITY_ID_SUBMISSION_STATUS.DRAFT
          ),
          ng_distribution_company: body.ng_distribution_company,
          ng_distribution_company_data_extraction:
            body.ng_distribution_company_data_extraction,
          facility_bas: body.facility_bas,
          facility_bas_connectivity: body.facility_bas_connectivity,
          is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
          is_active: STATUS.IS_ACTIVE,
          updated_by: userToken.id,
          updated_at: new Date(),
        };
        const result = await Facility.update(obj, {
          where: { id: facilityId },
        });

        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          result
        );
        return resp;
      }
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  }
  static async deleteFacility(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const result = await Facility.update(
        { is_active: STATUS.IS_DELETED },
        { where: { id: facilityId } }
      );
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

  static async getFacilityStats(userToken: IUserToken): Promise<Facility[]> {
    try {
      const allFacility = await Facility.count({
        where: { is_active: STATUS.IS_ACTIVE },
      });
      const allCompany = await Company.count();
      const allPaSigned = await ParticipantAgreement.count({
        where: { is_signed: true },
      });
      const allFacilityWithBaselineApproval = await Facility.count({
        where: {
          is_active: STATUS.IS_ACTIVE,
          facility_id_submission_status:
            FACILITY_ID_SUBMISSION_STATUS.BASELINE_APPROVED,
        },
      });
      const allFacilityEndrolled = await Facility.count({
        where: {
          is_active: STATUS.IS_ACTIVE,
          facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.APPROVED,
        },
      });
      const allFacilityInY1 = await Facility.count({
        where: { is_active: STATUS.IS_ACTIVE },
      });
      const allFacilityInY2 = await Facility.count({
        where: { is_active: STATUS.IS_ACTIVE },
      });
      const allFacilityInY3 = await Facility.count({
        where: { is_active: STATUS.IS_ACTIVE },
      });

      const result = {
        all_pa_signed: allPaSigned,
        all_company: allCompany,
        all_facility: allFacility,
        all_acility_with_baseline_approval: allFacilityWithBaselineApproval,
        all_facility_endrolled: allFacilityEndrolled,
        all_facility_in_y1: allFacilityInY1,
        all_facility_in_y2: allFacilityInY2,
        all_facility_in_y3: allFacilityInY3,
      };

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

  static async getPaData(
    userToken: IUserToken,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const oldData = await ParticipantAgreement.findOne({
        where: { company_id: body.company_id, is_active: STATUS.IS_ACTIVE },
      });
      let result;

      if (oldData) {
        result = oldData;
      } else {
        const obj = {
          company_id: body.company_id,
          unsigned_doc: body.unsigned_doc,
          is_signed: false,
          is_active: STATUS.IS_ACTIVE,
        };

        result = await ParticipantAgreement.create(obj);
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

  static async getDashboardStats(
    userToken: IUserToken,
    facilityId: number,
    companyId: number
  ): Promise<Facility[]> {
    try {
      const whereClauseForPa: any = {
        is_active: STATUS.IS_ACTIVE,
      };

      const whereClauseForSignPa: any = {
        is_active: STATUS.IS_ACTIVE,
      };

      const whereClauseCompany: any = {
        is_active: STATUS.IS_ACTIVE,
      };
      const whereClauseBasicFacility: any = {
        is_active: STATUS.IS_ACTIVE,
      };

      const whereClauseendrolledFacility: any = {
        is_active: STATUS.IS_ACTIVE,
        facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.APPROVED,
      };

      const whereClauseBaselineApproval: any = {
        is_active: STATUS.IS_ACTIVE,
        facility_id_submission_status:
          FACILITY_ID_SUBMISSION_STATUS.BASELINE_APPROVED,
      };

      if (facilityId) {
        whereClauseBasicFacility.id = facilityId;
        whereClauseBaselineApproval.id = facilityId;
        whereClauseendrolledFacility.id = facilityId;
      }

      if (companyId) {
        whereClauseCompany.id = companyId;
        whereClauseForSignPa.company_id = companyId;
        whereClauseForPa.company_id = companyId;

        whereClauseBasicFacility.company_id = companyId;
        whereClauseBaselineApproval.company_id = companyId;
        whereClauseendrolledFacility.company_id = companyId;
      }

      const allFacility = await Facility.count({
        where: whereClauseBasicFacility,
      });
      const allUser = await User.count();
      const allCompany = await Company.count({ where: whereClauseCompany });
      const allPaSigned = await ParticipantAgreement.count({
        where: whereClauseForSignPa,
      });
      const allpa = await ParticipantAgreement.count({
        where: whereClauseForPa,
      });
      const allFacilityWithBaselineApproval = await Facility.count({
        where: whereClauseBaselineApproval,
      });
      const allFacilityEndrolled = await Facility.count({
        where: whereClauseendrolledFacility,
      });
      const allFacilityInY1 = await Facility.count({
        where: whereClauseBasicFacility,
      });
      const allFacilityInY2 = await Facility.count({
        where: whereClauseBasicFacility,
      });
      const allFacilityInY3 = await Facility.count({
        where: whereClauseBasicFacility,
      });

      const result = {
        all_user: allUser,
        all_facility: allFacility,
        all_company: allCompany,
        all_pa_signed: allPaSigned,
        all_pa: allpa,
        all_acility_with_baseline_approval: allFacilityWithBaselineApproval,
        all_facility_endrolled: allFacilityEndrolled,
        all_facility_in_y1: allFacilityInY1,
        all_facility_in_y2: allFacilityInY2,
        all_facility_in_y3: allFacilityInY3,
      };

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
  static async getAllFacilityInprocess(
    userToken: IUserToken | any,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any
  ): Promise<Facility[]> {
    try {
      let searchArray = "";
      if (data && data.length) {
        searchArray = " where ";
        data.map((ele, index) => {
          if (!index) {
            searchArray += `p.${ele.key} ILIKE '%${ele.value}%'`;
          } else {
            searchArray += ` AND p.${ele.key} ILIKE '%${ele.value}%'`;
          }
        });
      }
      let findRole: any = {};
      findRole.role_id = userToken.role_id;
      let result, datas, count;
      if (userToken) {
        count =
          await rawQuery(`SELECT COUNT(*) OVER() AS total_count from (SELECT f.*, usp.first_name as assign_firstname, 
            usp.last_name as assign_lastname,
            u.first_name, 
            u.last_name,
            u.id as submitted_by_id,
            usp.id as assign_to_id,
            c.id AS company_id,
            bm.id AS baseline_id,
            c.company_name
               from facility f inner join baseline_model bm on bm.facility_id=f.id and bm.status not in ('DRAFT')
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id
               )p 
               ${searchArray}
               `);
        datas =
          await rawQuery(`SELECT * from (SELECT f.*, usp.first_name as assign_firstname, 
            usp.last_name as assign_lastname,
            u.first_name, 
            u.last_name,
            u.id as submitted_by_id,
            usp.id as assign_to_id,
            c.id AS company_id,
            bm.id AS baseline_id,
            c.company_name
               from facility f inner join baseline_model bm on bm.facility_id=f.id and bm.status not in ('DRAFT')
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id 
                ORDER BY 
                    ${colName} ${order}) p
                    ${searchArray}
                OFFSET 
                    ${offset}
                LIMIT
                    ${limit};
 `);
        result = { count: Number(count[0]?.total_count) || 0, rows: datas };
      }
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
  static async getUsersFromFacility(
    userToken: IUserToken | any,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      let searchArray = "";
      if (data && data.length) {
        searchArray = " where ";
        data.map((ele, index) => {
          if (!index) {
            searchArray += `p.${ele.key} ILIKE '%${ele.value}%'`;
          } else {
            searchArray += ` AND p.${ele.key} ILIKE '%${ele.value}%'`;
          }
        });
      }
      let findRole: any = {};
      findRole.role_id = userToken.role_id;
      let result, datas, count;
      if (userToken) {
        count =
          await rawQuery(`SELECT COUNT(*) OVER() AS total_count from (SELECT 
    u.id,
	u.first_name,
	u.last_name,
	u.email,
    c.company_name,
    c.id AS company_id,
    f.id AS facility_id,
    f.facility_name,
    f.facility_ubi,
	ut.user_type
FROM 
    users u
JOIN 
    user_resource_facility_permission urfp ON u.email = urfp.email
JOIN 
    facility f ON urfp.facility_id = f.id
JOIN user_type ut ON ut.id=u.type
LEFT JOIN 
    company c ON f.company_id = c.id
WHERE 
    urfp.facility_id = ${facility_id})p 
               ${searchArray}
               `);
        datas = await rawQuery(`SELECT * from (SELECT 
    u.id,
	u.first_name,
	u.last_name,
	u.email,
    c.company_name,
    c.id AS company_id,
    f.id AS facility_id,
    f.facility_name,
    f.facility_ubi,
    ut.id as user_type_id,
	ut.user_type
FROM 
    users u
JOIN 
    user_resource_facility_permission urfp ON u.email = urfp.email
JOIN 
    facility f ON urfp.facility_id = f.id
JOIN user_type ut ON ut.id=u.type
LEFT JOIN 
    company c ON f.company_id = c.id
WHERE 
    urfp.facility_id = ${facility_id} 
                ORDER BY 
                    ${colName} ${order}) p
                    ${searchArray}
                OFFSET 
                    ${offset}
                LIMIT
                    ${limit};
 `);
        result = { count: Number(count[0]?.total_count) || 0, rows: datas };
      }
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

  static async getFacility2(
    userToken: IUserToken | any,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any
  ): Promise<Facility[]> {
    try {
      let searchArray = "";
      if (data && data.length) {
        searchArray = " where ";
        data.map((ele, index) => {
          if (!index) {
            searchArray += `p.${ele.key} ILIKE '%${ele.value}%'`;
          } else {
            searchArray += ` AND p.${ele.key} ILIKE '%${ele.value}%'`;
          }
        });
      }
      let findRole: any = {};
      findRole.role_id = userToken.role_id;
      let result, datas, count;
      if (userToken) {
        count =
          await rawQuery(`SELECT COUNT(*) OVER() AS total_count from (SELECT 
          f.*, 
     u.id AS submitted_by_id, 
     u.first_name, 
     u.last_name, 
     c.id AS company_id, 
     c.company_name
       FROM 
           Facility f
       left JOIN 
           users u ON f.created_by = u.id
       left JOIN 
           company c ON f.company_id = c.id
       WHERE 
        f.is_active = ${STATUS.IS_ACTIVE}
           ) p
     ${searchArray}
       `);
        datas =
          await rawQuery(`SELECT *,(select (COUNT(*) + 1) from user_resource_facility_permission 
where facility_id=p.id) as total_user_count from (SELECT 
     f.*, 
     u.id AS submitted_by_id, 
     u.first_name, 
     u.last_name, 
     c.id AS company_id, 
     c.company_name
 FROM 
     Facility f
 left JOIN 
     users u ON f.created_by = u.id
 left JOIN 
     company c ON f.company_id = c.id
 WHERE 
     f.is_active = ${STATUS.IS_ACTIVE}
 ORDER BY 
     ${colName} ${order}) p
     ${searchArray}
 OFFSET 
     ${offset}
 LIMIT 
     ${limit};
 `);
        result = { count: Number(count[0]?.total_count) || 0, rows: datas };
      }
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
  static async facilityAssignUser(
    userToken: IUserToken | any,
    user_ids: any,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      let findFacility = await Facility.findOne({ where: { id: facility_id } });
      let findAllUsers = await User.findAll({
        where: { id: { [Op.in]: user_ids } },
      });
      let emails = [];
      findAllUsers.map((ele) => {
        emails.push(ele.email);
      });
      for (let i = 0; i < emails.length; i++) {
        let findAlreadyExist = await UserResourceFacilityPermission.findOne({
          where: { email: emails[i], facility_id },
        });
        if (!findAlreadyExist) {
          await UserResourceFacilityPermission.create({
            email: emails[i],
            facility_id,
            resource_permission_id: 5,
            company_id: findFacility?.company_id,
          });
        }
      }
      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }
  static async removeUserFromFacility(
    userToken: IUserToken | any,
    user_id: number,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      let findFacility = await Facility.findOne({ where: { id: facility_id } });
      let findUser = await User.findOne({ where: { id: user_id } });
      if (findUser) {
        await UserResourceFacilityPermission.destroy({
          where: {
            email: findUser?.email,
            facility_id,
          },
        });
      }
      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }

  static async getUserInFromCompnay(
    userToken: IUserToken | any,
    company_id: number,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      let query = `SELECT 
   distinct( u.id),
    u.email,
    u.first_name,
    u.last_name,
    CASE 
        WHEN urfp.email IS NOT NULL THEN true
        ELSE false
    END AS isAssign
FROM 
    users u
JOIN 
    user_company_role ucr ON u.id = ucr.user_id
LEFT JOIN 
    user_resource_facility_permission urfp ON u.email = urfp.email and urfp.company_id=${company_id} and urfp.facility_id=${facility_id}
WHERE 
    ucr.company_id = ${company_id}`;
      let result = await rawQuery(query);
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

  static async forToAndCC(id, isCompany) {
    let findToEmail: any, fromEmail: any;
    if (isCompany) {
      findToEmail = await rawQuery(
        `select u.email from user_company_role ucr inner join users u on u.id =ucr.user_id where company_id=${id} and role_id =1`
      );
      findToEmail = findToEmail.map((ele) => ele.email)[0];
      fromEmail = [];
    } else {
      let findCompanyId = await Facility.findOne({ where: { id } });
      findToEmail = await rawQuery(
        `select u.email from user_company_role ucr inner join users u on u.id =ucr.user_id where company_id=${findCompanyId.company_id} and role_id =1`
      );
      findToEmail = findToEmail.map((ele) => ele.email)[0];
      fromEmail = await rawQuery(
        `select email from user_resource_facility_permission where facility_id =${id}`
      );
      fromEmail = fromEmail.map((ele) => ele.email);
    }
    return [findToEmail, fromEmail];
  }

  static async signPaById(
    userToken: IUserToken,
    body: IBaseInterface,
    companyId: number,
    token: any
  ): Promise<Facility[]> {
    try {
      const olResult = await ParticipantAgreement.findOne({
        where: { company_id: companyId },
      });

      if (olResult.is_signed === true) {
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.paAlreadySigned,
          []
        );
        return resp;
      } else if (olResult.is_signed === false) {
        if (body.signed_doc) {
          const obj = {
            signed_doc: body.signed_doc,
            is_signed: true,
            is_active: STATUS.IS_ACTIVE,
            signed_on: new Date(),
            updated_by: userToken.id,
            updated_at: new Date(),
          };

          const result = await ParticipantAgreement.update(obj, {
            where: { company_id: companyId },
          });

          if (result) {
            const userDetails = await User.findOne({
              where: { id: userToken.id },
            });
            const companyDetails = await Company.findOne({
              where: { id: companyId },
            });
            let template: string, to, cc, subject;
            let emails: any;
            emails = await AdminFacilityService.forToAndCC(companyId, true);
            subject = "SIGNED PARTICIPANT AGREEMENT ACKNOWLEDGMENT";
            template =
              await EnergyEmailTemplate.getSignedParticipantEmailTemplate();
            template = template.replace(
              "#company_name#",
              companyDetails?.company_name
            );
            to = emails[0];
            cc = Array.isArray(cc) ? cc.join(",") : "";
            await EmailService.sendEmail(
              {
                to,
                cc,
                subject,
                body: template,
                facility_id: null,
                is_system_generated: true,
                created_by: userToken.id,
                id: null,
              },
              userToken
            );
            // if (userDetails.email) {
            //   (async () => {
            //     const template = await getEmailTemplate();
            //     let userEmailContent = template
            //       .replace("#heading#", EmailContent.paCreatedForCompany.title)
            //       .replace(
            //         "#content#",
            //         EmailContent.paCreatedForCompany.content
            //       )
            //       .replace(
            //         "#userName#",
            //         userDetails ? userDetails?.first_name : "User"
            //       )
            //       .replace(
            //         "#bindingAuthority#",
            //         bindingAuthorityDetails
            //           ? bindingAuthorityDetails?.name
            //           : "Binding Authority"
            //       )
            //       .replace("#version#", version ? version : "version")
            //       .replace(
            //         "#companyName#",
            //         companyDetails ? companyDetails?.company_name : "Company"
            //       );

            //     let adminEmailContent = template
            //       .replace("#heading#", EmailContent.paCreatedForAdmin.title)
            //       .replace("#content#", EmailContent.paCreatedForAdmin.content)
            //       .replace(
            //         "#adminName#",
            //         adminDetails.adminName ? adminDetails.adminName : "Admin"
            //       )
            //       // .replace('#userName#', userDetails ? userDetails?.first_name : 'User')
            //       .replace(
            //         "#bindingAuthority#",
            //         userDetails ? userDetails?.first_name : "Binding Authority"
            //       )
            //       .replace("#version#", version ? version : "version")
            //       .replace(
            //         "#companyName#",
            //         companyDetails ? companyDetails?.company_name : "Company"
            //       );

            //     await Email.send(
            //       userDetails.email,
            //       EmailContent.paCreatedForCompany.title,
            //       userEmailContent
            //     );
            //     await Email.send(
            //       adminDetails.adminEmail,
            //       EmailContent.paCreatedForAdmin.title,
            //       adminEmailContent
            //     );
            //   })();
            // }
          }

          const resp = ResponseHandler.getResponse(
            HTTP_STATUS_CODES.SUCCESS,
            RESPONSE_MESSAGES.Success,
            result
          );
          return resp;
        } else if (body.upload_sign && body.username) {
          const originalPdfPath = body.unsigned_doc
            ? body.unsigned_doc
            : "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf";
          const signatureImagePath = body.upload_sign;
          const companyDetails = await Company.findOne({
            where: { id: companyId },
          });

          const signURL = await creatSignDocumentUrlForUser(
            originalPdfPath,
            signatureImagePath,
            body.username,
            companyDetails?.company_name
          );

          const obj = {
            upload_sign: body.upload_sign,
            signed_doc: signURL,
            is_signed: true,
            signed_on: new Date(),
            is_active: STATUS.IS_ACTIVE,
            updated_by: userToken.id,
            updated_at: new Date(),
          };

          const result = await ParticipantAgreement.update(obj, {
            where: { company_id: companyId },
          });
          let template: string, to, cc, subject;
          let emails: any;
          emails = await AdminFacilityService.forToAndCC(companyId, true);
          subject = "SIGNED PARTICIPANT AGREEMENT ACKNOWLEDGMENT";
          template =
            await EnergyEmailTemplate.getSignedParticipantEmailTemplate();
          template = template.replace(
            "#company_name#",
            companyDetails?.company_name
          );
          to = emails[0];
          cc = Array.isArray(cc) ? cc.join(",") : "";
          await EmailService.sendEmail(
            {
              to,
              cc: cc,
              subject,
              body: template,
              facility_id: null,
              is_system_generated: true,
              created_by: userToken.id,
              id: null,
            },
            userToken
          );
          // if (result) {
          //   const userDetails = await User.findOne({
          //     where: { id: userToken.id },
          //   });
          //   const companyDetails = await Company.findOne({
          //     where: { id: companyId },
          //   });
          //   const bindingAuthorityDetails = {
          //     //name: "Enerva Test Binding Authority",
          //     name: userDetails?.first_name,
          //   };
          //   const version = "V1";

          //   if (userDetails.email) {
          //     (async () => {
          //       const template = await getEmailTemplate();
          //       let userEmailContent = template
          //         .replace("#heading#", EmailContent.paCreatedForCompany.title)
          //         .replace(
          //           "#content#",
          //           EmailContent.paCreatedForCompany.content
          //         )
          //         .replace(
          //           "#userName#",
          //           userDetails ? userDetails?.first_name : "User"
          //         )
          //         .replace(
          //           "#bindingAuthority#",
          //           bindingAuthorityDetails
          //             ? bindingAuthorityDetails?.name
          //             : "Binding Authority"
          //         )
          //         .replace("#version#", version ? version : "version")
          //         .replace(
          //           "#companyName#",
          //           companyDetails ? companyDetails?.company_name : "Company"
          //         );

          //       let adminEmailContent = template
          //         .replace("#heading#", EmailContent.paCreatedForAdmin.title)
          //         .replace("#content#", EmailContent.paCreatedForAdmin.content)
          //         .replace(
          //           "#adminName#",
          //           adminDetails.adminName ? adminDetails.adminName : "Admin"
          //         )
          //         // .replace('#userName#', userDetails ? userDetails?.first_name : 'User')
          //         .replace(
          //           "#bindingAuthority#",
          //           userDetails ? userDetails?.first_name : "Binding Authority"
          //         )
          //         .replace("#version#", version ? version : "version")
          //         .replace(
          //           "#companyName#",
          //           companyDetails ? companyDetails?.company_name : "Company"
          //         );

          //       await Email.send(
          //         userDetails.email,
          //         EmailContent.paCreatedForCompany.title,
          //         userEmailContent
          //       );
          //       await Email.send(
          //         adminDetails.adminEmail,
          //         EmailContent.paCreatedForAdmin.title,
          //         adminEmailContent
          //       );
          //     })();
          //   }
          // }
          // Log start
          (async () => {
            const input = {
              event: `PA is signed`,
              company_id: companyId,
              user_id: userToken.id,
              facility_id: 0,
              created_by: userToken.id,
            };
            await CompanyLogsService.createCompanyLog(input);
          })();
          //Log end

          const resp = ResponseHandler.getResponse(
            HTTP_STATUS_CODES.SUCCESS,
            RESPONSE_MESSAGES.Success,
            result
          );
          return resp;
        } else {
          const resp = ResponseHandler.getResponse(
            HTTP_STATUS_CODES.CONFLICT_ERROR,
            RESPONSE_MESSAGES.invalidJson,
            []
          );
          return resp;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async getPaDataById(
    userToken: IUserToken,
    conpanyId: number
  ): Promise<Facility[]> {
    try {
      const result = await ParticipantAgreement.findOne({
        where: { company_id: conpanyId },
        include: [
          {
            model: User,
            as: "signed_by",
            attributes: ["id", "first_name", "email", "type"],
          },
        ],
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

  static async getFacilityDropDown(
    userToken: IUserToken,
    companyId: number
  ): Promise<Facility[]> {
    try {
      let whereClause: any = {
        is_active: STATUS.IS_ACTIVE,
      };

      if (companyId) {
        whereClause.company_id = companyId;
      }

      const result = await Facility.findAll({
        attributes: ["id", "facility_name"],
        where: whereClause,
        order: [["facility_name", "asc"]],
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
}
