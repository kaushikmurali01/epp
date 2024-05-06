import { UserCompanyRole } from '../models/user-company-role';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class UserCompanyRoleService {

    /**
     * Creates a new user company role with provided details.
     * 
     * @param userCompanyRoleDetails - Object containing user company role details such as user_id, company_id, role_id, is_active, created_by, updated_by, etc.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user company role creation.
     * @description Creates a new user company role by creating a record in the database with specified details. Returns a response indicating the success or failure of the creation process.
     */
    static async createUserCompanyRole(userCompanyRoleDetails): Promise<Response> {
        try {
            await testDatabaseConnection();
            const userCompanyRole = await UserCompanyRole.create(userCompanyRoleDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a user company role by its ID.
     * 
     * @param userCompanyRoleId - The ID of the user company role to retrieve.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved user company role data.
     * @description Retrieves a user company role from the database by its ID. Returns a response containing the retrieved user company role data.
     */
    static async getUserCompanyRoleById(userCompanyRoleId: number): Promise<any> {
        try {
            await testDatabaseConnection();
            const userCompanyRole = await UserCompanyRole.findByPk(userCompanyRoleId);
            if (!userCompanyRole) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            return { status: HTTP_STATUS_CODES.SUCCESS, data: userCompanyRole };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Updates an existing user company role with new details.
     * 
     * @param userCompanyRoleId - The ID of the user company role to update.
     * @param updatedDetails - Object containing updated user company role details.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user company role update.
     * @description Updates an existing user company role in the database with new details. Returns a response indicating the success or failure of the update process.
     */
    static async updateUserCompanyRole(userCompanyRoleId: number, updatedDetails): Promise<Response> {
        try {
            await testDatabaseConnection();
            const userCompanyRole = await UserCompanyRole.findByPk(userCompanyRoleId);
            if (!userCompanyRole) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await userCompanyRole.update(updatedDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Deletes an existing user company role.
     * 
     * @param userCompanyRoleId - The ID of the user company role to delete.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user company role deletion.
     * @description Deletes an existing user company role from the database. Returns a response indicating the success or failure of the deletion process.
     */
    static async deleteUserCompanyRole(userCompanyRoleId: number): Promise<Response> {
        try {
            await testDatabaseConnection();
            const userCompanyRole = await UserCompanyRole.findByPk(userCompanyRoleId);
            if (!userCompanyRole) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await userCompanyRole.destroy();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a list of user company roles.
     * 
     * @returns Promise<any[]>
     * @description Retrieves a list of user company roles from the database.
     */
    static async listUserCompanyRoles(): Promise<any[]> {
        try {
            const userCompanyRoles = await UserCompanyRole.findAll();
            return userCompanyRoles;
        } catch (error) {
            throw error;
        }
    }
}

export { UserCompanyRoleService };
