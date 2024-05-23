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
import { UserCompanyRole, UserCompanyRoleAttributes } from '../models/user-company-role';
import { UserCompanyRolePermission } from '../models/userCompanyRolePermission';
import { Permission } from '../models/permission';
import { Op, UpsertOptions } from 'sequelize';
import { Facility } from '../models/facility';
import { UserResourceFacilityPermission } from '../models/user-resource-permission';
import { EmailTemplate } from '../utils/emailTemplate';
import { CompanyService } from './companyService';
import { EmailContent } from '../utils/emailContent';
import { Email } from './email';
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
      let id = data.user_id;
      let userData: any = await UserRequest.findOne({
        where: {
          id: id,
          is_active: 1
        }
      });

      console.log('11111', userData);

      const existingUserCompanyRole = await UserCompanyRole.findOne({
        where: {
          company_id: data.company_id,
          user_id: userData?.dataValues?.user_id
        }
      });

      console.log('222222');

      // If the record exists, update it; otherwise, create a new one
      if (existingUserCompanyRole) {
        console.log('3333');
        await UserCompanyRole.update({
          role_id: userData?.dataValues?.role
        }, {
          where: {
            company_id: data.company_id,
            user_id: userData?.dataValues?.user_id
          }
        });
        console.log('4444');
      } else {
        console.log('5555');
        const newUserCompanyRole: any = {
          company_id: data.company_id,
          role_id: userData?.dataValues?.role,
          user_id: userData?.dataValues?.user_id,
          is_active: 1
        };
        await UserCompanyRole.create(newUserCompanyRole);
        console.log('6666');
      }
      await UserRequest.update({ status: 'accepted' }, { where: { id } });
      console.log('77777');
      // Send Email For User Starts
      let template =  await EmailTemplate.getEmailTemplate();
            const company:any = await CompanyService.GetCompanyById(data.company_id);
           const userDet:any = await this.getUserDataById(userData?.dataValues?.user_id);
            let emailContent =  template
                      .replace('#content#', EmailContent.joinCompanyApprovalForUser.content)
                      .replace('#name#', userDet.first_name)
                      .replace('#company#', company.company_name)
                      .replace('#isDisplay#', 'none')
                      .replace('#heading#', '');
             Email.send(userDet.email, EmailContent.joinCompanyApprovalForUser.title, emailContent);
      // Send Email For User Ends

       // Send Email to Admins
       const adminContent = (await EmailTemplate.getEmailTemplate()).replace('#content#', EmailContent.joinCompanyApprovalForAdmins.content)
       .replace('#user#', `${userDet.first_name}`)
       .replace('#company#', company.company_name)
       .replace('#isDisplay#', 'none')
       .replace('#heading#', ''); 
       await CompanyService.GetAdminsAndSendEmails(data.company_id, EmailContent.joinCompanyApprovalForAdmins.title, adminContent);
       // Send Email to Admins

      return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  static async getUserDataById(userId: number): Promise<any> {
    try {
      const user = await User.findByPk(userId);
      return user;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }
  

  static async rejectInvitation(data): Promise<Response> {
    try {
      const result = UserRequest.update({ status: "Rejected" }, { where: { id: data.user_id } });
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
  static async updateUser(id: number, userDetails: Object): Promise<User | null> {
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
        attributes: ["id", "status", "email", "first_name", "last_name", "createdAt", "type",
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
        attributes: ["id", "status", "email", "first_name", "last_name", "createdAt", "type",
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

  static async findAllRegisteredUsers(offset, limit, company, entrytype, search?) {
    if (entrytype == 0 || entrytype == 1) {
      return User.findAndCountAll({
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
          is_active: 1,
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ]
        },
        attributes: ["id", "email", "first_name", "last_name",
          [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
          [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
          [sequelize.col('UserCompanyRole.status'), 'status'],
          [sequelize.col('UserCompanyRole.company_id'), 'company_id']
        ],
      });
    }
  }

  static async findAllInvitedUsers(offset, limit, company, entrytype, search?) {
    if (entrytype == 0 || entrytype == 2) {

      return UserInvitation.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
          is_active: 1,
          company: company,
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
          ]
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
      });
    } else return [];
  }

  static async findAllRequestReceived(offset, limit, company, entrytype, search?) {
    if (entrytype == 0 || entrytype == 3) {
      return UserRequest.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
          is_active: 1,
          company_id: company,
        },
        attributes: ['id', 'date_of_request_sent', 'time_of_request_sent', 'status',
          [sequelize.col('Role.rolename'), 'rolename'],
          [sequelize.col('Role.id'), 'role_id'],
          [sequelize.col('Company.company_name'), 'company_name'],
          [sequelize.col('Company.id'), 'company_id'],
          [sequelize.col('User.first_name'), 'first_name'],
          [sequelize.col('User.last_name'), 'last_name'],
          [sequelize.col('User.email'), 'email']
        ],
        include: [{
          model: Role,
          attributes: []
        },
        {
          model: Company,
          attributes: []
        },

        {
          model: User,
          attributes: []
        }
        ]
      })
    } else return [];
  }

  static async getCombinedUsers(offset, limit, company, entrytype, search): Promise<any> {
    try {
      const [usersResult, invitationsResult, requestsResult]: any = await Promise.all([

        await this.findAllRegisteredUsers(offset, limit, company, entrytype, search),
        await this.findAllInvitedUsers(offset, limit, company, entrytype, search),
        await this.findAllRequestReceived(offset, limit, company, entrytype, search),
      ]);

      const users = usersResult?.rows?.map(user => ({
        entry_type: 1,
        // facility: "Sample Facility",
        ...user.toJSON()
      })) || []
      let userCount = usersResult?.count || 0;

      console.log("inv", invitationsResult);

      const invitations = invitationsResult?.rows?.map(invitation => ({
        entry_type: 2,
        // facility: "",
        first_name: "",
        last_name: "",
        ...invitation.toJSON()
      })) || []

      let inviteCount = invitationsResult?.count || 0;

      const requests = requestsResult?.rows?.map(request => ({
        entry_type: 3,
        // facility: "Sample",
        // first_name: "Test",
        // last_name: "Test",
        ...request.toJSON()
      })) || []

      let requestCount = requestsResult?.count || 0;
      let totalCount = userCount + inviteCount + requestCount;

      // Combine all results into one array
      const allData: any = [...users, ...invitations, ...requests];
      for (let i = 0; i < allData.length; i++) {
        let findAllFaciltiy: any = await UserResourceFacilityPermission.findAll({ where: { email: allData[i].email }, attributes: ["facility_id"] })
        findAllFaciltiy = findAllFaciltiy.map(ele => ele.facility_id)
        let facility = await Facility.findAll({
          where: {
            company_id: company, id: {
              [Op.in]: findAllFaciltiy
            }
          }, attributes: ["facility_name"]
        })
        let name = []
        facility.map(ele => name.push(ele.facility_name))
        allData[i].facility = name.join(",")
      }
      return {
        rows: allData,
        count: totalCount
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }

  }


  static async getFilteredUsers(offset, limit, company, entrytype, search): Promise<any> {
    try {
      if (entrytype == 1) {
        const usersResult = await this.findAllRegisteredUsers(offset, limit, company, entrytype, search);
        const users: any = usersResult?.rows?.map(user => ({
          entry_type: 1,
          // facility: "Sample Facility",
          ...user.toJSON()
        }));
        let userCount = usersResult?.count;
        for (let i = 0; i < users.length; i++) {
          let findAllFaciltiy: any = await UserResourceFacilityPermission.findAll({ where: { email: users[i].email }, attributes: ["facility_id"] })
          findAllFaciltiy = findAllFaciltiy.map(ele => ele.facility_id)
          let facility = await Facility.findAll({
            where: {
              company_id: company, id: {
                [Op.in]: findAllFaciltiy
              }
            }, attributes: ["facility_name"]
          })
          let name = []
          facility.map(ele => name.push(ele.facility_name))
          users[i].facility = name.join(",")
        }
        return {
          rows: users,
          count: userCount
        }
      } else if (entrytype == 2) {
        const invitationsResult: any = await this.findAllInvitedUsers(offset, limit, company, entrytype, search);
        const invitations = invitationsResult?.rows?.map(invitation => ({
          entry_type: 2,
          // facility: "",
          first_name: "",
          last_name: "",
          ...invitation.toJSON()
        }));
        for (let i = 0; i < invitations.length; i++) {
          let findAllFaciltiy: any = await UserResourceFacilityPermission.findAll({ where: { email: invitations[i].email }, attributes: ["facility_id"] })
          findAllFaciltiy = findAllFaciltiy.map(ele => ele.facility_id)
          let facility = await Facility.findAll({
            where: {
              company_id: company, id: {
                [Op.in]: findAllFaciltiy
              }
            }, attributes: ["facility_name"]
          })
          let name = []
          facility.map(ele => name.push(ele.facility_name))
          invitations[i].facility = name.join(",")
        }
        let inviteCount = invitationsResult?.count || 0;
        return {
          rows: invitations,
          count: inviteCount
        }
      } else if (entrytype == 3) {
        const requestsResult: any = await this.findAllRequestReceived(offset, limit, company, entrytype, search);
        const requests = requestsResult?.rows?.map(request => ({
          entry_type: 3,
          // facility: "Sample",
          first_name: "Test",
          last_name: "Test",
          ...request.toJSON()
        }));

        console.log("req", requestsResult);

        for (let i = 0; i < requests.length; i++) {
          let findAllFaciltiy: any = await UserResourceFacilityPermission.findAll({ where: { email: requests[i].email }, attributes: ["facility_id"] })
          findAllFaciltiy = findAllFaciltiy.map(ele => ele.facility_id)
          let facility = await Facility.findAll({
            where: {
              company_id: company, id: {
                [Op.in]: findAllFaciltiy
              }
            }, attributes: ["facility_name"]
          })
          let name = []
          facility.map(ele => name.push(ele.facility_name))
          requests[i].facility = name.join(",")
        }
        let requestCount = requestsResult?.count || 0;
        return {
          rows: requests,
          count: requestCount
        }
      }

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
  static async getUserById(id: number, company_id): Promise<any> {


    try {
      let user: any;
      if (company_id) {
        // Find user by primary key
        user = await User.findByPk(id, {
          include: [
            {
              model: UserCompanyRole,
              where: { company_id: company_id },
              required: false,
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
            [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
            [sequelize.col('UserCompanyRole.status'), 'status'],
            [sequelize.col('UserCompanyRole.company_id'), 'company_id']
          ],
        });
      } else {
        user = await User.findByPk(id, {
          include: [
            {
              model: UserCompanyRole,
              required: false,
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
            [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
            [sequelize.col('UserCompanyRole.status'), 'status'],
            [sequelize.col('UserCompanyRole.company_id'), 'company_id']
          ],
        });
      }

      let company = null;
      let companyData = null;
      const companyId = user.dataValues?.company_id;
      if (company_id) {
        company = await Company.findByPk(company_id);
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

  /**
 * Retrieves user details and associated company information from the database.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} company_id - The ID of the company.
 * @returns {Promise<Object>} - A promise resolving to an object containing user, company details, and associated companies.
 * @description This method fetches user details, company details, and associated companies from the database based on the provided user ID.
 */
  static async GetUserAndCompanyDetails(user_id, company_id): Promise<Object> {
    try {
      // Fetch user details.
      const user = await User.findOne({
        where: { id: user_id },
        attributes: ['id', 'first_name', 'email', 'last_name', 'phonenumber', 'landline', 'profile_pic',
          [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'], [sequelize.col('UserCompanyRole.Role.id'), 'role_id'], 'type', [sequelize.literal('1'), 'entry_type']
        ],
        include: {
          model: UserCompanyRole,
          attributes: [],
          include: [{
            model: Role,
            attributes: []
          }]
        }
      });
      if (company_id > 0) {
        // Fetch company details
        const companyDetail = await Company.findOne({
          where: { id: company_id },
          attributes: ['id', 'company_name', 'website', 'address1', 'address2', 'city', 'state', 'postal_code', 'country', 'unit_number', 'street_number', 'street_name']
        });


        const associatedCompaniesRaw: any = await UserCompanyRole.findAll({
          where: { user_id: user_id },
          attributes: [],
          include: [
            {
              model: Company,
              attributes: [
                'id',
                'company_name',
                'website',
                'address1',
                'address2',
                'city',
                'state',
                'postal_code',
                'country',
                'unit_number',
                'street_number',
                'street_name'
              ]
            },
            {
              model: Role,
              attributes: ['rolename', 'id'] // Include the role_name attribute
            }
          ],
        });

        console.log("Test", associatedCompaniesRaw);

        // Map the results to include the company data and the role name
        const associatedCompanies = associatedCompaniesRaw.map(assocCompany => ({
          ...assocCompany.Company.get(),
          role_name: assocCompany.Role.rolename,
          role_id: assocCompany.Role.id
        }));

        console.log("Associated Companies with Role Names:", associatedCompanies);


        // Fetch all associated companies
        // const associatedCompaniesRaw:any = await UserCompanyRole.findAll({
        //   where: { user_id: user_id },
        //   attributes: [],
        //   include: [{
        //     model: Company,
        //     attributes: ['id', 'company_name', 'website', 'address1', 'address2', 'city', 'state', 'postal_code', 'country', 'unit_number', 'street_number', 'street_name',

        //     ]

        //   },
        //   {
        //     model:Role,
        //     attributes: []
        //   }],
        // });

        // const associatedCompanies = associatedCompaniesRaw.map(assocCompany => assocCompany.Company);
        return { user, companyDetail, associatedCompanies };
      } else {
        return { user };
      }
    } catch (error) {
      throw new Error('Failed to fetch user and company details: ' + error.message);
    }

  }

  static async GetUserCompanyList(user_id): Promise<Object> {
    try {
      const associatedCompaniesRaw: any = await UserCompanyRole.findAll({
        where: { user_id: user_id },
        attributes: [],
        include: {
          model: Company,
          attributes: ['id', 'company_name', 'website', 'address1', 'address2', 'city', 'state', 'postal_code', 'country', 'unit_number', 'street_number', 'street_name']
        }
      });
      const associatedCompanies = associatedCompaniesRaw.map(assocCompany => assocCompany.Company);
      return associatedCompanies;
    } catch (error) {
      throw new Error('Failed to fetch user and company details: ' + error.message);
    }

  }

}

export { UserService };
