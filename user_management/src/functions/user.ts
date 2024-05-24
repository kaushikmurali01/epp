import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { UserController } from '../controllers/userController';
import { UserInvitationService } from "../services/user-invitation-service";
import { UserService } from "../services/userService";
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/user";
import { UserInvitation } from "../models/user-invitation";
import { UserRequest } from "../models/user-request";
import { UserCompanyRole } from "../models/user-company-role";
import { sequelize } from "../services/database";
import { Permission } from "../models/permission";
import { UserCompanyRolePermission } from "../models/userCompanyRolePermission";
import { Email } from "../services/email";
import { EmailContent } from "../utils/emailContent";
import { EmailTemplate } from "../utils/emailTemplate";
import { Company } from "../models/company";
import { Role } from "../models/role";
import { CheckCompanyStatus } from "./company";
import { RESPONSE_MESSAGES } from "enerva-utils/utils/status";
import { CompanyService } from "../services/companyService";

/**
 * Registers a new user based on the provided request data.
 * 
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user registration status.
 */
export async function UserRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const data: any = await request.json();
        context.log("data001", data);

        const ext = process.env.AD_EXTENSION;
        const userData = {
            first_name: data[`extension_${ext}_FirstName`],
            last_name: data[`extension_${ext}_LastName`],
            email: data.email,
            phonenumber: data[`extension_${ext}_BusinessMobile`],
            landline: data[`extension_${ext}_BusinessLandline`] || null,
            type: data[`extension_${ext}_UserType`],
            display_name: data.displayName
        }
        //context.log("userData01",userData);
        const companyData = {
            company_name: data[`extension_${ext}_CompanyName`],
            company_description: data[`extension_${ext}_CompanyName`] || null,
            address1: data.streetAddress,
            city: data.city,
            state: data.state,
            source_of_discovery: data[`extension_${ext}_Howdoyouhearaboutus`] || null,
            website: data[`extension_${ext}_WebsiteURL`] || null,
            postal_code: data.postalCode,
            country: data.country,
            unit_number: data[`extension_${ext}_UnitNumber`],
            street_number: data[`extension_${ext}_StreetNo`],
            street_name: data.streetAddress,
        }
        //context.log("userData02",companyData);

        // Register user
        const user = await UserController.registerUser(userData, companyData, context);

        // Prepare response body
        const responseBody = JSON.stringify(user);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}


/**
 * Updates an existing user based on the provided request data.
 * 
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user update status.
 */
export async function UserUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        let userData: any;

        const resp: any = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Parse request data
        const requestData = await request.json();
        //resp.id = 84;

        // Update user
        userData = await UserController.updateUser(requestData, resp.id, resp.company_id);

        // Return success response
        return { body: JSON.stringify(userData) };
    } catch (error) {

        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves all users.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */
export async function GetEnervaUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit } = request.params;

        // Get all users
        const users = await UserController.getAllUsers(offset, limit);

        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function GetIESOUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit } = request.params;

        // Get all users
        const users = await UserController.getIESOUsers(offset, limit);

        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function AcceptInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData = await request.json();
        const data = await UserController.acceptInvitation(requestData);
        const responseBody = JSON.stringify(data);
        return { body: responseBody };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}

export async function RejectInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData = await request.json();
        const data = await UserService.rejectInvitation(requestData);
        const responseBody = JSON.stringify(data);
        return { body: responseBody };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}


/**
 * Retrieves data of current user.
 * 
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the user with the specified ID.
 */
export async function GetUserById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        // Middleware
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        context.log("middlewareResponse", resp);

        // Extract user ID from request
        const { company } = request.params;
        let company_id;
        if (company) company_id = company; else company_id = resp.company_id;
        if (company_id == 0) company_id = resp.company_id;

        resp.company_id = company_id;

        context.log("company_id", resp.company_id);
        const user = await UserController.getUserById(resp);



        context.log("testing", user.user);

        // Get User Permissions start
        const user_id = resp.id;


        let userPermissions = null;
        if ([1, 2, 6, 7, 11, 12].includes(user.user.dataValues.role_id)) {

            //  if(user.user.dataValues.role_id == 1 || user.user.dataValues.role_id == 2) {
            userPermissions = await Permission.findAll(
                {
                    attributes: ['id', 'permission', 'permission_type']
                }
            );
        }
        else if (user.user.dataValues.type == 2) {
            userPermissions = await UserCompanyRolePermission.findAll({
                where: {
                    user_id: user_id,
                    company_id: user.user.dataValues.company_id,
                },
                include: [{
                    model: Permission,
                    required: true,

                }],
                attributes: ['id', [sequelize.col('Permission.permission'), 'permission'], [sequelize.col('Permission.permission_type'), 'permission_type']],
            });
            context.log("userPermissions", userPermissions);
        } else if (user.user.dataValues.type == 1) {
            userPermissions = await UserCompanyRolePermission.findAll({
                where: {
                    user_id: user_id
                },
                include: [{
                    model: Permission,
                    required: true,

                }],
                attributes: ['id', [sequelize.col('Permission.permission'), 'permission'], [sequelize.col('Permission.permission_type'), 'permission_type']],
            });
        }

        user.permissions = userPermissions;



        user.invitations = await UserInvitationService.getUserInvitation(resp.email, user_id);

        if (!company_id) {
            const responseBody1 = JSON.stringify(user);

            // Return success response
            return { body: responseBody1 };
        }

        // Associated
        if (company_id) {
            const associatedCompaniesRaw: any = await UserCompanyRole.findAll({
                where: { user_id: user_id },
                attributes: [],
                include: [
                    {
                        model: Company,
                        attributes: [
                            'id',
                            'company_name',
                            'website',
                            'address1',
                            'address2',
                            'city',
                            'state',
                            'postal_code',
                            'country',
                            'unit_number',
                            'street_number',
                            'street_name'
                        ]
                    },
                    {
                        model: Role,
                        attributes: ['rolename', 'id'] // Include the role_name attribute
                    }
                ],
            });

            console.log("Test", associatedCompaniesRaw);

            // Map the results to include the company data and the role name
            const associatedCompanies = associatedCompaniesRaw.map(assocCompany => ({
                ...assocCompany.Company.get(),
                role_name: assocCompany.Role.rolename,
                role_id: assocCompany.Role.id
            }));
            user.associatedCompanies = associatedCompanies;
            // Associated
        }

        // Prepare response body
        const responseBody = JSON.stringify(user);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}



/**
 * Retrieves data of current user.
 * 
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the user with the specified ID.
 */
export async function AcceptUserInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        // Middleware
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        context.log("middlewareResponse", resp);

        // Extract user ID from request
        const requestData = await request.json();

        // Get user by ID
        const user = await UserInvitationService.acceptUserInvitation(requestData, resp, context);

        // Prepare response body
        const responseBody = JSON.stringify(user);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}



/**
 * Retrieves a user by ID.
 * 
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the user with the specified ID.
 */
export async function GetUserDetailById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        console.log("Testing");

        // Middleware
        // const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        // context.log("middlewareResponse",resp);

        // Extract user ID from request
        // const { id } = request.params;
        console.log("params009", request.params);

        // Get user by ID
        const user = await UserController.getUserById(request.params);


        // Prepare response body
        const responseBody = JSON.stringify(user);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Deletes a user by ID.
 * 
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating the status of user deletion.
 */
export async function DeleteUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const userId: any = request.params.id;
        const type: any = request.params.type;
        const company_id: any = request.params.company_id;
        if (type == 1) {
            if(company_id == 0) {
            await User.update({ is_active: 0 }, { where: { id: userId } });
            } else if(company_id > 0) {
                await UserCompanyRole.destroy({
                    where: {
                        user_id: userId,
                        company_id:company_id
                    }
                });
            (async () => {
            // Send Email For User Starts
      let template =  await EmailTemplate.getEmailTemplate();
      const company:any = await CompanyService.GetCompanyById(request.params.company_id);
      const userDet:any = await UserService.getUserDataById(userId);
      context.log("userDetail", userDet);
      if(userDet) {
      let emailContent =  template
                .replace('#content#', EmailContent.deleteDetailForUser.content)
                .replace('#name#', userDet?.first_name)
                .replace('#company#', company.company_name)
                .replace('#isDisplay#', 'none')
                .replace('#heading#', '');
                context.log("userDetailEMail", userDet?.email);
      await Email.send(userDet?.email, EmailContent.deleteDetailForUser.title, emailContent);
    // Send Email For User Ends

    // Send Email to Admins
    const adminContent = (await EmailTemplate.getEmailTemplate()).replace('#content#', EmailContent.deleteDetailForAdmins.content)
    .replace('#user#', `${userDet?.first_name}`)
    .replace('#company#', company.company_name)
    .replace('#isDisplay#', 'none')
    .replace('#heading#', '');
    await CompanyService.GetAdminsAndSendEmails(request.params.company_id, EmailContent.deleteDetailForAdmins.title, adminContent);
    // Send Email to Admins
      }
    })();
            }

        } else if (type == 2) {
            await UserInvitation.update({ is_active: 0 }, { where: { id: userId } });
        } else if (type == 3) {
            await UserRequest.update({ is_active: 0 }, { where: { id: userId } });
        }
        return { body: JSON.stringify({ status: 200, body: `Deleted Successfully.` }) };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}


/**
 * Azure Function to retrieve the list of user invitations.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the list of user invitations.
 */
export async function GetUserInvitationList(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { offset, limit } = request.params;

        // Get the list of user invitations
        const invitationList = await UserController.getAllInvitationsWithUserData(offset, limit);

        // Prepare response body
        const responseBody = JSON.stringify(invitationList);


        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return {
            status: 500, // Internal Server Error status code
            body: `${error.message}`
        };
    }
}

export async function SendAdminInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData: any = await request.json();
        requestData.type = 2;
        console.log('requestData', requestData);
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Validation starts
        const email = requestData.email;
        const company = requestData.company;
        // Check if the email already exists in the company
        const existingInvitation = await UserInvitation.findOne({ where: { email, company } });

        if (existingInvitation) {
             return {body: JSON.stringify({ status: 409, message: `This email is already invited.` })};
        } else {
            const user = await User.findOne({ where: { email } });
            if(user) {
            const existingUserCompanyRole = await UserCompanyRole.findOne({
                where: {
                  user_id: user.id,
                  company_id: company
                },
              });
              if (existingUserCompanyRole) {
                //return { status: 409, body: `User is already part of company.` };
                return {body: JSON.stringify({ status: 409, message: `User is already part of company.` })};
              }
            }
        }
        // Validation ends

        const data = await UserInvitationService.sendInvitation(requestData, resp);

        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves all users.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */
export async function GetCombinedUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit, entrytype, company_id } = request.params;
        const search = request.query.get('search') || "";
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        // if (!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        //let companyId;
        let companyId = company_id ? company_id : resp.company_id;
        let checkStatus = await CheckCompanyStatus(company_id)
        if (!checkStatus) {
            return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        }

        // Get all users
        const users = await UserController.getCombinedUsers(offset, limit, companyId, entrytype, search);

        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function GetFilteredUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit, entrytype, company_id } = request.params;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        let checkStatus = await CheckCompanyStatus(company_id)
        if (!checkStatus) {
            return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        }
        // resp.company_id = 1;
        // if (!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        // Get all users
        const search = request.query.get('search') || "";
        let companyId = company_id ? company_id : resp.company_id;

        const users = await UserController.getFilteredUsers(offset, limit, companyId, entrytype, search);

        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function CreateUserRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json();
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        const data = await UserController.createUserRequest(requestData, resp);

        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function AlertUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData: any = await request.json();
        let template = await EmailTemplate.getEmailTemplate();
        let logo: any = EmailTemplate.getLogo();
        if (!requestData.first_name) requestData.first_name = '';
        template = template.replace('#heading#', 'Alert from admin')
            .replace('#content#', requestData.comment)
            .replace('#name#', requestData.first_name)
            .replace('#logo#', logo);

        Email.send(requestData.email, EmailContent.alertEmail.title, template);
        const resp = { status: 200, body: 'Alert Sent successfully' };
        // Prepare response body
        const responseBody = JSON.stringify(resp);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Get Users and Company Details.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user and company details.
 */
export async function GetUserAndCompanyDetails(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { company_id } = request.params;
        let checkStatus = await CheckCompanyStatus(company_id)
        if (!checkStatus) {
            return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        }
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        // if(!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        //resp.id = 1;
        // Get all users
        const data = await UserService.GetUserAndCompanyDetails(resp.id, company_id);

        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function GetUserAndCompanyDetailsByUserId(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { company_id, user_id } = request.params;
        let checkStatus = await CheckCompanyStatus(company_id)
        if (!checkStatus) {
            return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        }
        //  const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        // if(!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        //resp.id = 1;
        // Get all users
        const data = await UserService.GetUserAndCompanyDetails(user_id, company_id);

        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Get Company List of User.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing list of companies of user.
 */
export async function GetUserCompanyDetail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { company_id } = request.params;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        // if(!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        // resp.id = 1;
        // Get all users
        const data = await UserService.GetUserCompanyList(resp.id);

        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

// Register middleware before each Azure Function
//app.use(decodeTokenMiddleware);
//export default middleware([validation(schema)], functionHandler, []);



app.http('AlertUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'alert/send',
    handler: AlertUser
});

app.http('CreateUserRequest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'createrequest',
    handler: CreateUserRequest
});

app.http('GetCombinedUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'combinedusers/{offset}/{limit}/{entrytype}/{company_id}',
    handler: GetCombinedUsers
});

app.http('GetFilteredUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'filteredusers/{offset}/{limit}/{entrytype}/{company_id}',
    handler: GetFilteredUsers
});

app.http('GetUserInvitationList', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'invitations/{offset}/{limit}',
    handler: GetUserInvitationList
});

app.http('SendAdminInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'invitations',
    handler: SendAdminInvitation
});

app.http('UserRegister', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/users',
    handler: UserRegister
});

app.http('UserUpdate', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'users',
    handler: UserUpdate
});

app.http('GetUserById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'user/{company}',
    handler: GetUserById
});

app.http('GetUserDetailById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'userdetail/{id}',
    handler: GetUserDetailById
});

app.http('DeleteUser', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'users/{id}/{type}/{company_id}',
    handler: DeleteUser
});

app.http('AcceptInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'acceptinvite',
    handler: AcceptInvitation
});

app.http('RejectInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'rejectinvite',
    handler: RejectInvitation
});

app.http('GetUserAndCompanyDetails', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usercompany/{company_id}',
    handler: GetUserAndCompanyDetails
});

app.http('GetUserAndCompanyDetailsByUserId', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usercompanybyuser/{company_id}/{user_id}',
    handler: GetUserAndCompanyDetailsByUserId
});

app.http('GetUserCompanyDetail', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usercompanies',
    handler: GetUserCompanyDetail
});

app.http('AcceptUserInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'acceptuserinvitation',
    handler: AcceptUserInvitation
});
