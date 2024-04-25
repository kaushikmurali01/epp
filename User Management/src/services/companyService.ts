import { Company } from '../models/company';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class CompanyService {

    /**
     * Creates a new company with provided details.
     * 
     * @param companyDetails - Object containing company details such as source_of_discovery, company_type, company_name, and others.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of company creation.
     * @description Creates a new company by creating a company record in the database with specified company details. Returns a response indicating the success or failure of the creation process.
     */
    static async createCompany(companyDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const company = await Company.create(companyDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
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
    static async getCompanyById(companyId: number): Promise<any> {
        try {
            //await testDatabaseConnection();
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error(RESPONSE_MESSAGES.Success);
            }
            return { status: HTTP_STATUS_CODES.SUCCESS, data: company };
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
    static async updateCompany(companyId: number, updatedDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await company.update(updatedDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
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
        static async listCompanies(): Promise<any[]> {
            try {
                const companies = await Company.findAll();
                return companies;
            } catch (error) {
                throw error;
            }
        }
    
}



export { CompanyService };
