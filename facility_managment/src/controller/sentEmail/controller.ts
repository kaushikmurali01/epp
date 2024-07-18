import { EmailService } from "./service";
import { IEmailSentAttributes } from "../../interfaces/email-sent.interface";

export class EmailController {
  static async sendEmail(emailData: IEmailSentAttributes, decodedToken: any): Promise<IEmailSentAttributes> {
    return EmailService.sendEmail(emailData, decodedToken);
  }

  static async getEmailList(filter: string, decodedToken: any): Promise<IEmailSentAttributes[]> {
    return EmailService.getEmailList(filter, decodedToken);
  }
}