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
        let userData;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        context.log("middlewareResponse", resp);
        // Parse request data
        const requestData = await request.json();
        // Update user
        userData = await UserController.updateUser(requestData, resp.id);

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
 * Retrieves a user by ID.
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
        User.hasMany(UserCompanyRole, { onDelete: 'CASCADE' });
        // Extract user ID from request
        const userId = request.params.id;
        const type = request.params.type;
        if(type === 'user') {
            await User.update({ is_active: 0 }, { where: { id: userId } });

        } else if(type === 'invitation') {
           // await UserInvitation.destroy({ where: { id: userId } });
            await UserInvitation.update({ is_active: 0 }, { where: { id: userId } });
        } else if(type === 'request') {
            //await UserRequest.destroy({ where: { id: userId } });
            await UserRequest.update({ is_active: 0 }, { where: { id: userId } });
        }
        return { status: 200, body: `Deleted Successfully.` };

        // Delete user by ID
        const deleted = await UserController.deleteUser(userId);
       
        // Prepare response body
        const responseBody = JSON.stringify({ deleted });

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
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
        const data = await UserInvitationService.sendInvitation(requestData);
       
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

        // Get all users
        const users = await UserController.getCombinedUsers(offset, limit, company);
       
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
        const data = await UserController.createUserRequest(requestData);
       
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
