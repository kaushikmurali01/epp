import { Company } from '../models/company';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { User } from '../models/user';
import { UserCompanyRole } from '../models/user-company-role';
import { Role } from '../models/role';
import { rawQuery, sequelize } from './database';
import { Op } from 'sequelize';

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
            const company = await Company.create(companyDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, data: company };
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
            //await testDatabaseConnection();
            // const company = await Company.findByPk(companyId);


            // if (!company) {
            //     throw new Error(RESPONSE_MESSAGES.Success);
            // }
            // return { status: HTTP_STATUS_CODES.SUCCESS, data: company };

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
                attributes: ['first_name', 'last_name', 'id', 'email',
                    [sequelize.col('UserCompanyRole.Role.rolename'), 'role_name'],
                    [sequelize.col('UserCompanyRole.Company.company_name'), 'company_name'],
                    [sequelize.col('UserCompanyRole.Company.id'), 'company_id']
                ]
            });
            // return adminUsers.dataValues;
            return { status: HTTP_STATUS_CODES.SUCCESS, data: adminUsers };
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
            //await testDatabaseConnection();
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            let result = await company.update(updatedDetails);
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
    static async listCompanies(offset, limit, searchPromt, companyFilter): Promise<any[]> {
        try {
            let datas = await rawQuery(`SELECT c.*, u.id as user_id,u.first_name as first_name,u.last_name last_name,u.email as email FROM "company" c
            INNER JOIN "user_company_role" cr ON c.id = cr.company_id 
            INNER JOIN "users" u ON cr.user_id = u.id
            WHERE cr.role_id= 1 AND (c.company_name LIKE '%${searchPromt}%' or u.first_name LIKE '%${searchPromt}%') LIMIT :limit OFFSET :offset`, {
                limit: limit,
                offset: offset
            })
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
            return datas;
        } catch (error) {
            throw error;
        }
    }

}



export { CompanyService };
