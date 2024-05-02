import { RolePermission } from '../models/role-permission'; // Import the RolePermission model
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { Permission } from '../models/permission';

class RolePermissionService {

    // Other methods remain unchanged

    /**
     * Retrieves all permissions associated with a role by its ID.
     * 
     * @param roleId - The ID of the role to retrieve permissions for.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved permissions.
     * @description Retrieves all permissions associated with a role from the database by its ID.
     */
    static async getPermissionsByRoleId(roleId: number): Promise<any[]> {
        try {
            // const permissions = await RolePermission.findAll({
            //     where: { role_id: roleId },
            //     attributes: ['permission_id'], // Retrieve only permission IDs
            //     raw: true // Return plain JSON objects
            // });
            // return permissions;

            const permissions = await RolePermission.findAll({
                where: { role_id: roleId },
                attributes: ['permission_id'],
                include: [
                    {
                        model: Permission,
                        attributes: [['permission_description', 'desc']] // Include permission ID and name
                    }
                ],
                raw: true // Return plain JSON objects
            });
            return permissions.map(permission => {
                const formattedPermission = {};
                for (const key in permission) {
                    if (Object.prototype.hasOwnProperty.call(permission, key)) {
                        const newKey = key.replace('Permission.', '');
                        formattedPermission[newKey] = permission[key];
                    }
                }
                return formattedPermission;
            });
            //return permissions;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

export { RolePermissionService };
