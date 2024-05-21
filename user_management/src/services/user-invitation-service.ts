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
  static async sendInvitation(details: any, resp: any): Promise<Response> {
    try {
        const { email, company, type } = details;
        await UserInvitation.create(details);
        const template = await EmailTemplate.getEmailTemplate();
        const existingUser = await User.findOne({ where: { email } });

        let admin_name = "";
        let company_name = "";
        if (company && type == 2) {
            const companyAdmin = await CompanyService.getCompanyAdmin(company);
            admin_name = `${companyAdmin?.first_name} ${companyAdmin?.last_name}`;
            company_name = companyAdmin?.dataValues?.company_name;
        }

        const landing_page = process.env.LANDING_PAGE;
        const sendEmail = async (content: string, subject: string, recipient: string) => {
            const emailContent = template.replace('#content#', content)
                                         .replace('#name#', existingUser?.first_name || "")
                                         .replace('#admin#', admin_name || "Enerva Admin")
                                         .replace('#heading#', '')
                                         .replace('#link#', landing_page)
                                         .replace('#company#', company_name || "Enerva")
                                         .replace('#isDisplay#', 'block');
            await Email.send(recipient, subject, emailContent);
        }

        if (existingUser) {
            await sendEmail(EmailContent.invitationEmailForExistingUser.content, EmailContent.invitationEmailForExistingUser.title, email);
            if (type == 2) {
                const adminContent = (await EmailTemplate.getEmailTemplate()).replace('#content#', EmailContent.invitationEmailForAdmins.content)
                                                                          .replace('#user#', `${existingUser.first_name} ${existingUser.last_name}`)
                                                                          .replace('#admin#', resp?.first_name || admin_name)
                                                                          .replace('#company#', company_name);
                await CompanyService.GetAdminsAndSendEmails(company, EmailContent.invitationEmailForAdmins.title, adminContent);
            }
        } else {
            await sendEmail(EmailContent.invitationEmailForExistingUser.content, EmailContent.invitationEmailForExistingUser.title, email);
            if (type == 2) {
                const adminContent = (await EmailTemplate.getEmailTemplate()).replace('#content#', EmailContent.invitationEmailForAdmins.content)
                                                                          .replace('#user#', `User with email ${email}`)
                                                                          .replace('#admin#', resp?.first_name || admin_name)
                                                                          .replace('#company#', company_name);
                await CompanyService.GetAdminsAndSendEmails(company, EmailContent.invitationEmailForAdmins.title, adminContent);
            }
        }

        return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

  static async sendInvitation2(details:any, resp:any): Promise<Response> {
    try {
        const email = details.email;
        const invitation = await UserInvitation.create(details);
        const template = await EmailTemplate.getEmailTemplate();
        const existingUser = await User.findOne({ where: { email } });
        let company;
        let admin_name = "";
        let company_name = "";
        if(details.company && details.type == 2 ) {
        company = await CompanyService.getCompanyAdmin(details.company);
        admin_name = company?.first_name +' '+company?.last_name
        company_name = company?.dataValues?.company_name;
        }
        //console.log('company0987', template);
        let body:string, emailContent:string;
        let landing_page = process.env.LANDING_PAGE;
        if(existingUser) {
          if(details.type == 2) {
            emailContent =  template
           .replace('#content#', EmailContent.invitationEmailForExistingUser.content)
           .replace('#name#', existingUser.first_name)
           .replace('#admin#', admin_name)
           .replace('#heading#', '')
           .replace('#lnk#', landing_page)
           .replace('#company#', company_name)
           .replace('#isDisplay#', 'block');
           Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);

           // Send email to all admins
           let adminTemp =  await EmailTemplate.getEmailTemplate();
           adminTemp = adminTemp.replace('#content#', EmailContent.invitationEmailForAdmins.content)
           .replace('#user#', existingUser.first_name + " " + existingUser.last_name) 
           .replace('#company#', company_name)
           .replace('#admin#', resp.first_name?resp?.first_name:admin_name)
           .replace('#heading#', '')
           .replace('#isDisplay#', 'block');

           await CompanyService.GetAdminsAndSendEmails(details.company,EmailContent.invitationEmailForAdmins.title, adminTemp);
            // Send email to all admins
           
          } else {
            emailContent =  template
           .replace('#content#', EmailContent.invitationEmailForExistingUser.content)
           .replace('#name#', existingUser.first_name)
           .replace('#admin#', "Enerva Admin")
           .replace('#heading#', '')
           .replace('#link#', landing_page)
           .replace('#company#', "Enerva");
           Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);
          }
        } else {
          if(details.type == 2) {
          emailContent =  template
          .replace('#content#', EmailContent.invitationEmailForExistingUser.content)
          .replace('#name#', " ")
          .replace('#admin#', resp.first_name?resp?.first_name:admin_name)
          .replace('#heading#', '')
          .replace('#link#', landing_page)
          .replace('#company#', company_name);
          Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);
          // Send email to all admins
          let adminTemp =  await EmailTemplate.getEmailTemplate();
          adminTemp = adminTemp.replace('#content#', EmailContent.invitationEmailForAdmins.content)
          .replace('#user#', "User with email "+ email) 
          .replace('#company#', company_name)
          .replace('#admin#', admin_name)
          .replace('#heading#', '')
          .replace('#isDisplay#', 'block');

          await CompanyService.GetAdminsAndSendEmails(details.company,EmailContent.invitationEmailForAdmins.title, adminTemp);
           // Send email to all admins
          } else {
            emailContent =  template
          .replace('#content#', EmailContent.invitationEmailForExistingUser.content)
          .replace('#name#', " ")
          .replace('#admin#', "Enerva Admin")
          .replace('#heading#', '')
          .replace('#link#', landing_page)
          .replace('#company#', "Enerva");
          Email.send(details.email, EmailContent.invitationEmailForExistingUser.title, emailContent);
          }
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
                attributes: ['company_name'],
                required:false
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
        createdAt: invitation.createdAt,
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

static async acceptUserInvitation(detail, resp, context): Promise<Object> {
  try {

    if(detail.type == 'reject') {
      await UserInvitation.update({ is_active: 0 }, { where: { email: detail.email, company:detail.company_id } });
    } else {

    const invitationList:any = await UserInvitation.findOne({
      where: { email: detail.email }
  });

  context.log("Listing1234",invitationList);

  context.log("Listing",invitationList.dataValues.permissions);

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

await UserInvitation.destroy({
  where: {
    email: detail.email,
    company: detail.company_id
  }
});

//await UserInvitation.update({ is_active: 0 }, { where: { email: detail.email, company:detail.company_id } });
if(detail.company_id) {
  await User.update({ type: 2 }, { where: { id: detail.user_id} });
} 
// else {
//   await User.update({ type: 1 }, { where: { id: detail.user_id} });
// }
// let template =  await EmailTemplate.getEmailTemplate();
// let emailContent =  template
//           .replace('#content#', EmailContent.invitationAcceptForUser.content)
//           .replace('#name#', resp.first_name)
//           .replace('#company#', "Enerva");
//           Email.send(resp.email, EmailContent.invitationAcceptForUser.title, emailContent);
}



return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };



   
} catch (error) {
  context.log("error", error);
    // Return error response
    return {
        status: 500, // Internal Server Error status code
        body: `${error.message}`
    };
}
}
}



export { UserInvitationService };
