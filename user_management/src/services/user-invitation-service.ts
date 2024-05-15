import { UserInvitation } from '../models/user-invitation';
import { User } from '../models/user';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { Role } from '../models/role';
import { Company } from '../models/company';
import { Email } from './email';
import { EmailTemplate } from '../utils/emailTemplate';
import { EmailContent } from '../utils/emailContent';
import { CompanyService } from './companyService';
import { UserCompanyRole } from '../models/user-company-role';
import { UserCompanyRolePermission } from '../models/userCompanyRolePermission';

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
        const template = await EmailTemplate.getEmailTemplate();
        const existingUser = await User.findOne({ where: { email } });
        console.log("Existing User",existingUser);
       // await CompanyService.getCompanyAdmin(resp.company_id);
        let body:string, emailContent:string;
        let inviteEmailContent = EmailContent.invitationEmailForExistingUser.content
        .replace('#company#', "company name")
        .replace('#admin#', 'Admin name');
        if(existingUser) {
            emailContent =  template
           .replace('#name#', existingUser.first_name)
           .replace('#admin#', "Test Admin")
           .replace('#content#', EmailContent.invitationEmailForExistingUser.content);
           Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);
        } else {
           emailContent =  template
          .replace('#name#', "")
          .replace('#admin#', "Test Admin")
          .replace('#content#', EmailContent.invitationEmailForExistingUser.content);
          Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);
        }
       
        return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}


static async getUserInvitation(email:any, user_id:any): Promise<Object> {
  try {
   
    const invitationList:any = await UserInvitation.findAll({
        where: { email: email, is_active: 1 },
        include: [
            {
                model: Role,
                attributes: ['rolename']
            },
            {
                model: Company,
                attributes: ['company_name']
            }
        ]
    });

    

    // Transform data into the desired format
    const responseData = invitationList.map(invitation => ({
        email: invitation.email,
        company_name: invitation.Company.company_name,
        role: invitation.Role.rolename,
        role_id: invitation.role,
        company_id: invitation.company,
        user_id: user_id
    }));

    return responseData;

   
} catch (error) {
    // Return error response
    return {
        status: 500, // Internal Server Error status code
        body: `${error.message}`
    };
}
}

static async acceptUserInvitation(detail, resp): Promise<Object> {
  try {

    const invitationList:any = await UserInvitation.findOne({
      where: { email: resp.email }
  });

  console.log("Listing",invitationList.dataValues.permissions);

  await UserCompanyRole.destroy({
    where: {
        user_id: detail.user_id,
        company_id: detail.company_id
    }
});

   
    await UserCompanyRole.create({
      user_id: detail.user_id,
      company_id: detail.company_id,
      role_id: detail.role_id,
      is_active: 1, 
      status: 'accepted'
  });

  await UserCompanyRolePermission.destroy({
    where: {
        user_id: detail.user_id,
        company_id: detail.company_id
    }
});
console.log("invitationPermissions",invitationList.permissions);
  for (const permission of invitationList.permissions) {
    await UserCompanyRolePermission.create({
        role_id: detail.role_id, 
        permission_id: permission,
        company_id: detail.company_id,
        user_id: detail.user_id
    });
}

await UserInvitation.update({ is_active: 0 }, { where: { email: resp.email, company:detail.company_id } });
if(detail.company_id) {
await User.update({ type: 1 }, { where: { id: detail.user_id} });
} else {
  await User.update({ type: 2 }, { where: { id: detail.user_id} });
}




return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };



   
} catch (error) {
    // Return error response
    return {
        status: 500, // Internal Server Error status code
        body: `${error.message}`
    };
}
}
}



export { UserInvitationService };
