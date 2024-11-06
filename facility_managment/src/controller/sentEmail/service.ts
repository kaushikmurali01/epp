import { Email } from "../../helper/email-sender.helper";
import { EmailSent } from "../../models/email-sent.model";
import { IEmailSentAttributes } from "../../interfaces/email-sent.interface";

export class EmailService {
  static async sendEmail(
    emailData: IEmailSentAttributes,
    decodedToken: any
  ): Promise<any> {
    try {
      // Send email
      await Email.send(
        emailData.to,
        emailData.subject,
        emailData.body,
        emailData.cc || ""
      );

      // Store email details in the database
      if (emailData?.facility_id) {
        const sentEmail = await EmailSent.create({
          ...emailData,
          created_by: decodedToken.id,
          is_system_generated: emailData.is_system_generated || false,
        });
        return sentEmail.toJSON();
      }
      return true
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  static async getEmailList(
    filter: string,
    decodedToken: any,
    offset: number,
    limit: number
  ): Promise<any> {
    try {
      let whereClause = {};

      switch (filter) {
        case "user":
          whereClause = {
            is_system_generated: false,
          };
          break;
        case "system":
          whereClause = { is_system_generated: true };
          break;
        case "all":
        default:
          break;
      }

      const emails = await EmailSent.findAndCountAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
        offset: offset || 0,
        limit: limit || 10,
      });

      return emails;
    } catch (error) {
      throw new Error(`Failed to fetch email list: ${error.message}`);
    }
  }
}
