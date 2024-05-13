import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AdminUserController } from '../controllers/adminUserController';
import { UserInvitationService } from "../services/user-invitation-service";
import { UserService } from "../services/userService";
import { RolePermissionService } from "../services/rolePermissionService";
import { RoleController } from "../controllers/roleController";
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/user";
import { UserCompanyRole } from "../models/user-company-role";
import { Role } from "../models/role";
import { sequelize } from "../services/database";
import { UserInvitation } from "../models/user-invitation";
import { RoleUserType } from "../models/roleUserType";
import { RolePermission } from "../models/role-permission";
import { UserType } from "../models/userType";
import { UserCompanyRolePermission } from "../models/userCompanyRolePermission";



export async function AddRolePermission(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData: any = await request.json();
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Create the role with user type
        const role = await Role.create({
            rolename: requestData.role_name,
            description: requestData.role_name,
            user_type: requestData.user_type,
            created_by:  resp.id,
            updated_by:  resp.id
        });

        // Associate the role with permissions
        const permissionRecords = requestData.permissions.map(permissionId => ({
            role_id: role.id,
            permission_id: permissionId,
            created_by:  resp.id,
            updated_by:  resp.id
        }));

        await RolePermission.bulkCreate(permissionRecords);

        let obj = { status: 200, body: 'success' };
        const responseBody = JSON.stringify(obj);
        return { body: responseBody };
    } catch (error) {
        context.log(error)
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function EditRolePermission(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData: any = await request.json();
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Find the role by ID
        const role = await Role.findByPk(requestData.role_id);

        if (!role) {
            return { status: 404, body: 'Role not found' };
        }

        // Update the role attributes
        role.rolename = requestData.role_name || role.rolename;
        role.description = requestData.description || role.description;
        role.user_type = requestData.user_type || role.user_type;
        role.updated_by = resp.id;

        await role.save(); // Save the updated role

        // Update permissions if provided
        if (requestData.permissions) {
            // Remove existing permissions
            await RolePermission.destroy({
                where: {
                    role_id: role.id
                }
            });

            // Associate the role with new permissions
            const permissionRecords = requestData.permissions.map(permissionId => ({
                role_id: role.id,
                permission_id: permissionId,
                created_by: resp.id,
                updated_by: resp.id
            }));

            await RolePermission.bulkCreate(permissionRecords);
        }

        let obj = { status: 200, body: 'success' };
        const responseBody = JSON.stringify(obj);
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function ListRolePermission(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
       
        const roles:any = await Role.findAll({
            attributes: ['rolename', 'createdAt'], 
            include: [
                {
                    model: UserType,
                    attributes: ['user_type'] 
                }
            ]
        });

        // Transform roles data if needed
        const rolesData = roles.map(role => ({
            rolename: role.rolename,
            userType: role.UserType.user_type,
            createdAt: role.createdAt
        }));

        // Return roles data
        return { status: 200, body: JSON.stringify(rolesData) };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function DeleteRolePermission(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const roleId = Number(parseInt(request.params.role_id)); 

        // Check if the roleId is valid
        if (isNaN(roleId) || roleId <= 0) {
            return { status: 400, body: 'Invalid role ID' };
        }

        // Delete from RolePermission table
        await RolePermission.destroy({
            where: {
                role_id: roleId
            }
        });

        // Delete from UserCompanyRolePermission table
        await UserCompanyRolePermission.destroy({
            where: {
                role_id: roleId
            }
        });

        // Delete from Role table
        const deletedRoleCount = await Role.destroy({
            where: {
                id: roleId
            }
        });

        // Check if any role record was deleted
        if (deletedRoleCount === 0) {
            return { status: 404, body: 'Role not found' };
        }

        const resp =  {status: 200, message: 'Role and associated records deleted successfully' }; 

        return { body: JSON.stringify(resp), status: 200 };

        //return { status: 200, body: 'Role and associated records deleted successfully' };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}



app.http('AddRolePermission', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'program/rolepermission',
    handler: AddRolePermission
});

app.http('EditRolePermission', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'program/rolepermission',
    handler: EditRolePermission
});

app.http('ListRolePermission', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'program/rolepermission',
    handler: ListRolePermission
});
app.http('DeleteRolePermission', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'program/rolepermission/{role_id}',
    handler: DeleteRolePermission
});


