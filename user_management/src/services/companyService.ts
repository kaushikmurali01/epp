import { Company } from '../models/company';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { User } from '../models/user';
import { UserCompanyRole } from '../models/user-company-role';
import { Role } from '../models/role';
import { rawQuery, sequelize } from './database';
import { Op } from 'sequelize';
import { Email } from './email';
import { ParticipantAgreement } from '../models/participantAgreement';
import { UserService } from './userService';
import { UserCompanyRolePermission } from '../models/userCompanyRolePermission';
import { UserInvitation } from '../models/user-invitation';
import { UserRequest } from '../models/user-request';
import { Facility } from '../models/facility';

class CompanyService {

    /**
     * Creates a new company with provided details.
     * 
     * @param companyDetails - Object containing company details such as source_of_discovery, company_type, company_name, and others.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of company creation.
     * @description Creates a new company by creating a company record in the database with specified company details. Returns a response indicating the success or failure of the creation process.
     */
    static async createCompany(companyDetails): Promise<any> {
        try {
            //await testDatabaseConnection();
            console.log("companyDetails", companyDetails)
            companyDetails.is_active = 1
            const company = await Company.create(companyDetails);
            return company;
            //return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, data: company };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    static async getCompanyUser(companyId: number, role_id): Promise<any> {
        try {
            const adminUsers = await User.findOne({
                include: [
                    {
                        model: UserCompanyRole,
                        where: { company_id: companyId, role_id: role_id },
                        attributes: [],

                        include: [
                            {
                                model: Role,
                                where: { id: role_id },
                                attributes: []
                            },
                            {
                                model: Company,
                                where: { id: companyId },
                                attributes: []
                            }
                        ]
                    }
                ],
                attributes: ['first_name', 'last_name', 'id', 'email', 'landline', 'profile_pic',
                    [sequelize.col('UserCompanyRole.Role.rolename'), 'role_name'],
                    [sequelize.col('UserCompanyRole.Company.company_name'), 'company_name'],
                    [sequelize.col('UserCompanyRole.Company.company_type'), 'company_type'],
                    [sequelize.col('UserCompanyRole.Company.website'), 'website'],
                    [sequelize.col('UserCompanyRole.Company.id'), 'company_id']
                ]
            });

            console.log("AdminUsers2345", adminUsers);

            return adminUsers;
            // return adminUsers.dataValues;
            // return { status: HTTP_STATUS_CODES.SUCCESS, data: adminUsers };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a company by its ID.
     * 
     * @param companyId - The ID of the company to retrieve.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved company data.
     * @description Retrieves a company from the database by its ID. Returns a response containing the retrieved company data.
     */
    static async getCompanyAdmin(companyId: number): Promise<any> {
        try {

            const facilities = await Facility.findAll({
                where: { company_id: companyId },
                raw: true
            });

            // Fetch company data
            const company = await Company.findOne({
                where: { id: companyId },
                raw: true
            });

            // Fetch user roles data
            const userRoles = await UserCompanyRole.findAll({
                where: { company_id: companyId },
                attributes: ['id', 'user_id', 'company_id', 'role_id',
                    [sequelize.col('Role.rolename'), 'role_name'],
                    [sequelize.col('User.first_name'), 'first_name'],
                    [sequelize.col('User.last_name'), 'last_name'],
                    [sequelize.col('User.email'), 'email'],
                    [sequelize.col('User.phonenumber'), 'phonenumber'],
                    [sequelize.col('Company.company_name'), 'company_name'],
                ],
                include: [
                    {
                        model: User,
                        attributes: []
                    },
                    {
                        model: Role,
                        attributes: []

                    },
                    {
                        model: Company,
                        attributes: []

                    }
                ],
                raw: true,
                // nest: true
            });

            // Combine the results into the desired format
            const result = {
                facilities: facilities,
                company: company,
                user_roles: userRoles
            };
            // const adminUsers = await User.findOne({
            //     include: [
            //         {
            //             model: UserCompanyRole,
            //             where: { company_id: companyId, role_id: 1 },
            //             attributes: [],

            //             include: [
            //                 {
            //                     model: Role,
            //                     where: { id: 1 },
            //                     attributes: []
            //                 },
            //                 {
            //                     model: Company,
            //                     where: { id: companyId },
            //                     attributes: []
            //                 }
            //             ]
            //         }
            //     ],
            //     attributes: ['first_name', 'last_name', 'id', 'email', 'landline', 'profile_pic',
            //         [sequelize.col('UserCompanyRole.Role.rolename'), 'role_name'],
            //         [sequelize.col('UserCompanyRole.Company.company_name'), 'company_name'],
            //         [sequelize.col('UserCompanyRole.Company.company_type'), 'company_type'],
            //         [sequelize.col('UserCompanyRole.Company.website'), 'website'],
            //         [sequelize.col('UserCompanyRole.Company.id'), 'company_id']
            //     ]
            // });

            return result;
            // return adminUsers.dataValues;
            // return { status: HTTP_STATUS_CODES.SUCCESS, data: adminUsers };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Updates an existing company with new details.
     * 
     * @param companyId - The ID of the company to update.
     * @param updatedDetails - Object containing updated company details.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of company update.
     * @description Updates an existing company in the database with new details. Returns a response indicating the success or failure of the update process.
     */
    static async updateCompany(companyId: number, updatedDetails): Promise<any> {
        try {
            delete updatedDetails.company_id;
            //await testDatabaseConnection();
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            console.log(updatedDetails, { where: { id: companyId } })
            let result = await Company.update(updatedDetails, { where: { id: Number(companyId) } });
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, company: result };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
    static async UpdateCompanyStatus(companyId: number, updatedDetails): Promise<any> {
        try {
            let result = await Company.update(updatedDetails, { where: { id: Number(companyId) } });
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, company: result };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Deletes an existing company.
     * 
     * @param companyId - The ID of the company to delete.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of company deletion.
     * @description Deletes an existing company from the database. Returns a response indicating the success or failure of the deletion process.
     */
    static async deleteCompanyNeedToRemove(companyId: number): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await company.destroy();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    static async searchCompanies(
        offset,
        limit,
        companyFilter,
        data,
        colName,
        order
      ): Promise<any[]> {
        try {
          let filterCheck = "";
          if (companyFilter && companyFilter > 0) {
            filterCheck = `AND c.company_type=${companyFilter}`;
          }
    
          let bindParams = {limit, offset};
          let index = 2;
          let filterConditions = '';
          let filterConditionsOr = '';
    
          if(!data) data = [];
          
          const orArray = data
  .filter(item => item.key === "city")
  .flatMap(item => [
    item,
    { key: "address1", value: item.value },
    { key: "address2", value: item.value },
    { key: "unit_number", value: item.value },
    { key: "street_name", value: item.value },
    { key: "street_number", value: item.value },
    { key: "state", value: item.value },
    { key: "country", value: item.value },
    { key: "postal_code", value: item.value }
  ]);

  console.log("orArray", orArray);

const andArray = data.filter(item => item.key !== "city");
          

        if (andArray.length > 0) {
            const conditions = andArray.map((item, index) => {
              const paramName = `param${index + 1}`;
              bindParams[paramName] = `%${item.value}%`;
              return `${item.key} ILIKE '${bindParams[paramName]}'`;
            });
            filterConditions = `AND (${conditions.join(' AND ')})`;
          }

          if (orArray.length > 0) {
            const conditions = orArray.map((item, index) => {
              const paramName = `param${index + 1}`;
              bindParams[paramName] = `%${item.value}%`;
              return `${item.key} ILIKE '${bindParams[paramName]}'`;
            });
            filterConditionsOr = `AND (${conditions.join(' OR ')})`;
          }
          console.log("Bind", bindParams);
    
          let [count, rows]: any = await Promise.all([
            rawQuery(`SELECT COUNT(*) AS count FROM "company" c
                INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
                INNER JOIN "users" u ON cr.user_id = u.id
                WHERE cr.role_id= 1 ${filterCheck} ${filterConditions} ${filterConditionsOr}`),
            rawQuery(
              `SELECT c.*, u.id as user_id,u.first_name as first_name,u.last_name last_name,u.email as email, uc.count, pa.is_signed as is_pa_signed FROM "company" c
                INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
                INNER JOIN "users" u ON cr.user_id = u.id
                LEFT JOIN (
             SELECT company_id, COUNT(*) AS count
             FROM "user_company_role"
             GROUP BY company_id
         ) uc ON c.id = uc.company_id
          LEFT JOIN "participant_agreement" pa on c.id = pa.company_id
                WHERE cr.role_id= 1 ${filterCheck} ${filterConditions} ${filterConditionsOr} ORDER by ${colName} ${order} LIMIT :limit OFFSET :offset`,
              {
                limit: limit,
                offset: offset,
              }
            ),

            
          ]);
    
       
          return [count[0].count, rows];
        } catch (error) {
          throw error;
        }
      }

    /**
     * Retrieves a list of companies.
     * 
     * @returns Promise<Response>
     * @description Retrieves a list of companies from the database.
     */
    static async listCompanies(offset, limit, searchPromt, companyFilter, order, colName): Promise<any[]> {
        try {
            // let filterCheck = ""
            // if (companyFilter && companyFilter > 0) {
            //     filterCheck = `AND c.company_type=${companyFilter}`
            // }
            // let [count, rows]: any = await Promise.all([rawQuery(`SELECT COUNT(*) AS count FROM "company" c
            // INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
            // INNER JOIN "users" u ON cr.user_id = u.id
            // WHERE cr.role_id= 1 ${filterCheck} AND (c.company_name ILIKE '%${searchPromt}%' or u.first_name ILIKE '%${searchPromt}%')`), 
            
            // rawQuery(`SELECT c.*, u.id as user_id,u.first_name as first_name,u.last_name last_name,u.email as email FROM "company" c
            // INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
            // INNER JOIN "users" u ON cr.user_id = u.id
            // WHERE cr.role_id= 1 ${filterCheck} AND (c.company_name ILIKE '%${searchPromt}%' or u.first_name ILIKE '%${searchPromt}%') ORDER by ${colName} ${order} LIMIT :limit OFFSET :offset`, {
            //     limit: limit,
            //     offset: offset
            // })])
            
            // New start
            let filterCheck = ""
            if (companyFilter && companyFilter > 0) {
                filterCheck = `AND c.company_type=${companyFilter}`
            }
            
            let [count, rows]: any = await Promise.all([
                rawQuery(`SELECT COUNT(*) AS count 
                          FROM "company" c
                          INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
                          INNER JOIN "users" u ON cr.user_id = u.id
                          WHERE cr.role_id = 1 ${filterCheck} 
                            AND (c.company_name ILIKE '%${searchPromt}%' 
                                 OR u.first_name ILIKE '%${searchPromt}%')`),
                
                rawQuery(`SELECT c.*, 
                                 u.id as user_id,
                                 u.first_name as first_name,
                                 u.last_name as last_name,
                                 u.email as email,
                                 uc.count,
                                 pa.is_signed as is_pa_signed
                          FROM "company" c
                          INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
                          INNER JOIN "users" u ON cr.user_id = u.id
                          LEFT JOIN (
                              SELECT company_id, COUNT(*) AS count
                              FROM "user_company_role"
                              GROUP BY company_id
                          ) uc ON c.id = uc.company_id
                           LEFT JOIN "participant_agreement" pa on c.id = pa.company_id
                          WHERE cr.role_id = 1 ${filterCheck} 
                            AND (c.company_name ILIKE '%${searchPromt}%' 
                                 OR u.first_name ILIKE '%${searchPromt}%') 
                          ORDER BY ${colName} ${order} 
                          LIMIT :limit OFFSET :offset`, {
                    limit: limit,
                    offset: offset
                })
            ]);
            
            // New end
            return [count[0].count, rows];
        } catch (error) {
            throw error;
        }
    }
    static async DropDownCompanies(): Promise<any[]> {
        try {

            let result = await Company.findAll({ attributes: ["company_name", "id", "is_active"] })
            return result;
        } catch (error) {
            throw error;
        }
    }
    static async checkExistSuperAdmin(user_id, company_id): Promise<any> {
        try {
            let result = await UserCompanyRole.findOne({ where: { is_active: 1, user_id, company_id, role_id: 1 } })
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async SendEmailsToAllAdmins(adminData, title, body): Promise<any> {
        console.log("adminData", adminData);
        // Extracting the superadmin email
        const superAdminEmail = adminData?.superAdmin?.email;
        let contentAdmin = body.replace("#name#", adminData?.superAdmin?.name).replace('#isDisplay#', 'none');
        // Sending email to the superadmin
        await Email.send(superAdminEmail, title, contentAdmin);

        // Extracting subadmin emails and sending emails
        adminData.subAdmins.forEach(subAdmin => {
            if (subAdmin) {
                const subAdminEmail = subAdmin.email;
                let content = body.replace("#name#", subAdmin.name).replace('#isDisplay#', 'none');
                Email.send(subAdminEmail, title, content);
            }
        });

    }

    static async GetAdminsAndSendEmails(company_id, title, body): Promise<any> {

        const adminData = await this.GetAdminsOfCompany(company_id);
        await this.SendEmailsToAllAdmins(adminData, title, body)

    }

    static async GetAdminsOfCompany(company_id): Promise<any> {
        try {
            // Fetch the company details
            const company = await Company.findByPk(company_id);
            if (!company) {
                throw new Error('Company not found');
            }

            // Fetch the user roles related to the company
            const userRoles = await UserCompanyRole.findAll({
                where: { company_id },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'first_name', 'last_name', 'email'],
                    },
                    {
                        model: Role,
                        attributes: ['id', 'rolename'],
                    },
                    {
                        model: Company,
                        attributes: ['company_name'],
                    },
                ],
            });

            // Filter the super admin and sub admins
            const superAdmin: any = userRoles.find(
                (userRole) => userRole.role_id === 1 // Super admin role ID is 1
            );
            const subAdmins: any = userRoles.filter(
                (userRole) => userRole.role_id === 2 // Sub admin role ID is 2
            );

            // Prepare the response
            const result = {
                company: company.company_name,
                superAdmin: superAdmin
                    ? {
                        email: superAdmin.User.email,
                        name: `${superAdmin.User.first_name} ${superAdmin.User.last_name}`,
                        role: superAdmin.Role.rolename,
                    }
                    : null,
                subAdmins: subAdmins.map((admin) => ({
                    email: admin.User.email,
                    name: `${admin.User.first_name} ${admin.User.last_name}`,
                    role: admin.Role.rolename,
                })),
            };

            return result;

        }
        catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }

    static async GetCompanyById(company_id): Promise<any> {

        const company = await Company.findByPk(company_id);
        return company;


    }

    /**
     * Deletes a company and associated records.
     * 
     * @param {number} companyId - The ID of the company to delete.
     * @returns {Promise<any>} - A promise that resolves when the operation is complete.
     * @throws {Error} - Throws an error if the operation fails.
     */
    static async deleteCompany(companyId): Promise<any> {
        let transaction;

        try {
            // Start a transaction
            transaction = await sequelize.transaction();

            // Find all users associated with the company
            const companyUsers = await UserCompanyRole.findAll({
                where: { company_id: companyId },
                transaction
            });

            // Perform deletions
            await Promise.all([
                UserRequest.destroy({
                    where: { company_id: companyId },
                    transaction
                }),
                UserInvitation.destroy({
                    where: { company: companyId },
                    transaction
                }),
                ParticipantAgreement.destroy({
                    where: { company_id: companyId },
                    transaction
                }),
                UserCompanyRole.destroy({
                    where: { company_id: companyId },
                    transaction
                }),
                Company.destroy({
                    where: { id: companyId },
                    transaction
                })
            ]);


            // Commit the transaction after successful deletions
            await transaction.commit();

            // Check and convert associated users to individual users
            await Promise.all(companyUsers.map(user =>
                UserService.CheckAndMakeUserIndividual(user.user_id)
            ));
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };

        } catch (error) {
            // Rollback the transaction in case of error
            if (transaction) {
                await transaction.rollback();
            }

            // Rethrow the error to be handled by the caller if necessary
            throw new Error(`${error.message}`);
        }
    }

    static async MakeCompanyInActive(companyId): Promise<any> {
        let transaction;
        try {
            // Start a transaction
            transaction = await sequelize.transaction();

            // Update the company's is_active status to 0
            await Company.update(
                { is_active: 0 },
                {
                    where: { id: companyId },
                    transaction
                }
            );

            // Destroy associated user company role permissions
            await UserCompanyRolePermission.destroy({
                where: { company_id: companyId },
                transaction
            });

            // Commit the transaction after successful operations
            await transaction.commit();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            // Rollback the transaction in case of error
            if (transaction) {
                await transaction.rollback();
            }
            // Rethrow the error to be handled by the caller if necessary
            throw new Error(`${error.message}`);
        }

    }

    static async GetCompanyUser(offset, limit, company_id): Promise<any[]> {
        try {
          const result: any = await UserCompanyRole.findAndCountAll({
            where: { company_id: company_id },
            attributes: [
              "id",
              "user_id",
              "company_id",
              "role_id",
              [sequelize.col("Role.rolename"), "role_name"],
              [sequelize.col("User.first_name"), "first_name"],
              [sequelize.col("User.last_name"), "last_name"],
              [sequelize.col("User.email"), "email"],
              [sequelize.col("User.createdAt"), "created_at"],
              [sequelize.col("Company.company_name"), "company_name"],
            ],
            include: [
              {
                model: User,
                attributes: [],
              },
              {
                model: Company,
                attributes: [],
              },
              {
                model: Role,
                attributes: [],
              },
            ],
            limit,
            offset,
            raw: true,
            // nest: true
          });
          return result;
        } catch (error) {
          throw error;
        }
      }

      static async getCompanyAdmin2(companyId: number): Promise<any> {
        try {
          const adminUsers = await User.findOne({
              include: [
                  {
                      model: UserCompanyRole,
                      where: { company_id: companyId, role_id: 1 },
                      attributes: [],
     
                      include: [
                          {
                              model: Role,
                              where: { id: 1 },
                              attributes: []
                          },
                          {
                              model: Company,
                              where: { id: companyId },
                              attributes: []
                          }
                      ]
                  }
              ],
              attributes: ['first_name', 'last_name', 'id', 'email', 'landline', 'profile_pic',
                  [sequelize.col('UserCompanyRole.Role.rolename'), 'role_name'],
                  [sequelize.col('UserCompanyRole.Company.company_name'), 'company_name'],
                  [sequelize.col('UserCompanyRole.Company.company_type'), 'company_type'],
                  [sequelize.col('UserCompanyRole.Company.website'), 'website'],
                  [sequelize.col('UserCompanyRole.Company.id'), 'company_id']
              ]
          });
     
          return adminUsers;
          // return adminUsers.dataValues;
          // return { status: HTTP_STATUS_CODES.SUCCESS, data: adminUsers };
        } catch (error) {
          throw new Error(`${error.message}`);
        }
      }

}



export { CompanyService };
