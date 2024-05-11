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
        const data:any = await request.json();
       // const data = JSON.parse(requestData.rawBody); 
        const userData = {
            first_name: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_FirstName,
            last_name:  data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_LastName,
            email: data.email,
            phonenumber: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_BusinessMobile,
            landline: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_BusinessLandline,
            type: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_UserType,
            display_name: data.displayName
        }
        const companyData = {
            company_name: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_CompanyName,
            company_description:  data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_LastName,
            address1: data.streetAddress,
            city: data.city,
            state: data.state,
            source_of_discovery: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_Howdoyouhearaboutus,
            website: data.extension_5d32203cb8d54cf0a859617d3a5a6d9c_WebsiteURL,
            postal_code: data.postalCode,
            country: data.country
        }

        // Register user
         const user = await UserController.registerUser(userData, companyData);
       
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
        let userData:any;

        const resp:any = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Parse request data
        const requestData = await request.json();

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
        context.log("middlewareResponse",resp);
        
        // Extract user ID from request
        const { id } = request.params;

        // Get user by ID
        const user = await UserController.getUserById(resp);

        // Get User Permissions start
        const user_id = resp.id;
        const company_id = resp.company_id;

       let userPermissions = null;
       if(resp.role_id === 1 || resp.role_id === 2) {
         userPermissions = await Permission.findAll(
            {
                attributes: ['id', 'permission', 'permission_type']
            }
         );
       }
       else if(resp.type === 2) {
           userPermissions = await UserCompanyRolePermission.findAll({
            where: {
              user_id: user_id,
              company_id: company_id,
            },
            include: [{
              model: Permission,
              required: true,
              
            }],
            attributes: ['id',[sequelize.col('Permission.permission'), 'permission'], [sequelize.col('Permission.permission_type'), 'permission_type']], 
          });
        } else {
            userPermissions = await UserCompanyRolePermission.findAll({
                where: {
                  user_id: user_id
                },
                include: [{
                  model: Permission,
                  required: true,
                  
                }],
                attributes: ['id',[sequelize.col('Permission.permission'), 'permission'], [sequelize.col('Permission.permission_type'), 'permission_type']], 
              });
        }

        user.permissions = userPermissions;

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
       console.log("params009",request.params);

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
        const userId:any = request.params.id;
        const type:any = request.params.type;
        if(type == 1) {
            await User.update({ is_active: 0 }, { where: { id: userId } });
        } else if(type == 2) {
            await UserInvitation.update({ is_active: 0 }, { where: { id: userId } });
        } else if(type == 3) {
            await UserRequest.update({ is_active: 0 }, { where: { id: userId } });
        }
        return {body: JSON.stringify ({status: 200, body: `Deleted Successfully.` })};
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
        const requestData = await request.json(); 
        console.log('requestData', requestData);
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
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

        const { offset, limit, company} = request.params;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
       if(!resp.company_id) return { body: JSON.stringify({ status: 500, body: 'This user do not have any company' }) };
        // Get all users
        const users = await UserController.getCombinedUsers(offset, limit, resp.company_id);
       
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
        const requestData:any = await request.json(); 
        let template = await EmailTemplate.getEmailTemplate();
        let logo:any = EmailTemplate.getLogo();
        if(!requestData.first_name) requestData.first_name = '';
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
    route: 'combinedusers/{offset}/{limit}/{company}',
    handler: GetCombinedUsers
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
    route: 'user',
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
    route: 'users/{id}/{type}',
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
