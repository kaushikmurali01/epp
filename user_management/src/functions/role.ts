import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { RoleController } from '../controllers/roleController';
import { RolePermissionService } from "../services/rolePermissionService";
import { Permission } from "../models/permission";
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { UserInvitation } from "../models/user-invitation";
import { UserCompanyRolePermission } from "../models/userCompanyRolePermission";
import { sequelize } from "../services/database";
import { User } from "../models/user";
import { Company } from "../models/company";
import { Model } from "sequelize";
import { UserRequest } from "../models/user-request";
import { AuthorizationService } from "../middleware/authorizeMiddleware";
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

        const type = parseInt(request.params.user_type);
        // List roles
        const roles = await RoleController.listRoles(request, type);

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

        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
       if(resp?.company_id) {
        const hasPermission = await AuthorizationService.check(resp.company_id, resp.id, ['grant-revoke-access'], resp.role_id);
        if(!hasPermission) return {body: JSON.stringify({ status: 403, message: "Forbidden" })};
       }

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

export async function AssignPermissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData:any = await request.json(); 
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        requestData.company_id = resp.company_id;
        // Create role
        const role = await RoleController.assignPermissions(requestData, context);
       
        // Prepare response body
        const responseBody = JSON.stringify(role);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

export async function GetUserPermissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
       
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        console.log("Resp", resp);
        
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

        // Prepare response body
        const responseBody = JSON.stringify(userPermissions);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Retrieves permissions associated with a role by its ID.
 * 
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing permissions data.
 */
export async function GetPermissionsByUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        let user_id = parseInt(request.params.user_id);
        const company_id = parseInt(request.params.company_id);
        let entry_type = parseInt(request.params.entry_type);
        let userInvitations;
        context.log("Entry Type", entry_type);
        context.log("User Id", user_id);
        context.log("company id", company_id);
        
        if(entry_type == 1 || entry_type == 3) {
            context.log("entry_type");
            if(entry_type == 3) {
            let usData = await UserRequest.findOne({
                where: {
                  id: user_id
                }
            });
            user_id = usData.user_id;
            context.log("usDATA",usData);
        }

            const userPermissions:any = await UserCompanyRolePermission.findAll({
                where: {
                  user_id: user_id,
                  company_id: company_id
                },
                include:[
                    {
                        model:User,
                        attributes: ['email']
                    }
                ]
              });
          
              // Aggregate permissions into an array
              const permissionsArray = userPermissions.map(permission => permission.permission_id);
              context.log("permissionsArray",userPermissions);
          
              // Return a single object
              let permissions =  {
                id: user_id,
                email: userPermissions.length > 0 ? userPermissions[0].User.email : null,
                role: userPermissions.length > 0 ? userPermissions[0].role_id : null,
                company: company_id,
                permissions: permissionsArray
              };

             // console.log("Obj",  obj);
              const responseBody = JSON.stringify(permissions);

        // Return success response
        return { body: responseBody, status: 200 };
            
          

        }
        else {
        // Get permissions by role ID
        userInvitations = await UserInvitation.findOne({
            where: {
              company: company_id,
              id: user_id
            }
        });
    }
   // console.log("Invitations",userInvitations);

        // Prepare response body
        const responseBody = JSON.stringify(userInvitations);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}


/**
 * Retrieves a list of roles including super admin.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing a list of roles.
 */
export async function ListAllRoles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const type = parseInt(request.params.user_type);
        // List roles
        const roles = await RoleController.listAllRoles(request, type);

        // Prepare response body
        const responseBody = JSON.stringify(roles);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

//const permissions = await Permission.findAll();

app.http('CreateRole', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateRole
});
app.http('AssignPermissions', {
    methods: ['POST'],
    route: 'assign',
    authLevel: 'anonymous',
    handler: AssignPermissions
});

app.http('GetRole', {
    route: 'role/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetRole
});
app.http('GetPermissionsByUser', {
    route: 'user/permissions/{user_id}/{company_id}/{entry_type}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetPermissionsByUser
});

app.http('GetUserPermissions', {
    route: 'userpermissions',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetUserPermissions
});

app.http('ListRoles', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'roles/{user_type}',
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
app.http('ListAllRoles', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'all-roles/{user_type}',
    handler: ListAllRoles
});
