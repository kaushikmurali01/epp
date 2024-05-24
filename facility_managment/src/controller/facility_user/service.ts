import { IUserToken } from '../../interfaces/usertoken.interface';
import { ResponseHandler } from '../../utils/response-handler';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES, STATUS, userType} from '../../utils/status';
import { FACILITY_APPROVAL_STATUS, FACILITY_ID_GENERAL_STATUS, FACILITY_ID_SUBMISSION_STATUS } from '../../utils/facility-status';
import { Facility } from '../../models/facility.model';
import { IBaseInterface } from '../../interfaces/baseline.interface';
import { Op } from 'sequelize';
import { FacilityNAIC } from '../../models/facility_naic.model';
import { getEmailTemplate } from '../../helper/mail-template.helper';
import { EmailContent, adminDetails } from '../../utils/email-content';
import { User } from '../../models/user.model';
import { Company } from '../../models/company.model';
import { Email } from '../../helper/email-sender.helper';
import { saveCsvToFile } from '../../helper/download-csv-from-json.helper';
import { UserCompanyRole } from '../../models/user-company-role';
import { UserResourceFacilityPermission } from '../../models/user-resource-permission';


export class FacilityService {


  static async getFacility(userToken: IUserToken | any, offset: number, limit: number, colName: string, order: string, searchPromt: string, companyId: number): Promise<Facility[]> {

    try {
      let findRole: any = {}
      if (companyId) {
        findRole = await UserCompanyRole.findOne({ where: { user_id: userToken.id, company_id: companyId } })
      } else {
        findRole.role_id = userToken.type
      }
      let result;
      if (userToken && (findRole.role_id === userType.ADMIN || findRole.role_id === userType.SUPER_ADMIN)) {
        result = await Facility.findAndCountAll({
          where: {
            company_id: companyId,
            is_active: STATUS.IS_ACTIVE,
            [Op.or]: [
              { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
              { street_number: { [Op.iLike]: `%${searchPromt}%` } },
              { street_name: { [Op.iLike]: `%${searchPromt}%` } },
              { city: { [Op.iLike]: `%${searchPromt}%` } },
              { country: { [Op.iLike]: `%${searchPromt}%` } }
            ]
          },
          offset: offset,
          limit: limit,
          order: [[colName, order]]
        });
      } else {
        let findPermission = await UserResourceFacilityPermission.findAll({ where: { company_id: companyId, email: userToken?.email } })
        let allFacilityId = findPermission.map(ele => ele.facility_id)
        result = await Facility.findAndCountAll({
          where: {
            company_id: companyId,
            is_active: STATUS.IS_ACTIVE,
            // [Op.or]: [
            //   {
            //     id: {
            //       [Op.in]: allFacilityId,
            //     }
            //   },
            //   { created_by: userToken.id },
            //   { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
            //   { street_number: { [Op.iLike]: `%${searchPromt}%` } },
            //   { street_name: { [Op.iLike]: `%${searchPromt}%` } },
            //   { city: { [Op.iLike]: `%${searchPromt}%` } },
            //   { country: { [Op.iLike]: `%${searchPromt}%` } }
            // ]
            [Op.and]: [
              {
                [Op.or]: [
                  { id: { [Op.in]: allFacilityId } },
                  { created_by: userToken.id }
                ]
              },
              {
                [Op.or]: [
                  { facility_name: { [Op.iLike]: `%${searchPromt}%` } },
                  { street_number: { [Op.iLike]: `%${searchPromt}%` } },
                  { street_name: { [Op.iLike]: `%${searchPromt}%` } },
                  { city: { [Op.iLike]: `%${searchPromt}%` } },
                  { country: { [Op.iLike]: `%${searchPromt}%` } }
                ]
              }
            ]
          },
          offset: offset,
          limit: limit,
          order: [[colName, order]]
        });

      }


      if (result) {
        const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
        return resp;
      } else {
        const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.noContent, []);
        return resp;
      }


    } catch (error) {
      throw error;

    }

  }

  static async getFacilityById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }

  static async createFacility(userToken: IUserToken, body:IBaseInterface): Promise<Facility[]> {
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
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.DRAFT),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        created_by: userToken.id,
        updated_by: userToken.id
      };
      const result = await Facility.create(obj);
     
      return ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
    } catch (error) {
      throw error;
    }

  }

  static async editFacility(userToken: IUserToken, body:IBaseInterface, facilityId:number): Promise<Facility[]> {
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
        sector: body.sector,
        year_of_construction: body.year_of_construction,
        gross_floor_area: body.gross_floor_area,
        number_of_storeys: body.number_of_storeys,
        occupancy: body.occupancy,
        number_of_building: body.number_of_building,
        company_id: body.company_id,
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.DRAFT),
        facility_id_submission_status: Number(FACILITY_ID_SUBMISSION_STATUS.DRAFT),
        ng_distribution_company: body.ng_distribution_company,
        ng_distribution_company_data_extraction:body.ng_distribution_company_data_extraction,
        longitude: body.longitude,
        latitude: body.latitude,
        facility_bas: body.facility_bas,
        facility_bas_connectivity: body.facility_bas_connectivity,
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: STATUS.IS_ACTIVE,
        updated_by: userToken.id,
        updated_at : new Date()
        };
      const result = await Facility.update(obj,{where:{id:facilityId}})
  
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async deleteFacility(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.update({is_active:STATUS.IS_DELETED} ,{where:{id:facilityId}})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error
      
    }
   
  }
  
  static async submitForapprovalByUser(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {

     
      
      const obj = {
        facility_id_submission_status: FACILITY_ID_SUBMISSION_STATUS.SUBMITTED,
        facility_id_general_status: FACILITY_ID_GENERAL_STATUS.SUBMIT_FACILITY, 
        is_approved: Boolean(FACILITY_APPROVAL_STATUS.INITIAL),
        is_active: Number(STATUS.IS_ACTIVE),
      }
      const result = await Facility.update(obj,{where:{id:facilityId}})
      if(result){
        const facilityDetails = await Facility.findOne({where: { id: facilityId } })
        const companyDetails = await Company.findOne({ where: { id: facilityDetails.company_id}})
        const userDetails = await User.findOne({ where: { id: userToken.id } });
        
        if(userDetails.email){
          const template = await getEmailTemplate();

          // const usernameRegEx = new RegExp('#userName#', "g");
 
          let userEmailContent =  template
            .replace('#heading#', EmailContent.facilityCreatedForUser.title)
            .replace('#content#', EmailContent.facilityCreatedForUser.content)
            .replace('#userName#', userDetails ? userDetails?.first_name : 'User')
            .replace('#facilityName#', facilityDetails?.facility_name ? facilityDetails.facility_name : "Facility")
            .replace('#companyName#', companyDetails ? companyDetails?.company_name : "Company");
          
          let adminEmailContent =  template
            .replace('#heading#', EmailContent.facilityCreatedForAdmin.title)
            .replace('#content#', EmailContent.facilityCreatedForAdmin.content)
            .replace('#adminName#',  adminDetails.adminName ? adminDetails.adminName: 'Admin')
            // .replace(usernameRegEx, userDetails ? userDetails?.first_name : 'User')
            .replace('#facilityName#', facilityDetails?.facility_name ? facilityDetails.facility_name : "Facility")
            .replace('#companyName#', companyDetails ? companyDetails?.company_name : "Company");
  
          Email.send(userDetails.email, EmailContent.facilityCreatedForUser.title, userEmailContent);
          Email.send(adminDetails.adminEmail, EmailContent.facilityCreatedForAdmin.title, adminEmailContent);

        }
       

      }
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
   
  }

  static async getCurrentStatusOfFacility(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      
      const result = await Facility.findOne({where:{id:facilityId}, attributes: ['id', 'naic_code', 'facility_id_general_status']})
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async editStatusOfFacility(userToken: IUserToken, body:IBaseInterface, facilityId:number): Promise<Facility[]> {
    try {
      const obj = {
        facility_id_general_status: Number(body.facility_id_general_status),
        updated_by: userToken.id,
        updated_at : new Date()
        };
      const result =  await Facility.update(obj,{where:{id:facilityId}} )
  
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
      
    } catch (error) {
      throw error;
    }
   
  }

  static async getFacilityNaicCode(userToken: IUserToken, facilityCategory:string, facilityType:string): Promise<Facility[]> {
    try {
      
      let whereClause = {};

      if (facilityCategory && facilityType) {
          whereClause = { facility_category: facilityCategory, facility_type: facilityType };
      } else if (facilityCategory) {
          whereClause = { facility_category: facilityCategory };
      } else if (facilityType) {
          whereClause = { facility_type: facilityType };
      } else {
          // Neither facilityCategory nor facilityType is present
      }
      
      const result = await FacilityNAIC.findAll({ where: whereClause });
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, result);
      return resp;
    } catch (error) {
      throw error;
      
    }
  }

  static async downloadFacilities(userToken: IUserToken, offset:number, limit:number, colName:string, order:string, searchPromt:string, companyId:number): Promise<Facility[]> {

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

  static async downloadFacilityById(userToken: IUserToken, facilityId:number): Promise<Facility[]> {
    try {
      const result = await Facility.findOne({where:{id:facilityId, is_active: STATUS.IS_ACTIVE}})
      const csvUrl = await saveCsvToFile([result.dataValues], "facilityData")
      
      const resp = ResponseHandler.getResponse(HTTP_STATUS_CODES.SUCCESS, RESPONSE_MESSAGES.Success, csvUrl);
      return resp;
      
    } catch (error) {
      throw error;
      
    }
   
  }

  
 
  
}