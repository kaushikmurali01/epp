import { RolePermission } from '../models/role-permission'; // Import the RolePermission model
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { Permission } from '../models/permission';
import { sequelize } from '../services/database';

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
            const permissions = await RolePermission.findAll({
                where: { role_id: roleId },
                
                include: [
                    {
                        model: Permission,
                        attributes: [] // Include permission ID and name
                    }
                ],
                attributes: ['permission_id', [sequelize.col('Permission.permission_description'), 'desc'], [sequelize.col('Permission.is_active'), 'is_active']],
                raw: true // Return plain JSON objects
            });
            const permissionsWithAssignment = permissions.map(permission => ({
                ...permission,
                is_assigned: false
            }));
            return permissionsWithAssignment;
        } catch (error) {
            throw new Error(`${error.message}`);
        }

        
    }
}

export { RolePermissionService };
