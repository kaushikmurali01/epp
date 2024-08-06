import { Email } from "../../helper/email-sender.helper";
import { EmailSent } from "../../models/email-sent.model";
import { IEmailSentAttributes } from "../../interfaces/email-sent.interface";
import { Op } from "sequelize";

export class EmailService {
  static async sendEmail(
    emailData: IEmailSentAttributes,
    decodedToken: any
  ): Promise<IEmailSentAttributes> {
    try {
      // Send email
      await Email.send(
        emailData.to,
        emailData.subject,
        emailData.body,
        emailData.cc
      );

      // Store email details in the database
      const sentEmail = await EmailSent.create({
        ...emailData,
        created_by: decodedToken.id,
        is_system_generated: false,
      });

      return sentEmail.toJSON();
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  static async getEmailList(
    filter: string,
    decodedToken: any
  ): Promise<IEmailSentAttributes[]> {
    try {
      let whereClause = {};

      switch (filter) {
        case "user":
          whereClause = {
            created_by: decodedToken.userId,
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

      const emails = await EmailSent.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });

      return emails.map((email) => email.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch email list: ${error.message}`);
    }
  }
}
