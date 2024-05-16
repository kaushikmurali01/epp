import { HttpRequest, HttpResponse } from "@azure/functions";
import { CompanyService } from '../services/companyService';
import { Email } from "../services/email";
import { EmailContent } from "../utils/emailContent";
import { EmailTemplate } from "../utils/emailTemplate";

class CompanyController {

    /**
     * Creates a new company.
     * 
     * @param req - The HTTP request object containing company data.
     * @returns Promise<HttpResponse>
     * @description Handles the creation of a new company by extracting necessary data from the request body, invoking the CompanyService to create the company, and returning an HTTP response with appropriate status and JSON data.
     */
    static async createCompany(req): Promise<any> {
        try {
            console.log("req987", req);
            const requestData = req;
            const company = await CompanyService.createCompany(requestData);
            return company;
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a company by its ID.
     * 
     * @param req - The HTTP request object containing company ID.
     * @returns Promise<HttpResponse>
     * @description Handles the retrieval of a company by its ID by extracting the company ID from the request parameters, invoking the CompanyService to get the company, and returning an HTTP response with appropriate status and JSON data.
     */
    static async getCompanyAdmin(companyId): Promise<any> {
        try {
            // const companyId  = parseInt(req.params.id);
            const company = await CompanyService.getCompanyAdmin(companyId);
            return company;
        } catch (error) {
            return { status: 404, body: { error: error.message } };
        }
    }

    /**
 * Retrieves a list of companies.
 * 
 * @param req - The HTTP request object.
 * @returns Promise<Response>
 * @description Handles the retrieval of a list of companies, invoking the CompanyService to retrieve the companies, and returning an HTTP response with appropriate status and JSON data.
 */
    static async listCompanies(offset, limit, searchPromt, companyFilter): Promise<any> {
        try {
            const [count, rows] = await CompanyService.listCompanies(offset, limit, searchPromt, companyFilter);
            return { status: 204, data: { count, rows } };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }


    /**
     * Updates an existing company.
     * 
     * @param req - The HTTP request object containing updated company data.
     * @returns Promise<HttpResponse>
     * @description Handles the update of an existing company by extracting necessary data from the request body and parameters, invoking the CompanyService to update the company, and returning an HTTP response with appropriate status and JSON data.
     */
    static async updateCompany(req, companyId): Promise<any> {
        try {
            //  const companyId = parseInt(req.id);
            const updatedData = req;
            const updatedCompany = await CompanyService.updateCompany(companyId, updatedData);
            return updatedCompany;
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }

    /**
     * Send an alert on email.
     * 
     * @param req - The HTTP request object containing updated company data.
     * @returns Promise<HttpResponse>
     */
    static async sendAlertForCompany(requestData, companyId): Promise<any> {
        try {
            const company = await CompanyService.getCompanyAdmin(companyId);
            let template = await EmailTemplate.getEmailTemplate();
            let logo: any = EmailTemplate.getLogo();
            if (!requestData.first_name) requestData.first_name = '';
            template = template.replace('#heading#', 'Alert from admin')
                .replace('#content#', requestData.message)
                .replace('#name#', company?.data.first_name)
                .replace('#logo#', logo);
            Email.send(company?.data?.email, EmailContent.alertEmail.title, template);
            const resp = { status: 200, body: 'Alert Sent successfully' };
            return resp;
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }
    /**
     * Deletes an existing company.
     * 
     * @param req - The HTTP request object containing company ID.
     * @returns Promise<HttpResponse>
     * @description Handles the deletion of an existing company by extracting the company ID from the request parameters, invoking the CompanyService to delete the company, and returning an HTTP response with appropriate status and JSON data.
     */
    static async deleteCompany(req: HttpRequest): Promise<any> {
        try {
            const companyId = parseInt(req.params.id);
            await CompanyService.deleteCompany(companyId);
            return { status: 204 };
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }
}

export { CompanyController };
