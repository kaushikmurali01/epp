import {
  HTTP_STATUS_CODES,
  RESPONSE_MESSAGES,
  STATUS,
} from "../../../utils/status";
import { ResponseHandler } from "../../../utils/response-handler";
import { Facility } from "../../../models/facility.model";
import { HttpRequest } from "@azure/functions";
import { IBaseInterface } from "../../../interfaces/baseline.interface";
import { decodeToken } from "../../../helper/authantication.helper";
import { IUserToken } from "../../../interfaces/usertoken.interface";
import {
  FACILITY_APPROVAL_STATUS,
  FACILITY_ID_GENERAL_STATUS,
  FACILITY_ID_SUBMISSION_STATUS,
} from "../../../utils/facility-status";
import { Company } from "../../../models/company.model";
import { ParticipantAgreement } from "../../../models/participant_agreement.model";
import { User } from "../../../models/user.model";
import { creatSignDocumentUrlForUser } from "../../../helper/create-doc.helper";
import { Op } from "sequelize";
import { EmailContent, adminDetails } from "../../../utils/email-content";
import { getEmailTemplate } from "../../../helper/mail-template.helper";
import { Email } from "../../../helper/email-sender.helper";

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
        facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY),
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
      if (body.company_id) {
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
          facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY),
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
          facility_id_general_status: Number(FACILITY_ID_GENERAL_STATUS.CREATE_FACILIY),
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

  static async signPaById(
    userToken: IUserToken,
    body: IBaseInterface,
    companyId: number
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
            const bindingAuthorityDetails = {
             // name: "Enerva Test Binding Authority",
              name: userDetails?.first_name
            };
            const version = "V1";

            if (userDetails.email) {
              const template = await getEmailTemplate();
              let userEmailContent = template
                .replace("#heading#", EmailContent.paCreatedForCompany.title)
                .replace("#content#", EmailContent.paCreatedForCompany.content)
                .replace(
                  "#userName#",
                  userDetails ? userDetails?.first_name : "User"
                )
                .replace(
                  "#bindingAuthority#",
                  bindingAuthorityDetails
                    ? bindingAuthorityDetails?.name
                    : "Binding Authority"
                )
                .replace("#version#", version ? version : "version")
                .replace(
                  "#companyName#",
                  companyDetails ? companyDetails?.company_name : "Company"
                );

              let adminEmailContent = template
                .replace("#heading#", EmailContent.paCreatedForAdmin.title)
                .replace("#content#", EmailContent.paCreatedForAdmin.content)
                .replace(
                  "#adminName#",
                  adminDetails.adminName ? adminDetails.adminName : "Admin"
                )
                // .replace('#userName#', userDetails ? userDetails?.first_name : 'User')
                .replace(
                  "#bindingAuthority#",
                  userDetails ? userDetails?.first_name : "Binding Authority"
                )
                .replace("#version#", version ? version : "version")
                .replace(
                  "#companyName#",
                  companyDetails ? companyDetails?.company_name : "Company"
                );

              Email.send(
                userDetails.email,
                EmailContent.paCreatedForCompany.title,
                userEmailContent
              );
              Email.send(
                adminDetails.adminEmail,
                EmailContent.paCreatedForAdmin.title,
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

          if (result) {
            const userDetails = await User.findOne({
              where: { id: userToken.id },
            });
            const companyDetails = await Company.findOne({
              where: { id: companyId },
            });
            const bindingAuthorityDetails = {
              //name: "Enerva Test Binding Authority",
              name: userDetails?.first_name
            };
            const version = "V1";

            if (userDetails.email) {
              const template = await getEmailTemplate();
              let userEmailContent = template
                .replace("#heading#", EmailContent.paCreatedForCompany.title)
                .replace("#content#", EmailContent.paCreatedForCompany.content)
                .replace(
                  "#userName#",
                  userDetails ? userDetails?.first_name : "User"
                )
                .replace(
                  "#bindingAuthority#",
                  bindingAuthorityDetails
                    ? bindingAuthorityDetails?.name
                    : "Binding Authority"
                )
                .replace("#version#", version ? version : "version")
                .replace(
                  "#companyName#",
                  companyDetails ? companyDetails?.company_name : "Company"
                );

              let adminEmailContent = template
                .replace("#heading#", EmailContent.paCreatedForAdmin.title)
                .replace("#content#", EmailContent.paCreatedForAdmin.content)
                .replace(
                  "#adminName#",
                  adminDetails.adminName ? adminDetails.adminName : "Admin"
                )
                // .replace('#userName#', userDetails ? userDetails?.first_name : 'User')
                .replace(
                  "#bindingAuthority#",
                  userDetails ? userDetails?.first_name : "Binding Authority"
                )
                .replace("#version#", version ? version : "version")
                .replace(
                  "#companyName#",
                  companyDetails ? companyDetails?.company_name : "Company"
                );

              Email.send(
                userDetails.email,
                EmailContent.paCreatedForCompany.title,
                userEmailContent
              );
              Email.send(
                adminDetails.adminEmail,
                EmailContent.paCreatedForAdmin.title,
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
