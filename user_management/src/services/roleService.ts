import { Role } from '../models/role';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { UserCompanyRolePermission } from '../models/userCompanyRolePermission';
import { User } from '../models/user';
import { UserInvitation } from '../models/user-invitation';
import { sequelize } from './database';
import { Op } from 'sequelize';
import { UserCompanyRole } from '../models/user-company-role';
import { CompanyLogsService } from './companyLogsService';


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
    static async listRoles(type): Promise<any[]> {
        try {
            // const roles = await Role.findAll();
            // const roles = await Role.findAll({
            //     where: {
            //        // rolename: { [Op.iLike]: `%${searchPromt}%` },
            //         id: {
            //             [Op.ne]: 1 // Op.ne means "not equal to"
            //         },
            //         user_type: type
            //     }
            // });

            const roles = await Role.findAll({
                where: {
                    // rolename: { [Op.iLike]: `%${searchPromt}%` },
                    id: {
                        [Op.notIn]: [1, 5] // Excludes id 1 and 2
                    },
                    user_type: type
                }
            });
            

            return roles;
        } catch (error) {
            throw error;
        }
    }

    static async listRequestToJoinRoles(type): Promise<any[]> {
        try {
            const roles = await Role.findAll({
                where: {
                  [Op.or]: [
                    { id: 3 },
                    { id: 4 }
                  ],
                  user_type: type
                }
              });

            return roles;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates a new role with provided details.
     * 
     * @param roleDetails - Object containing role details such as rolename, description, is_active, created_by, updated_by, etc.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of role creation.
     * @description Creates a new role by creating a role record in the database with specified role details. Returns a response indicating the success or failure of the creation process.
    */
    static async assignPermissions(data, context): Promise<any> {
        try {
            context.log("1111", data);
            let email = data.email;
            let permissions = data.permissions;
            context.log("99999", data);
            if (data.entry_type == 1 || data.entry_type == 3) {
                const user = await User.findOne({ where: { email } });
            context.log("2222", user.dataValues.id);
                context.log("3333", data.id);
                await this.deletePermissions(user.dataValues.id, data.company_id);
                for (const permissionId of data.permissions) {
                    // Create a new record for each permission
                    await UserCompanyRolePermission.create({
                        role_id: data.role_id,
                        permission_id: permissionId,
                        user_id: user.id,
                        company_id: data.company_id,
                        is_active: 1,
                    });
                }
                // Update company role start
                if(data.company_id) {
                    const [affectedRows] = await UserCompanyRole.update({ role_id:data.role_id }, { where: { user_id:user.id, company_id:data.company_id } });
                }
                // Update company role ends
                // Log start
                (async () => {
                const userSUper = await User.findOne({ where: { id: data.uid } });
       const input = {
        "event": ` ${userSUper.first_name} ${userSUper.last_name} has assigned/updated permissions to user having email ${data.email}`,
        "company_id": data.company_id,
        "user_id": data.uid,
        "facility_id": 0,
        "created_by":data.uid
        };
        await CompanyLogsService.createCompanyLog(input);
    })();
    // Log end

            } else {
                context.log("4444", data);
                await UserInvitation.update({ permissions, role: data.role_id }, { where: { email, company: data.company_id } });
            }
            
            console.log('Permissions inserted successfully.');
            //return perm;
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            console.error('Error inserting permissions:', error);
        }
    }

    static async deletePermissions(userId: number, companyId: number): Promise<number> {
        try {
            // Delete permissions based on user_id and company_id
            const resp = await UserCompanyRolePermission.destroy({
                where: {
                    user_id: userId,
                    company_id: companyId,
                },
            });
            return resp;
            console.log('Permissions deleted successfully.');
        } catch (error) {
            console.error('Error deleting permissions:', error);
        }
    }

    /**
     * Retrieves a list of  all roles including super admin for user type.
     * 
     * @returns Promise<any[]>
     * @description Retrieves a list of roles from the database.
     */
    static async listAllRoles(type): Promise<any[]> {
        try {
            const roles = await Role.findAll({
                where: {
                    user_type: type
                }
            });

            return roles;
        } catch (error) {
            throw error;
        }
    }

}

export { RoleService };
