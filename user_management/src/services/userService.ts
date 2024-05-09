import { User } from '../models/user';
//import { UserAttributes } from 'enerva-utils/interfaces/user';
//import { testDatabaseConnection } from 'enerva-utils/utils/database';
 import { Response } from 'enerva-utils/interfaces/response';
 //import { RESPONSE_MESSAGES } from 'enerva-utils/utils/message';
 import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { UserInvitation } from '../models/user-invitation';
import { Status } from '../models/status';
import { UserRequest } from '../models/user-request';
import { Role } from '../models/role';
import { Company } from '../models/company';
import { sequelize } from '../services/database';
import { UserCompanyRole } from '../models/user-company-role';
import { UserCompanyRolePermission } from '../models/userCompanyRolePermission';
import { Permission } from '../models/permission';
User.hasOne(UserCompanyRole, { foreignKey: 'user_id' });


class UserService {

/**
 * Registers a new user with provided details.
 * 
 * @param userDetails - Object containing user details such as first_name, last_name, email, password, and address.
 * @returns Promise<Response> - A promise resolving to a response indicating the status of user registration.
 * @description Registers a new user by creating a user record in the database with specified user details. Returns a response indicating the success or failure of the registration process.
 */
static async registerUser(userDetails): Promise<any> {
  try {
    const user = await User.create(userDetails);
    return user;
} catch (error) {
    throw new Error(`${error.message}`);
}
}

static async acceptInvitation(data): Promise<Response> {
  try {
     const result = UserRequest.update({ status: "Active"}, {where:{id: data.user_id, company_id: data.company_id}});
     return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
  } catch (error) {
     throw new Error(`${error.message}`);
  }
}

static async rejectInvitation(data): Promise<Response> {
  try {
     const result = UserRequest.update({ status: "Rejected"}, {where:{id: data.user_id}});
     return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
} catch (error) {
     throw new Error(`${error.message}`);
}
}

  /**
   * Updates an existing user with provided details.
   * 
   * @param id - The ID of the user to be updated.
   * @param userDetails - Object containing user details to be updated.
   * @returns Promise<User | null> - A promise resolving to the updated user if successful, otherwise null.
   * @description Updates an existing user record in the database with specified user details.
   */
  static async updateUser(id: number, userDetails:Object): Promise<User | null> {
    try {
      const [rowsAffected, updatedUsers] = await User.update(userDetails, {
        where: { id },
        returning: true,
      });
      if (rowsAffected === 0) return null;
      return updatedUsers[0];
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Retrieves all users from the database.
   * 
   * @returns Promise<User[]> - A promise resolving to an array of all users.
   * @description Retrieves all user records from the database.
   */
  static async getEnervaUsers(offset, limit): Promise<User[]> {
    try {
        return await User.findAll({
        include: [{
          model: UserCompanyRole,
          attributes: [],
          include: [{
            model: Role,
            attributes: []
        }]
      }],
        offset: offset,
        limit: limit,
        where: {
          type: 2, 
        },
        attributes: ["id","status", "email", "first_name", "last_name", "createdAt", "type",
        [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'], 
  
        ],
    });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  static async getIESOUsers(offset, limit): Promise<User[]> {
    try {
        return await User.findAll({
        include: [{
          model: UserCompanyRole,
          attributes: [],
          include: [{
            model: Role,
            attributes: []
        }]
      }],
        offset: offset,
        limit: limit,
        where: {
          type: 3, 
        },
        attributes: ["id","status", "email", "first_name", "last_name", "createdAt", "type",
        [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'], 
  
        ],
    });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  static async getAllUsersAndInvitations(offset, limit): Promise<any> {
    try {
      // Fetch users and invitations concurrently
      const [users, invitations] = await Promise.all([
          User.findAll(),
          UserInvitation.findAll(),
      ]);

      // Concatenate the results of both tables
      const allResults = [...users, ...invitations];

      // Apply offset and limit
      const paginatedResults = allResults.slice(offset, offset + limit);

      return paginatedResults;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
  }

  static async getCombinedUsers(offset, limit, company): Promise<any> {
    try {
      const [usersResult, invitationsResult, requestsResult] = await Promise.all([
        User.findAll({
            include: [{
                model: UserCompanyRole,
                attributes: [],
                where: {
                    company_id: company
                },
                include: [{
                    model: Role,
                    attributes: []
                }]
            }],
            offset: offset,
            limit: limit,
            where: {
              type: 2,
              is_active: 1 
            },
            attributes: ["id", "email", "first_name", "last_name",
                [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
                [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
                [sequelize.col('UserCompanyRole.status'), 'status'],
                [sequelize.col('UserCompanyRole.company_id'), 'company_id']
            ],
        }),
        UserInvitation.findAll({
            offset: offset,
            limit: limit,
            where: {
              is_active: 1,
              company: company
            },
            attributes: ['id', 'email', 'invitation_sent_date', 'invitation_sent_time', 'status',
                [sequelize.col('Role.rolename'), 'rolename'],
                [sequelize.col('Role.id'), 'role_id'],
                [sequelize.col('Company.company_name'), 'company_name'],
                [sequelize.col('Company.id'), 'company_id']
            ],
            include: [{
                    model: Role,
                    attributes: []
                },
                {
                    model: Company,
                    attributes: []
                }
            ]
        }),
        UserRequest.findAll({
            offset: offset,
            limit: limit,
            where: {
              is_active: 1,
              company_id: company
            },
            attributes: ['id','date_of_request_sent', 'time_of_request_sent', 'status',
                [sequelize.col('Role.rolename'), 'rolename'],
                [sequelize.col('Role.id'), 'role_id'],
                [sequelize.col('Company.company_name'), 'company_name'],
                [sequelize.col('Company.id'), 'company_id']
            ],
            include: [{
                    model: Role,
                    attributes: []
                },
                {
                    model: Company,
                    attributes: []
                }
            ]
        })
    ]);
    
    const users = usersResult.map(user => ({
        type: 1,
        facility: "Sample Facility",
        ...user.toJSON()
    }));
    
    const invitations = invitationsResult.map(invitation => ({
        type: 2,
        facility: "",
        first_name: "",
        last_name: "",
        ...invitation.toJSON()
    }));
    
    const requests = requestsResult.map(request => ({
        type: 3,
        facility: "Sample",
        first_name: "Test",
        last_name: "Test",
        ...request.toJSON()
    }));
    
    // Combine all results into one array
    const allData = [...users, ...invitations, ...requests];
    return allData;
    
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }

  }


  /**
   * Retrieves a user by ID from the database.
   * 
   * @param id - The ID of the user to retrieve.
   * @returns Promise<User | null> - A promise resolving to the user if found, otherwise null.
   * @description Retrieves a user record from the database by its ID.
   */
  static async getUserById(id: number): Promise<any> {
    

    try {
     
      // Find user by primary key
      const user:any = await User.findByPk(id, {
          include: [
              {
                  model: UserCompanyRole,
                  attributes: [],
                  include: [
                      {
                          model: Role,
                          attributes: []
                      }
                     
                  ]
              }
          ],
          attributes: ["id", "email", "first_name", "last_name", "phonenumber", "landline", "type", "profile_pic",
              [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
              [sequelize.col('UserCompanyRole.status'), 'status'],
              [sequelize.col('UserCompanyRole.company_id'), 'company_id']
          ],
      });
      let company = null;
      let companyData = null;
     const companyId = user.dataValues?.company_id;
     if (companyId) {
       company = await Company.findByPk(companyId);
  }
  
      if (!user) {
          return {
              status: 404,
              body: 'User not found'
          };
      }

      return {
          status: 200,
          user: user,
          company: company
          
      };
  } catch (error) {
      // Return error response
      return {
          status: 500,
          body: `${error.message}`
      };
  }
  }

  /**
   * Deletes a user from the database by ID.
   * 
   * @param id - The ID of the user to delete.
   * @returns Promise<boolean> - A promise resolving to true if deletion is successful, otherwise false.
   * @description Deletes a user record from the database by its ID.
   */
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const rowsAffected = await User.destroy({ where: { id } });
      return rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

}

export { UserService };
