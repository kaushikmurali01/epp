import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AdminUserController } from '../controllers/adminUserController';
import { UserInvitationService } from "../services/user-invitation-service";
import { UserService } from "../services/userService";
import { RolePermissionService } from "../services/rolePermissionService";
import { RoleController } from "../controllers/roleController";

/**
 * Registers a new user based on the provided request data.
 * 
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user registration status.
 */
export async function AdminUserRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 


        // Register user
        const user = await AdminUserController.registerAdminUser(requestData);
       
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
export async function AdminUserUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Update user
        const user = await AdminUserController.updateUser(requestData);
       
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
 * Retrieves Enerva users.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */
export async function GetEnervaUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit } = request.params;

        // Get all users
        const users = await AdminUserController.GetEnervaUsers(offset, limit);
       
        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves Enerva users.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */

export async function GetIESOUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit } = request.params;

        // Get all users
        const users = await AdminUserController.getIESOUsers(offset, limit);
       
        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves Customer users.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */

export async function GetCustomerUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { offset, limit } = request.params;

        // Get all users
        const users = await AdminUserController.getCustomerUsers(offset, limit);
       
        // Prepare response body
        const responseBody = JSON.stringify(users);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
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
export async function GetAdminUserById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        
        // Extract user ID from request
        const { id } = request.params;

        // Get user by ID
        const user = await AdminUserController.getUserById(id);
       
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
export async function DeleteAdminUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract user ID from request
        const userId = request.params.id;

        // Delete user by ID
        const deleted = await AdminUserController.deleteUser(userId);
       
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
        const invitationList = await AdminUserController.getAllInvitationsWithUserData(offset, limit);

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

export async function SendEnervaInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
 * Retrieves permissions associated with a role by its ID.
 * 
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing permissions data.
 */
export async function GetAdmnPermissionsByRoleId(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        const roleId = parseInt(request.params.id);

        // Get permissions by role ID
        const permissions = await RolePermissionService.getPermissionsByRoleId(roleId);

        // Prepare response body
        const responseBody = JSON.stringify(permissions);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function AdAssignPermissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create role
        const role = await RoleController.assignPermissions(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(role);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

app.http('SendEnervaInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'send',
    handler: SendEnervaInvitation
});

app.http('GetEnervaUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'enerva/{offset}/{limit}',
    handler: GetEnervaUsers
});
app.http('GetIESOUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'ieso/{offset}/{limit}',
    handler: GetIESOUsers
});
app.http('GetCustomerUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'customer/{offset}/{limit}',
    handler: GetCustomerUsers
});


app.http('GetAdminUserById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usr/{id}',
    handler: GetAdminUserById
});

app.http('DeleteAdminUser', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'usr/{id}',
    handler: DeleteAdminUser
});
app.http('AdAssignPermissions', {
    methods: ['POST'],
    route: 'adassign',
    authLevel: 'anonymous',
    handler: AdAssignPermissions
});
app.http('GetAdmnPermissionsByRoleId', {
    route: 'adrolepermission/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAdmnPermissionsByRoleId
});


