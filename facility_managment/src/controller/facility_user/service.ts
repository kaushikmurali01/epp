import { IUserToken } from "../../interfaces/usertoken.interface";
import { ResponseHandler } from "../../utils/response-handler";
import {
  ADMIN_STATUS,
  BASELINE_USER_TYPE,
  BASE_LINE_STATUS,
  FACILITY_THRESHOLD,
  HTTP_STATUS_CODES,
  PERFORMANCE_STATUS,
  PERFORMANCE_TYPE,
  RESPONSE_MESSAGES,
  STATUS,
  userType,
} from "../../utils/status";
import {
  FACILITY_APPROVAL_STATUS,
  FACILITY_ID_GENERAL_STATUS,
  FACILITY_ID_SUBMISSION_STATUS,
  FACILITY_METER_TYPE,
} from "../../utils/facility-status";
import { Facility } from "../../models/facility.model";
import { IBaseInterface, objects } from "../../interfaces/baseline.interface";
import { Op } from "sequelize";
import { FacilityNAIC } from "../../models/facility_naic.model";
import { getEmailTemplate } from "../../helper/mail-template.helper";
import { EmailContent, adminDetails } from "../../utils/email-content";
import { User } from "../../models/user.model";
import { Company } from "../../models/company.model";
import { Email } from "../../helper/email-sender.helper";
import { saveCsvToFile } from "../../helper/download-csv-from-json.helper";
import { UserCompanyRole } from "../../models/user-company-role";
import { UserResourceFacilityPermission } from "../../models/user-resource-permission";
import { FacilityCharacteristics } from "../../models/facility_characteristics.model";
import { FacilityMeterHourlyEntries } from "../../models/facility_meter_hourly_entries.model";
import { Baseline } from "../../models/facility_baseline.model";
import { FacilityMeterDetail } from "../../models/facility_meter_details.model";
import { rawQuery } from "../../services/database";
import { ParticipantAgreement } from "../../models/participant_agreement.model";
import { IFacilityAttributes } from "../../interfaces/facility.interface";
import { IParticipantAgreementAttributes } from "../../interfaces/participant_agreement.interface";
import { FacilitySavePerformance } from "../../models/facility_save_performance.model";
import { SavingPlanRequest } from "../../models/saving_plan_request.model";
import { FacilityMeasure } from "../../models/facility_measure.model";
import { Workflow } from "../../models/workflow.model";
import { FacilityThreshold } from "../../models/facility_threshold.model";
import { IncentiveSettings } from "../../models/incentiveSettings.model";
import { Json } from "sequelize/types/utils";
import { FacilityChecklist } from "../../models/facility_checklist.model";
import { MasterChecklist } from "../../models/master_checklist.model";
import axios from "axios";
import { CompanyLogsService } from "../facility_logs/service";

export class FacilityService {
  static async getFacility(
    userToken: IUserToken | any,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    searchPromt: string,
    companyId: number
  ): Promise<Facility[]> {
    try {
      let findRole: any = {};
      if (companyId) {
        findRole = await UserCompanyRole.findOne({
          where: { user_id: userToken.id, company_id: companyId },
        });
      } else {
        findRole.role_id = userToken.type;
      }
      let result;
      console.log(findRole, "userTokenuserToken", userToken);
      if (
        userToken &&
        (findRole.role_id === userType.ADMIN ||
          findRole.role_id === userType.SUPER_ADMIN)
      ) {
        result = await Facility.findAndCountAll({
          where: {
            company_id: companyId || userToken.company_id,
            is_active: STATUS.IS_ACTIVE,
            [Op.or]: [
              { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
              { street_number: { [Op.iLike]: `%${searchPromt}%` } },
              { street_name: { [Op.iLike]: `%${searchPromt}%` } },
              { city: { [Op.iLike]: `%${searchPromt}%` } },
              { country: { [Op.iLike]: `%${searchPromt}%` } },
            ],
          },
          offset: offset,
          limit: limit,
          order: [[colName, order]],
        });
      } else {
        let findPermission = await UserResourceFacilityPermission.findAll({
          where: { company_id: companyId, email: userToken?.email },
        });
        let allFacilityId = findPermission.map((ele) => ele.facility_id);
        result = await Facility.findAndCountAll({
          where: {
            company_id: companyId || userToken.company_id,
            is_active: STATUS.IS_ACTIVE,
            [Op.and]: [
              {
                [Op.or]: [
                  { created_by: userToken.id },
                  { id: { [Op.in]: allFacilityId } },
                ],
              },
              {
                [Op.or]: [
                  { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
                  { street_number: { [Op.iLike]: `%${searchPromt}%` } },
                  { street_name: { [Op.iLike]: `%${searchPromt}%` } },
                  { city: { [Op.iLike]: `%${searchPromt}%` } },
                  { country: { [Op.iLike]: `%${searchPromt}%` } },
                ],
              },
            ],
          },
          offset: offset,
          limit: limit,
          order: [[colName, order]],
        });
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
    data: any,
    companyId: number
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
      if (companyId) {
        findRole = await UserCompanyRole.findOne({
          where: { user_id: userToken.id, company_id: companyId },
        });
        if (!findRole) {
          findRole = {};
          findRole.role_id = userToken.role_id;
        }
      } else {
        findRole.role_id = userToken.role_id;
      }
      let result, datas, count;
      if (
        userToken &&
        (findRole.role_id === userType.ADMIN ||
          findRole.role_id === userType.SUPER_ADMIN ||
          findRole.role_id === userType.ENERVA_ADMIN)
      ) {
        let companyQuery = "";
        if (companyId) {
          companyQuery += ` AND f.company_id = ${
            companyId || userToken.company_id
          }`;
        }
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
         ${companyQuery}
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
         ${companyQuery}
 ORDER BY 
     ${colName} ${order}) p
     ${searchArray}
 OFFSET 
     ${offset}
 LIMIT 
     ${limit};
 `);
        result = { count: Number(count[0]?.total_count) || 0, rows: datas };
      } else {
        let findPermission = await UserResourceFacilityPermission.findAll({
          where: {
            company_id: companyId || userToken.company_id,
            email: userToken?.email,
          },
        });
        let allFacilityId = findPermission.map((ele) => ele.facility_id);
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
         f.company_id = ${companyId || userToken.company_id}
         AND f.is_active = ${STATUS.IS_ACTIVE} AND (f.created_by=${
            userToken.id
          } OR f.id in ${allFacilityId})) p
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
   f.company_id = ${companyId || userToken.company_id}
   AND f.is_active = ${STATUS.IS_ACTIVE}
   AND (f.created_by=${userToken.id} OR f.id in ${allFacilityId})
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
  static async getAllFacilityInprocess(
    userToken: IUserToken | any,
    offset: number,
    limit: number,
    colName: string,
    order: string,
    data: any,
    companyId: number
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
      if (companyId) {
        findRole = await UserCompanyRole.findOne({
          where: { user_id: userToken.id, company_id: companyId },
        });
        if (!findRole) {
          findRole = {};
          findRole.role_id = userToken.role_id;
        }
      } else {
        findRole.role_id = userToken.role_id;
      }
      let result, datas, count;
      if (
        userToken &&
        (findRole.role_id === userType.ADMIN ||
          findRole.role_id === userType.SUPER_ADMIN ||
          findRole.role_id === userType.ENERVA_ADMIN)
      ) {
        let companyQuery = "";
        if (companyId) {
          companyQuery += ` where f.company_id=${companyId}`;
        }
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
               from facility f inner join baseline_model bm on bm.facility_id=f.id 
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id
               ${companyQuery}
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
               from facility f inner join baseline_model bm on bm.facility_id=f.id 
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id 
               ${companyQuery}
                ORDER BY 
                    ${colName} ${order}) p
                    ${searchArray}
                OFFSET 
                    ${offset}
                LIMIT
                    ${limit};
 `);
        result = { count: Number(count[0]?.total_count) || 0, rows: datas };
      } else {
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
               from facility f inner join baseline_model bm on bm.facility_id=f.id 
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id
               where f.company_id=${companyId} and bm.assign_to=${userToken.id}
               )p 
               ${searchArray}
               `);
        datas =
          await rawQuery(`SELECT *,(SELECT f.*, usp.first_name as assign_firstname, 
            usp.last_name as assign_lastname,
            u.first_name, 
            u.last_name,
            u.id as submitted_by_id,
            usp.id as assign_to_id,
            c.id AS company_id,
            bm.id AS baseline_id,
            c.company_name
               from facility f inner join baseline_model bm on bm.facility_id=f.id 
               left join users u on u.id = bm.created_by 
               left join company c ON f.company_id = c.id
               left join users usp ON bm.assign_to = usp.id 
               where f.company_id=${companyId} and bm.assign_to=${userToken.id}
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
  static async getFacilityChecklist(
    userToken: IUserToken | any,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      let findFacility = await Facility.findOne({ where: { id: facilityId } });
      let query2 = `SELECT 
    COALESCE(mc.name, '') AS name,
    mc.performance_type,
    json_agg(
        json_build_object(
            'question', mc.question,
            'question_id', mc.id,
            'question_type', mc.question_type,
            'sequence_order', mc.sequence_order,
            'options', mc.options,
            'answer', fc.answer
        ) ORDER BY mc.sequence_order
    ) AS questions_answers
FROM 
    master_checklist mc
LEFT JOIN 
    facility_checklist fc ON mc.id = fc.master_checklist_id 
    AND (
        (fc.company_id IS NOT NULL AND fc.company_id = ${findFacility.company_id}) 
        OR 
        (fc.company_id IS NULL AND fc.facility_id = ${facilityId})
    )
WHERE 
    mc.dependent_id IS NULL
    OR (
       (SELECT COALESCE(fc_dep.answer, 'NO') FROM facility_checklist fc_dep WHERE fc_dep.facility_id = ${facilityId} AND fc_dep.master_checklist_id in	(select mcc.id from master_checklist mcc where mcc.sequence_order=mc.dependent_id and mc.name = mcc.name	and mc.performance_type =mcc.performance_type)) = 'YES'
    ) = 'YES'
GROUP BY 
    mc.name, mc.performance_type
ORDER BY 
    MIN(mc.id);
`;
      let result = await rawQuery(query2);
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
  static async addFacilityChecklist(
    userToken: IUserToken | any,
    facilityId: number,
    masterChecklistId: number,
    answerData: any
  ): Promise<Facility[]> {
    try {
      let findQuestion = await MasterChecklist.findOne({
        where: { id: masterChecklistId },
      });
      let findFacility = await Facility.findOne({ where: { id: facilityId } });
      let whereObj = {};
      if (findQuestion.name == "company" || findQuestion.name == "pa") {
        whereObj = { company_id: findFacility.company_id };
      } else {
        whereObj = { facility_id: facilityId };
      }
      let findChecklist = await FacilityChecklist.findOne({
        where: {
          master_checklist_id: masterChecklistId,
          ...whereObj,
        },
      });
      if (findChecklist) {
        await FacilityChecklist.update(
          {
            answer: answerData.answer,
          },
          { where: { id: findChecklist.id } }
        );
      } else {
        await FacilityChecklist.create({
          ...whereObj,
          master_checklist_id: masterChecklistId,
          answer: answerData.answer,
        });
      }
      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.noContent,
        []
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
      let result: IFacilityAttributes & IParticipantAgreementAttributes =
        await Facility.findOne({
          where: { id: facilityId, is_active: STATUS.IS_ACTIVE },
        });
      let findFacilitySigned = await ParticipantAgreement.findOne({
        where: { company_id: result.company_id },
      });
      result = JSON.parse(JSON.stringify(result));
      result.is_signed = findFacilitySigned?.is_signed || false;
      result.unsigned_doc = findFacilitySigned?.unsigned_doc;
      result.signed_doc = findFacilitySigned?.signed_doc;
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
    body: IBaseInterface,
    decodedToken: any
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
        postal_code: body.postal_code,
        facility_ubi: body.facility_ubi,
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
      const findUser = await User.findOne({ where: { id: userToken.id } });
      await UserResourceFacilityPermission.create({
        email: findUser.email,
        facility_id: result.id,
        is_created: true,
        resource_permission_id: 5,
        company_id: result?.company_id,
      });
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
      // Log start
      (async () => {
        const input = {
          "event": `Facility Created`,
          "company_id": result?.company_id,
          "user_id": userToken.id,
          "facility_id": result.id,
          "created_by":userToken.id
          };
         await CompanyLogsService.createCompanyLog(input);
      })();
    //Log end
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }
  static async addBaselineData(
    userToken: IUserToken,
    facility_id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      let findExist = await Baseline.findOne({
        where: { facility_id: facility_id, meter_type: body.meter_type },
      });
      if (!findExist) {
        const obj: any = {
          facility_id: facility_id,
          parameter_data: body.data,
          meter_type: body.meter_type,
          status: BASE_LINE_STATUS.draft || null,
          created_by: userToken.id,
          updated_by: userToken.id,
        };
        findExist = await Baseline.create(obj);
      }
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        findExist
      );
    } catch (error) {
      throw error;
    }
  }
  static async getPerformanceData(
    userToken: IUserToken,
    facility_id: number,
    meter_type: number,
    performance_type: number
  ): Promise<Facility[]> {
    try {
      let findExist = await FacilitySavePerformance.findOne({
        where: {
          facility_id: facility_id,
          meter_type: meter_type,
          performance_type: performance_type,
        },
      });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        findExist
      );
    } catch (error) {
      throw error;
    }
  }
  static async getWorkflowData(
    userToken: IUserToken,
    facility_id: number
  ): Promise<Facility[]> {
    try {
      let findExist = await Workflow.findOne({
        where: {
          facility_id: facility_id,
        },
      });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        findExist
      );
    } catch (error) {
      throw error;
    }
  }

  static async addPerformanceData(
    userToken: IUserToken,
    facility_id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      let findExist = await FacilitySavePerformance.findOne({
        where: {
          facility_id: facility_id,
          meter_type: body.meter_type,
          performance_type: Number(body.performance_type),
        },
      });
      if (!findExist) {
        const obj: any = {
          facility_id: facility_id,
          parameter_data: body.data,
          meter_type: body.meter_type,
          user_type: BASELINE_USER_TYPE.USER,
          submit_date: new Date(),
          performance_type: Number(body.performance_type) || 1,
          status: body.status || PERFORMANCE_STATUS.submit,
          created_by: userToken.id,
          updated_by: userToken.id,
        };
        findExist = await FacilitySavePerformance.create(obj);
      } else {
        const obj: any = {
          facility_id: facility_id,
          parameter_data: body.data,
          meter_type: body.meter_type,
          user_type: BASELINE_USER_TYPE.USER,
          submit_date: new Date(),
          performance_type: Number(body.performance_type) || 1,
          status: body.status || PERFORMANCE_STATUS.submit,
          created_by: userToken.id,
          updated_by: userToken.id,
        };
        await FacilitySavePerformance.update(obj, {
          where: { id: findExist.id },
        });
      }
      let status = FACILITY_ID_SUBMISSION_STATUS.P4P_1ST_PENDING;
      if (Number(body.performance_type) == PERFORMANCE_TYPE.p4p1) {
        status = FACILITY_ID_SUBMISSION_STATUS.IN_P4P_1ST;
      } else if (Number(body.performance_type) == PERFORMANCE_TYPE.p4p1) {
        status = FACILITY_ID_SUBMISSION_STATUS.IN_P4P_2ND;
      } else {
        status = FACILITY_ID_SUBMISSION_STATUS.IN_P4P_3RD;
      }
      await Facility.update(
        {
          facility_id_submission_status: status,
        },
        { where: { id: facility_id } }
      );
      await Workflow.update(
        { performance: true },
        { where: { facility_id: facility_id } }
      );
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        findExist
      );
    } catch (error) {
      throw error;
    }
  }
  static async addSavingPlanRequest(
    userToken: IUserToken,
    facility_id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const obj: any = {
        facility_id: facility_id,
        measure_category: body.measure_category,
        meter_type: body.meter_type,
        status: PERFORMANCE_STATUS.requested,
        created_by: userToken.id,
        updated_by: userToken.id,
      };
      let findExist = await SavingPlanRequest.create(obj);
      await FacilityMeasure.create({
        facility_id: facility_id,
        measure_category: body.measure_category,
        is_active: STATUS.IS_BLOCKED,
        created_by: userToken.id,
      });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        findExist
      );
    } catch (error) {
      throw error;
    }
  }
  static async editBaselineData(
    userToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      let findBaseline = await Baseline.findOne({ where: { id } });
      const obj: any = {
        parameter_data: body.data,
        user_type: body.user_type || findBaseline.user_type,
        updated_by: userToken.id,
        meter_type: body.meter_type,
        status: body.status || findBaseline.status,
      };
      if (
        body.status == (BASE_LINE_STATUS.submit as any) ||
        body.status == (BASE_LINE_STATUS.verify as any)
      ) {
        await Facility.update(
          {
            facility_id_general_status:
              FACILITY_ID_GENERAL_STATUS.SUBMIT_FACILITY,
          },
          { where: { id: findBaseline.facility_id } }
        );
        await Workflow.update(
          { baseline: true },
          { where: { facility_id: findBaseline.facility_id } }
        );
      }
      const result = await Baseline.update(obj, { where: { id } });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }

  static async submitRejectBaseline(
    userToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const obj: any = {
        updated_by: userToken.id,
        status: body.status,
        submit_date: new Date(),
      };
      let findBaseline = await Baseline.findOne({ where: { id } });
      if (
        body.status == (BASE_LINE_STATUS.submit as any) ||
        body.status == (BASE_LINE_STATUS.verify as any)
      ) {
        await Facility.update(
          {
            facility_id_general_status:
              FACILITY_ID_GENERAL_STATUS.SUBMIT_FACILITY,
            facility_id_submission_status:
              FACILITY_ID_SUBMISSION_STATUS.SUBMITTED,
          },
          { where: { id: findBaseline.facility_id } }
        );
        await Workflow.update(
          { baseline: true },
          { where: { facility_id: findBaseline.facility_id } }
        );
      } else {
        await Facility.update(
          {
            facility_id_submission_status:
              FACILITY_ID_SUBMISSION_STATUS.BASELINE_PENDING_REVIEW,
          },
          { where: { id: findBaseline.facility_id } }
        );
      }
      const result = await Baseline.update(obj, { where: { id } });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }
  static async acceptRejectBaseline(
    userToken: IUserToken,
    id: number,
    body: IBaseInterface
  ): Promise<Facility[]> {
    try {
      const obj: any = {
        admin_status: body.admin_status,
      };
      const result = await Baseline.update(obj, { where: { id } });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }

  static async assigneToBaseline(
    userToken: IUserToken,
    id: number,
    user_id: number
  ): Promise<Facility[]> {
    try {
      const obj: any = {
        updated_by: userToken.id,
        assign_to: user_id,
      };
      const result = await Baseline.update(obj, { where: { id } });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }
  static async getBaselineData(facility_id: number): Promise<Facility[]> {
    try {
      const result = await Baseline.findAll({ where: { facility_id } });
      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        result
      );
    } catch (error) {
      throw error;
    }
  }
  static async getBaselineList(
    decodedToken: IUserToken,
    offset,
    limit
  ): Promise<Facility[]> {
    try {
      let where;
      if (decodedToken.role_id == userType.ENERVA_ADMIN) {
        where = {};
      } else {
        where = { assign_to: decodedToken.id };
      }
      const result = await Baseline.findAndCountAll({
        where,
        include: [
          { model: User, as: "creator" },
          { model: User, as: "assignedUser" },
        ],
        offset,
        limit,
      });
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
    facilityId: number
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
        postal_code: body.postal_code,
        address: body.address,
        facility_ubi: body.facility_ubi,
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.DRAFT),
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
        updated_by: userToken.id,
        updated_at: new Date(),
      };
      const result = await Facility.update(obj, { where: { id: facilityId } });

      // Log start
      (async () => {
        const input = {
          "event": `Facility Updated`,
          "company_id": body.company_id,
          "user_id": userToken.id,
          "facility_id": facilityId,
          "created_by":userToken.id
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
    } catch (error) {
      throw error;
    }
  }

  static async deleteFacility(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      let findBaseline = await Baseline.findOne({
        where: {
          facility_id: facilityId,
          status: {
            [Op.in]: [BASE_LINE_STATUS.created, BASE_LINE_STATUS.submit],
          },
        },
      });
      if (findBaseline && findBaseline.id) {
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.RECORD_NOT_FOUND,
          RESPONSE_MESSAGES.cantDeleteFacility
        );
        return resp;
      } else {
        const result = await Facility.update(
          { is_active: STATUS.IS_DELETED },
          { where: { id: facilityId } }
        );
        // when facility is deleted then its also remove from assign facility from user
        await UserResourceFacilityPermission.destroy({
          where: { facility_id: facilityId },
        });
        // Log start
      (async () => {
        const input = {
          "event": `Facility Deleted`,
          "company_id": userToken.company_id,
          "user_id": userToken.id,
          "facility_id": facilityId,
          "created_by":userToken.id
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
      }
    } catch (error) {
      throw error;
    }
  }

  static async submitForapprovalByUser(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const obj = {
        facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.SUBMITTED,
        facility_id_general_status: FACILITY_ID_GENERAL_STATUS.SUBMIT_FACILITY,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: Number(STATUS.IS_ACTIVE),
      };
      const result = await Facility.update(obj, { where: { id: facilityId } });
      if (result) {
        const facilityDetails = await Facility.findOne({
          where: { id: facilityId },
        });
        const companyDetails = await Company.findOne({
          where: { id: facilityDetails.company_id },
        });
        const userDetails = await User.findOne({ where: { id: userToken.id } });

        if (userDetails.email) {
          const template = await getEmailTemplate();

          // const usernameRegEx = new RegExp('#userName#', "g");

          let userEmailContent = template
            .replace("#heading#", EmailContent.facilityCreatedForUser.title)
            .replace("#content#", EmailContent.facilityCreatedForUser.content)
            .replace(
              "#userName#",
              userDetails ? userDetails?.first_name : "User"
            )
            .replace(
              "#facilityName#",
              facilityDetails?.facility_name
                ? facilityDetails.facility_name
                : "Facility"
            )
            .replace(
              "#companyName#",
              companyDetails ? companyDetails?.company_name : "Company"
            );

          let adminEmailContent = template
            .replace("#heading#", EmailContent.facilityCreatedForAdmin.title)
            .replace("#content#", EmailContent.facilityCreatedForAdmin.content)
            .replace(
              "#adminName#",
              adminDetails.adminName ? adminDetails.adminName : "Admin"
            )
            // .replace(usernameRegEx, userDetails ? userDetails?.first_name : 'User')
            .replace(
              "#facilityName#",
              facilityDetails?.facility_name
                ? facilityDetails.facility_name
                : "Facility"
            )
            .replace(
              "#companyName#",
              companyDetails ? companyDetails?.company_name : "Company"
            );

          Email.send(
            userDetails.email,
            EmailContent.facilityCreatedForUser.title,
            userEmailContent
          );
          Email.send(
            adminDetails.adminEmail,
            EmailContent.facilityCreatedForAdmin.title,
            adminEmailContent
          );
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

  // static async getCurrentStatusOfFacility(
  //   userToken: IUserToken,
  //   facilityId: number
  // ): Promise<Facility[]> {
  //   try {
  //     const timeLineObj = {
  //       summary: true,
  //       details: true,
  //       energy_and_water: false,
  //       weather: false,
  //       saving_plan: false,
  //       baseline_modeling: false,
  //       performance: false,
  //     };

  //     let result: any = await Facility.findOne({
  //       where: { id: facilityId },
  //       attributes: ["id", "naic_code", "facility_id_general_status"],
  //     });
  //     let findWorkflowData: any = await Workflow.findOne({
  //       where: { facility_id: facilityId },
  //       attributes: [
  //         "detail",
  //         "ew",
  //         "weather_iv",
  //         "savings",
  //         "baseline",
  //         "performance",
  //       ],
  //     });
  //     let result2 = JSON.parse(JSON.stringify(result));
  //     findWorkflowData = JSON.parse(JSON.stringify(findWorkflowData));
  //     result2.timeline = findWorkflowData || timeLineObj;
  //     const data1 = {
  //       summary: { rank: 0 },
  //       detail: { rank: 1 },
  //       ew: { rank: 2 },
  //       weather_iv: { rank: 3 },
  //       savings: { rank: 3 },
  //       baseline: { rank: 3 },
  //       performance: { rank: 4 },
  //     };
  //     let data2: any = findWorkflowData;
  //     data2.summary = true;
  //     type DataEntry = {
  //       value: boolean;
  //       rank: number;
  //     };

  //     type ResultEntry = {
  //       value: boolean;
  //       rank: number;
  //       status: true | false;
  //     };

  //     function combineData(data1: any, data2: any) {
  //       const result = {};

  //       for (const key in data1) {
  //         if (data1.hasOwnProperty(key)) {
  //           result[key] = {
  //             value: data2[key],
  //             rank: data1[key].rank,
  //           };
  //         }
  //       }

  //       return result;
  //     }

  //     function addStatusWithRank(
  //       data: Record<string, DataEntry>
  //     ): Record<string, ResultEntry> {
  //       const result: any = {};
  //       const rankStatus = new Map<number, true | false>();
  //       let firstFalseEncountered = false;
  //       for (const [key, { value, rank }] of Object.entries(data)) {
  //         let status: true | false;
  //         if (rankStatus.has(rank)) {
  //           if (value === false) {
  //             firstFalseEncountered = true;
  //           } else {
  //             firstFalseEncountered = false;
  //           }
  //           status = rankStatus.get(rank)!;
  //         } else {
  //           if (!firstFalseEncountered && value === false) {
  //             status = true;
  //             firstFalseEncountered = true;
  //           } else {
  //             status = value ? true : false;
  //           }
  //           rankStatus.set(rank, status);
  //         }
  //         result[key] = status;
  //       }
  //       return result;
  //     }

  //     const dataWithRank = combineData(data1, data2);
  //     let findIncentives = await IncentiveSettings.findOne({
  //       where: { facility_id: facilityId },
  //     });

  //     let updatedData = addStatusWithRank(dataWithRank);
  //     result2.disabled = updatedData;
  //     let finalValue = result2.disabled?.performance || false;
  //     if (userToken.role_id != userType.ENERVA_ADMIN) {
  //       if (findIncentives) {
  //         finalValue = true;
  //       }
  //     }
  //     result2.disabled.performance = finalValue;
  //     const resp = ResponseHandler.getResponse(
  //       HTTP_STATUS_CODES.SUCCESS,
  //       RESPONSE_MESSAGES.Success,
  //       result
  //     );
  //     return resp;
  //   } catch (error) {
  //     console.log(error, "errorerro");
  //     throw error;
  //   }
  // }
  static async addStatusWithRank(data: Record<string, any>): Promise<any> {
    const result: any = {};
    const rankStatus = new Map<number, true | false>();
    let firstFalseEncountered = false;
    for (const [key, { value, rank }] of Object.entries(data)) {
      let status: true | false;
      if (rankStatus.has(rank)) {
        if (value === false) {
          firstFalseEncountered = true;
        } else {
          firstFalseEncountered = false;
        }
        status = rankStatus.get(rank)!;
      } else {
        if (!firstFalseEncountered && value === false) {
          status = true;
          firstFalseEncountered = true;
        } else {
          status = value ? true : false;
        }
        rankStatus.set(rank, status);
      }
      result[key] = status;
    }
    return result;
  }
  static async getCurrentStatusOfFacility(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const timeLineObj = {
        summary: true,
        detail: true,
        ew: false,
        weather_iv: false,
        savings: false,
        baseline: false,
        performance: false,
      };

      const facility = await Facility.findOne({
        where: { id: facilityId },
        attributes: ["id", "naic_code", "facility_id_general_status"],
      });

      const workflowData = await Workflow.findOne({
        where: { facility_id: facilityId },
        attributes: [
          "detail",
          "ew",
          "weather_iv",
          "savings",
          "baseline",
          "performance",
        ],
      });

      let facilityData: any = facility ? facility.toJSON() : {};
      const workflowDataJson = workflowData ? workflowData.toJSON() : {};
      facilityData.timeline = { ...timeLineObj, ...workflowDataJson };

      const dataRanks = {
        summary: { rank: 0 },
        detail: { rank: 1 },
        ew: { rank: 2 },
        weather_iv: { rank: 3 },
        savings: { rank: 3 },
        baseline: { rank: 3 },
        performance: { rank: 4 },
      };
      const combinedData = {};

      for (const key in dataRanks) {
        if (dataRanks.hasOwnProperty(key)) {
          combinedData[key] = {
            value: facilityData.timeline[key],
            rank: dataRanks[key].rank,
          };
        }
      }
      const rankedStatuses: any = await this.addStatusWithRank(combinedData);
      const incentives = await IncentiveSettings.findOne({
        where: { facility_id: facilityId },
      });

      const finalStatus = {
        ...rankedStatuses,
        performance:
          userToken.role_id === userType.ENERVA_ADMIN
            ? rankedStatuses?.performance
            : incentives
            ? true
            : rankedStatuses?.performance,
      };

      facilityData.disabled = finalStatus;

      return ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        facilityData
      );
    } catch (error) {
      throw new Error("Failed to get current status of facility.");
    }
  }
  static async editStatusOfFacility(
    userToken: IUserToken,
    body: IBaseInterface,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const obj = {
        facility_id_general_status: Number(body.facility_id_general_status),
        updated_by: userToken.id,
        updated_at: new Date(),
      };
      const result = await Facility.update(obj, { where: { id: facilityId } });

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

  static async getFacilityNaicCode(
    userToken: IUserToken,
    facilityCategory: string,
    facilityType: string
  ): Promise<Facility[]> {
    try {
      let whereClause = {};

      if (facilityCategory && facilityType) {
        whereClause = {
          facility_category: facilityCategory,
          facility_type: facilityType,
        };
      } else if (facilityCategory) {
        whereClause = { facility_category: facilityCategory };
      } else if (facilityType) {
        whereClause = { facility_type: facilityType };
      } else {
        // Neither facilityCategory nor facilityType is present
      }

      const result = await FacilityNAIC.findAll({
        where: whereClause,
        order: [
          ["facility_category", "asc"],
          ["facility_type", "asc"],
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

  static async downloadFacilities(
    userToken: IUserToken,
    offset: number,
    limit: number,
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

      const result = await Facility.findAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[colName, order]],
        raw: true,
      });

      if (result) {
        const csvUrl = await saveCsvToFile(result, "facilitiesData");
        const resp = ResponseHandler.getResponse(
          HTTP_STATUS_CODES.SUCCESS,
          RESPONSE_MESSAGES.Success,
          csvUrl
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

  static async downloadFacilityById(
    userToken: IUserToken,
    facilityId: number
  ): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({
        where: { id: facilityId, is_active: STATUS.IS_ACTIVE },
      });
      const csvUrl = await saveCsvToFile([result.dataValues], "facilityData");
      const resp = ResponseHandler.getResponse(
        HTTP_STATUS_CODES.SUCCESS,
        RESPONSE_MESSAGES.Success,
        csvUrl
      );
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
