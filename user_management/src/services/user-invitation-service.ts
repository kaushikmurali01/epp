import { UserInvitation } from '../models/user-invitation';
import { User } from '../models/user';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { Role } from '../models/role';
import { Company } from '../models/company';
import { Email } from './email';
import { EmailTemplate } from '../utils/emailTemplate';
import { EmailContent } from '../utils/emailContent';

class UserInvitationService {
  /**
   * Retrieves all user invitations from the database along with user data for the created_by and updated_by fields.
   * 
   * @returns Promise<Response> - A promise resolving to a response containing all user invitations along with user data for created_by and updated_by.
   * @description Retrieves all user invitations from the database along with user data for the created_by and updated_by fields.
   */
  static async getAllInvitationsWithUserData(offset, limit): Promise<Object> {
    try {
      return await UserInvitation.findAll({
        offset: offset,
        limit: limit,
        include: [
          {
              model: Role,
              attributes: ['rolename'] 
          },
          {
            model: Company,
            attributes: ['company_name'] 
        }
      ],
      raw: true 
    });
    } catch (error) {
      throw new Error(`Failed to fetch user invitations: ${error.message}`);
    }
  }
  static async sendInvitation(details:any, resp:any): Promise<Response> {
    try {
        const email = details.email;
        details.company = resp.company_id;
        const invitation = await UserInvitation.create(details);
        const template = await EmailTemplate.getCommonTemplate();
        const existingUser = await User.findOne({ where: { email } });
       // console.log("user001", existingUser.first_name);
        let body:string;
        if(existingUser) {
          const emailCOntent =  EmailContent.invitationEmailForExistingUser.content
           .replace('#user#', existingUser.first_name)
          .replace('#admin#', "Test Admin");
           body = template.replace('#content#', emailCOntent);
           Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, body);
        } else {
          body = template.replace('#content#', EmailContent.invitationEmailForExistingUser.content);
          Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, body);
        }
       
        return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}
}



export { UserInvitationService };
