import { EmailTemplate } from "../../models/emailTemplate.model";
import { IEmailTemplateAttributes } from "../../interfaces/emailTemplate.interface";
import { EnergyEmailTemplate } from "../../utils/email-templates";
import { AdminFacilityService } from "../admin/admin-facility/service";
import { Facility } from "../../models/facility.model";
import { Company } from "../../models/company.model";
import { FacilitySavePerformance } from "../../models/facility_save_performance.model";
import { PERFORMANCE_TYPE } from "../../utils/status";
import moment from "moment";
import { IncentiveSettings } from "../../models/incentiveSettings.model";
import { Baseline } from "../../models/facility_baseline.model";
import { FACILITY_METER_TYPE } from "../../utils/facility-status";
import { User } from "../../models/user.model";
import { IIncentiveSettingsAttributes } from "../../interfaces/incentiveSettings.interface";
import { Op } from "sequelize";
import { EmailService } from "../sentEmail/service";
export class EmailTemplateController {
  static async createEmailTemplate(
    data: Partial<IEmailTemplateAttributes>,
    userId: number
  ): Promise<IEmailTemplateAttributes> {
    const emailTemplate = await EmailTemplate.create({
      ...data,
      created_by: userId,
    });
    return emailTemplate.toJSON();
  }

  static async updateEmailTemplate(
    id: number,
    data: Partial<IEmailTemplateAttributes>,
    userId: number
  ): Promise<IEmailTemplateAttributes | null> {
    const [updated] = await EmailTemplate.update(
      {
        ...data,
        updated_by: userId,
        updated_at: new Date(),
      },
      { where: { id } }
    );
    if (updated) {
      const updatedTemplate = await EmailTemplate.findByPk(id);
      return updatedTemplate?.toJSON() || null;
    }
    return null;
  }

  static async sendEmailFromCron(): Promise<IIncentiveSettingsAttributes[]> {
    const findP4pEndDate1 = await IncentiveSettings.findAll({
      where: {
        p4pEndDate1: {
          [Op.eq]: moment().format("YYYY-MM-DD"),
        },
      },
    });
    const findP4pEndDate2 = await IncentiveSettings.findAll({
      where: {
        p4pEndDate2: {
          [Op.eq]: moment().format("YYYY-MM-DD"),
        },
      },
    });
    const findP4pEndDate3 = await IncentiveSettings.findAll({
      where: {
        p4pEndDate3: {
          [Op.eq]: moment().format("YYYY-MM-DD"),
        },
      },
    });

    for (let i = 0; i < findP4pEndDate1.length; i++) {
      let template: string, to, cc, subject;
      let emails: any;
      let findFacility = await Facility.findOne({
        where: { id: findP4pEndDate1[i].facility_id },
      });
      emails = await AdminFacilityService.forToAndCC(
        findP4pEndDate1[i].facility_id,
        false
      );
      subject = "SAVINGS SUBMISSION REMINDER – 30 DAYS";
      template = await EnergyEmailTemplate.savingSubmmissionReminder30Days();
      template = template
        .replace(
          "#facility_address#",
          `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
        )
        .replace("#facility_identifier#", findFacility.facility_ubi)
        .replace(
          "#from_date#",
          moment(findP4pEndDate1[i]?.p4pStartDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#to_date#",
          moment(findP4pEndDate1[i]?.p4pEndDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#deadline#",
          moment(findP4pEndDate1[i]?.p4pEndDate1)
            .add(1, "M")
            .format("MMMM D, YYYY")
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
          created_by: findP4pEndDate1[i].created_by,
          id: null,
        },
        { id: findP4pEndDate1[i].created_by }
      );
    }
    for (let i = 0; i < findP4pEndDate2.length; i++) {
      let template: string, to, cc, subject;
      let emails: any;
      let findFacility = await Facility.findOne({
        where: { id: findP4pEndDate2[i].facility_id },
      });
      emails = await AdminFacilityService.forToAndCC(
        findP4pEndDate2[i].facility_id,
        false
      );
      subject = "SAVINGS SUBMISSION REMINDER – 30 DAYS";
      template = await EnergyEmailTemplate.savingSubmmissionReminder30Days();
      template = template
        .replace(
          "#facility_address#",
          `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
        )
        .replace("#facility_identifier#", findFacility.facility_ubi)
        .replace(
          "#from_date#",
          moment(findP4pEndDate2[i]?.p4pStartDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#to_date#",
          moment(findP4pEndDate2[i]?.p4pEndDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#deadline#",
          moment(findP4pEndDate2[i]?.p4pEndDate1)
            .add(1, "M")
            .format("MMMM D, YYYY")
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
          created_by: findP4pEndDate2[i].created_by,
          id: null,
        },
        { id: findP4pEndDate2[i].created_by }
      );
    }
    for (let i = 0; i < findP4pEndDate3.length; i++) {
      let template: string, to, cc, subject;
      let emails: any;
      let findFacility = await Facility.findOne({
        where: { id: findP4pEndDate3[i].facility_id },
      });
      emails = await AdminFacilityService.forToAndCC(
        findP4pEndDate3[i].facility_id,
        false
      );
      subject = "SAVINGS SUBMISSION REMINDER – 30 DAYS";
      template = await EnergyEmailTemplate.savingSubmmissionReminder30Days();
      template = template
        .replace(
          "#facility_address#",
          `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
        )
        .replace("#facility_identifier#", findFacility.facility_ubi)
        .replace(
          "#from_date#",
          moment(findP4pEndDate3[i]?.p4pStartDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#to_date#",
          moment(findP4pEndDate3[i]?.p4pEndDate1).format("MMMM D, YYYY")
        )
        .replace(
          "#deadline#",
          moment(findP4pEndDate3[i]?.p4pEndDate1)
            .add(1, "M")
            .format("MMMM D, YYYY")
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
          created_by: findP4pEndDate2[i].created_by,
          id: null,
        },
        { id: findP4pEndDate2[i].created_by }
      );
    }
    return findP4pEndDate1;
  }
  static async deleteEmailTemplate(id: number): Promise<boolean> {
    const deleted = await EmailTemplate.destroy({ where: { id } });
    return deleted > 0;
  }

  static async getEmailTemplatesByFacilityId(
    facilityId: number
  ): Promise<IEmailTemplateAttributes[] | any> {
    const templates = await EmailTemplate.findAll({
      where: { facility_id: facilityId },
    });
    let is_added = [
      {
        id: null,
        facility_id: null,
        name: "Signed Participant Agreement",
        temp_name: "Signed_Participants",
        subject: "SIGNED PARTICIPANT AGREEMENT ACKNOWLEDGMENT",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Baseline Model Approval by Enerva",
        temp_name: "Notice_Of_Approval",
        subject: "NOTICE OF APPROVAL",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "P4P Energy Savings Calculation and Incentive Approval",
        temp_name: "First_Saving_Report",
        subject: "FIRST SAVINGS REPORT COMPLETE",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Baseline Model Submission by User",
        temp_name: "Send_Acknowledgement",
        subject: "APPLICATION ACKNOWLEDGMENT",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Information Request",
        temp_name: "SAVINGS_SUBMISSION_INFORMATION_REQUEST",
        subject: "SAVINGS SUBMISSION INFORMATION REQUEST",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "P4P Data Submission by User",
        temp_name: "SAVINGS_SUBMISSION_ACKNOWLEDGMENT",
        subject: "SAVINGS SUBMISSION ACKNOWLEDGMENT",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Application Rejected by Enerva",
        temp_name: "APPLICATION_NOT_APPROVED",
        subject: "APPLICATION NOT APPROVED",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Baseline Model Rejected by Enerva",
        temp_name: "APPLICATION_INFORMATION_REQUEST",
        subject: "APPLICATION INFORMATION REQUEST",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Saving Submission Reminder 30 days",
        temp_name: "SAVINGS_SUBMISSION_REMINDER_30_DAYS",
        subject: "SAVINGS SUBMISSION REMINDER – 30 DAYS",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
      {
        id: null,
        facility_id: null,
        name: "Saving Submission Reminder",
        temp_name: "SAVINGS_SUBMISSION_REMINDER",
        subject: "SAVINGS SUBMISSION REMINDER",
        body: "",
        is_user_added: true,
        created_at: "2024-10-17T06:51:41.084Z",
        updated_at: "2024-10-17T06:51:41.084Z",
        created_by: null,
        updated_by: null,
        createdAt: "2024-10-17T06:51:41.084Z",
        updatedAt: "2024-10-17T06:51:41.084Z",
      },
    ];
    templates.map((template) => template.toJSON());
    return [...is_added, ...templates];
  }

  static async getEmailTemplatesSubjectAndBody(
    facilityId: number
  ): Promise<Pick<IEmailTemplateAttributes, "subject" | "body">[]> {
    const templates = await EmailTemplate.findAll({
      attributes: ["subject", "body"],
      where: { facility_id: facilityId },
    });
    return templates.map((template) => ({
      subject: template.subject,
      body: template.body,
    }));
  }
  static async getEmailDynamicTemplate(
    userToken: any,
    facilityId: number,
    template_name: string
  ): Promise<any> {
    let template: string, to, cc, subject;
    let findFacility = await Facility.findOne({ where: { id: facilityId } });
    const companyDetails = await Company.findOne({
      where: { id: findFacility?.company_id || 1 },
    });
    let findUsers = await User.findOne({ where: { id: userToken.id } });
    let findIncentiveSettings = await IncentiveSettings.findOne({
      where: { facility_id: facilityId },
    });
    let findEmail;
    let emails: any;
    switch (template_name) {
      case "Signed_Participants":
        emails = await AdminFacilityService.forToAndCC(
          findFacility?.company_id || 1,
          true
        );
        subject = "SIGNED PARTICIPANT AGREEMENT ACKNOWLEDGMENT";
        template =
          await EnergyEmailTemplate.getSignedParticipantEmailTemplate();
        template = template.replace(
          "#company_name#",
          companyDetails?.company_name
        );
        to = emails[0];
        cc = [];
        break;
      case "Send_Acknowledgement":
        subject = "APPLICATION ACKNOWLEDGMENT";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template =
          await EnergyEmailTemplate.getApplicationAcknowledgementEmailTemplate();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi);
        to = emails[0];
        cc = emails[1];
        break;
      case "SAVINGS_SUBMISSION_INFORMATION_REQUEST":
        subject = "SAVINGS SUBMISSION INFORMATION REQUEST";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.subbmissionInfoRequest();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace("#facility_name#", findFacility.facility_name)
          .replace("#first_name#", findUsers.first_name)
          .replace("#last_name#", findUsers.last_name)
          .replace("#email#", findUsers.email);
        to = emails[0];
        cc = emails[1];
        break;
      case "SAVINGS_SUBMISSION_ACKNOWLEDGMENT":
        subject = "SAVINGS SUBMISSION ACKNOWLEDGMENT";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.submissionAcknowledge();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi);
        to = emails[0];
        cc = emails[1];
        break;
      case "APPLICATION_NOT_APPROVED":
        subject = "APPLICATION NOT APPROVED";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.applicationNotApproved();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace("#first_name#", findUsers.first_name);
        to = emails[0];
        cc = emails[1];
        break;
      case "APPLICATION_INFORMATION_REQUEST":
        subject = "APPLICATION INFORMATION REQUEST";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.applicationInfoRequest();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace("#first_name#", findUsers.first_name)
          .replace("#last_name#", findUsers.last_name)
          .replace("#email#", findUsers.email);
        to = emails[0];
        cc = emails[1];
        break;
      case "SAVINGS_SUBMISSION_REMINDER":
        subject = "SAVINGS SUBMISSION REMINDER";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.savingSubmmissionReminder();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace(
            "#from_date#",
            moment(findIncentiveSettings?.p4pStartDate1).format("MMMM D, YYYY")
          )
          .replace(
            "#to_date#",
            moment(findIncentiveSettings?.p4pEndDate1).format("MMMM D, YYYY")
          )
          .replace(
            "#deadline#",
            moment(findIncentiveSettings?.p4pEndDate1)
              .add(1, "M")
              .format("MMMM D, YYYY")
          );
        to = emails[0];
        cc = emails[1];
        break;
      case "SAVINGS_SUBMISSION_REMINDER_30_DAYS":
        subject = "SAVINGS SUBMISSION REMINDER – 30 DAYS";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        template = await EnergyEmailTemplate.savingSubmmissionReminder30Days();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace(
            "#from_date#",
            moment(findIncentiveSettings?.p4pStartDate1).format("MMMM D, YYYY")
          )
          .replace(
            "#to_date#",
            moment(findIncentiveSettings?.p4pEndDate1).format("MMMM D, YYYY")
          )
          .replace(
            "#deadline#",
            moment(findIncentiveSettings?.p4pEndDate1)
              .add(1, "M")
              .format("MMMM D, YYYY")
          );
        to = emails[0];
        cc = emails[1];
        break;
      case "First_Saving_Report":
        subject = "FIRST SAVINGS REPORT COMPLETE";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        let findSavingData: any = await FacilitySavePerformance.findOne({
          where: {
            facility_id: facilityId,
            performance_type: PERFORMANCE_TYPE.p4p1,
          }, // for 1stp4p
        });
        let incentive = await IncentiveSettings.findOne({
          where: { facility_id: facilityId },
        });
        template =
          await EnergyEmailTemplate.getFirstSavingsReportCompleteEmailTemplate();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace(
            "#onpeak_electricity_saving_submitted#",
            findSavingData?.parameter_data?.on_peak_energy_savings?.value || 0
          )
          .replace(
            "#offpeak_electricity_saving_submitted#",
            findSavingData?.parameter_data?.off_peak_energy_savings?.value || 0
          )
          .replace(
            "#onpeak_electricity_saving_approved#",
            findSavingData?.parameter_data?.on_peak_energy_savings?.value || 0
          )
          .replace(
            "#offpeak_electricity_saving_approved#",
            findSavingData?.parameter_data?.off_peak_energy_savings?.value || 0
          )
          .replace(
            "#on_peak_electricity_saving_approved#",
            findSavingData?.parameter_data?.on_peak_energy_savings?.value || 0
          )
          .replace(
            "#off_peak_electricity_saving_approved#",
            findSavingData?.parameter_data?.off_peak_energy_savings?.value || 0
          )
          .replace(
            "#missing_data_removed_from#",
            moment().subtract(1, "year").format("MMM DD, YYYY")
          )
          .replace("#missing_data_removed_to#", moment().format("MMM DD, YYYY"))
          .replace(
            "#on_peak_electricity_savings_incentive#",
            findSavingData?.parameter_data?.on_peak_energy_savings_incentive
              ?.value || 0
          )
          .replace(
            "#off_peak_electricity_savings_incentive#",
            findSavingData?.parameter_data?.off_peak_energy_savings_incentive
              ?.value || 0
          )
          .replace(
            "#paid_pre_project_incentive#",
            `$${incentive.preProjectIncentive}`
          )
          .replace(
            "#total_performance_incentive#",
            `$${findSavingData.parameter_data?.total_energy_savings?.value}` ||
              `${0}`
          );
        to = emails[0];
        cc = emails[1];
        break;
      case "Notice_Of_Approval":
        subject = "NOTICE OF APPROVAL";
        emails = await AdminFacilityService.forToAndCC(facilityId, false);
        let findUser = await User.findOne({ where: { email: emails[0] } });
        let baselineData: any = await Baseline.findOne({
          where: {
            facility_id: facilityId,
            meter_type: FACILITY_METER_TYPE.ELECTRICITY,
          },
        });
        let incentives: any = await IncentiveSettings.findOne({
          where: { facility_id: facilityId },
        });
        template = await EnergyEmailTemplate.getNoticeOfApprovalEmailTemplate();
        template = template
          .replace(
            "#facility_address#",
            `${findFacility.street_number},${findFacility.street_name},${findFacility.city},${findFacility.country},${findFacility.postal_code}`
          )
          .replace("#facility_identifier#", findFacility.facility_ubi)
          .replace("#facility_type#", findFacility.facility_type)
          .replace(
            "#pre_project_incentive#",
            `$${incentives.preProjectIncentive}`
          )
          .replace("#baseline_energy_model#", "default model")
          .replace(
            "#annual_incentive_cap_for_electricity_savings#",
            `$${incentives.incentive_cap}` || `$${0}`
          )
          .replace("#month#", moment().format("MMMM"))
          .replace("#day#", moment().format("D"))
          .replace("#year#", moment().format("YYYY"))
          .replace(
            "#Month#",
            moment(findIncentiveSettings?.p4pEndDate1).format("MMMM")
          )
          .replace(
            "#Day#",
            moment(findIncentiveSettings?.p4pEndDate1).format("D")
          )
          .replace(
            "#Year#",
            moment(findIncentiveSettings?.p4pEndDate1).format("YYYY")
          )
          .replace(
            "#baseline_start_date#",
            baselineData?.parameter_data?.start_date || 0
          )
          .replace(
            "#baseline_end_date#",
            baselineData?.parameter_data?.end_date || 0
          )
          .replace(
            "#baseline_energy_consumption#",
            `${baselineData.baseline_energy_consumption || 0}Kwh` || `0Kwh`
          )
          .replace("#participant_first_name#", findUser.first_name)
          .replace(
            "#legal_name_of_applicant#",
            findUser.first_name + " " + findUser.last_name
          )
          .replace("#participant_on_behalf#", findUser.first_name)
          .replace("#participant_on_behalf2#", findUser.first_name);
        to = emails[0];
        cc = emails[1];
        break;
      default:
        break;
    }
    return { subject, body: template, to, cc };
  }
}
