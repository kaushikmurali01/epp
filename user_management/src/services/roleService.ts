import { Role } from '../models/role';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class RoleService {

    /**
     * Creates a new role with provided details.
     * 
     * @param roleDetails - Object containing role details such as rolename, description, is_active, created_by, updated_by, etc.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of role creation.
     * @description Creates a new role by creating a role record in the database with specified role details. Returns a response indicating the success or failure of the creation process.
     */
    static async createRole(roleDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const role = await Role.create(roleDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a role by its ID.
     * 
     * @param roleId - The ID of the role to retrieve.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved role data.
     * @description Retrieves a role from the database by its ID. Returns a response containing the retrieved role data.
     */
    static async getRoleById(roleId: number): Promise<any> {
        try {
            //await testDatabaseConnection();
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            return { status: HTTP_STATUS_CODES.SUCCESS, data: role };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Updates an existing role with new details.
     * 
     * @param roleId - The ID of the role to update.
     * @param updatedDetails - Object containing updated role details.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of role update.
     * @description Updates an existing role in the database with new details. Returns a response indicating the success or failure of the update process.
     */
    static async updateRole(roleId: number, updatedDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await role.update(updatedDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Deletes an existing role.
     * 
     * @param roleId - The ID of the role to delete.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of role deletion.
     * @description Deletes an existing role from the database. Returns a response indicating the success or failure of the deletion process.
     */
    static async deleteRole(roleId: number): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await role.destroy();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a list of roles.
     * 
     * @returns Promise<any[]>
     * @description Retrieves a list of roles from the database.
     */
        static async listRoles(): Promise<any[]> {
            try {
                const roles = await Role.findAll();
                return roles;
            } catch (error) {
                throw error;
            }
        }
    
}

export { RoleService };
