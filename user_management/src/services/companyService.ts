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

            console.log("AdminUsers2345", adminUsers);

            return adminUsers;
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
    static async deleteCompany(companyId: number): Promise<Response> {
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

    /**
     * Retrieves a list of companies.
     * 
     * @returns Promise<Response>
     * @description Retrieves a list of companies from the database.
     */
    static async listCompanies(offset, limit, searchPromt, companyFilter, order, colName): Promise<any[]> {
        try {
            let filterCheck = ""
            if (companyFilter && companyFilter > 0) {
                filterCheck = `AND c.company_type=${companyFilter}`
            }
            let [count, rows]: any = await Promise.all([rawQuery(`SELECT COUNT(*) AS count FROM "company" c
            INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
            INNER JOIN "users" u ON cr.user_id = u.id
            WHERE cr.role_id= 1 ${filterCheck} AND (c.company_name ILIKE '%${searchPromt}%' or u.first_name ILIKE '%${searchPromt}%')`), rawQuery(`SELECT c.*, u.id as user_id,u.first_name as first_name,u.last_name last_name,u.email as email FROM "company" c
            INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
            INNER JOIN "users" u ON cr.user_id = u.id
            WHERE cr.role_id= 1 ${filterCheck} AND (c.company_name ILIKE '%${searchPromt}%' or u.first_name ILIKE '%${searchPromt}%') ORDER by ${colName} ${order} LIMIT :limit OFFSET :offset`, {
                limit: limit,
                offset: offset
            })])
            // role =1 for super admin
            // const companies = await Company.findAll(
            //     {
            //         include: [
            //             {
            //                 model: User,
            //                 through: {
            //                     model: UserCompanyRole,
            //                     where: { role_id: 1 }, // Filter by role = 1 for superAdmin
            //                 }
            //             }
            //         ],
            //         where: {
            //             [Op.or]: [
            //                 { company_name: { [Op.iLike]: `%${searchPromt}%` } }, // Search for companies by name
            //                 { '$users.first_name$': { [Op.iLike]: `%${searchPromt}%` } },// Search for users by firstname
            //                 { '$users.last_name$': { [Op.iLike]: `%${searchPromt}%` } } // Search for users by last_name
            //             ]
            //         }
            //     });

            // {
            //     where: {
            //         [Op.or]: [
            //             { company_name: { [Op.iLike]: `%${searchPromt}%` } },
            //             { id: searchPromt },
            //         ]
            //     },
            //     offset: offset,
            //     limit: limit,
            //     attributes: ['company_name', 'id', 'company_type', 'is_active']
            // }
            // );
            // const data = companies.map(user => ({
            //     company_type: 'Customer',
            //     email: "test@test.com",
            //     superAdmin: "Test Admin",
            //     status: "Active",
            //     ...user.toJSON()
            // }));
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

    static async SendEmailsToAllAdmins(adminData, title, body): Promise<any> {
        console.log("adminData", adminData);
        // Extracting the superadmin email
        const superAdminEmail = adminData.superAdmin.email;
        let contentAdmin = body.replace("#name#", adminData.superAdmin.name).replace('#isDisplay#', 'none');
        // Sending email to the superadmin
        await Email.send(superAdminEmail, title, contentAdmin);

        // Extracting subadmin emails and sending emails
        adminData.subAdmins.forEach(subAdmin => {
            const subAdminEmail = subAdmin.email;
            let content = body.replace("#name#", subAdmin.name).replace('#isDisplay#', 'none');
            Email.send(subAdminEmail, title, content);
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

}



export { CompanyService };
