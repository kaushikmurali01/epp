import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { RoleController } from '../controllers/roleController';
import { RolePermissionService } from "../services/rolePermissionService";
/**
 * Creates a new role based on the provided request data.
 * 
 * @param request The HTTP request object containing role data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing role creation status.
 */
export async function CreateRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create role
        const role = await RoleController.createRole(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(role);

        // Return success response
        return { body: responseBody, status: 201 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Retrieves a role by its ID.
 * 
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing role data.
 */
export async function GetRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        const roleId = parseInt(request.params.id);

        // Get role
        const role = await RoleController.getRole(request);

        // Prepare response body
        const responseBody = JSON.stringify(role);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves a list of roles.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing a list of roles.
 */
export async function ListRoles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // List roles
        const roles = await RoleController.listRoles(request);

        // Prepare response body
        const responseBody = JSON.stringify(roles);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Updates a role based on the provided request data.
 * 
 * @param request The HTTP request object containing role data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing role updation status.
 */
export async function UpdateRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Update role
        const role = await RoleController.updateRole(request);

        // Prepare response body
        const responseBody = JSON.stringify(role);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Deletes a role by its ID.
 * 
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating role deletion status.
 */
export async function DeleteRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        const roleId = parseInt(request.params.id);

        // Delete role
        await RoleController.deleteRole(request);

        // Return success response
        return { status: 204 };
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
export async function GetPermissionsByRoleId(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

app.http('CreateRole', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateRole
});

app.http('GetRole', {
    route: 'role/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetRole
});

app.http('ListRoles', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'roles',
    handler: ListRoles
});

app.http('UpdateRole', {
    route: 'role/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: UpdateRole
});

app.http('DeleteRole', {
    route: 'role/{id}',
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteRole
});
app.http('GetPermissionsByRoleId', {
    route: 'rolepermission/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetPermissionsByRoleId
});
