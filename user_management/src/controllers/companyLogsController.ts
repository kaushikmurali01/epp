import { HttpRequest, HttpResponse } from "@azure/functions";
import { CompanyLogsService } from '../services/companyLogsService';

class CompanyLogsController {
    
    /**
     * Creates a new company log.
     * 
     * @param req - The HTTP request object containing log data.
     * @returns Promise<HttpResponse>
     * @description Handles the creation of a new company log by extracting necessary data from the request body, invoking the CompanyLogsService to create the log, and returning an HTTP response with appropriate status and JSON data.
     */
    static async createCompanyLog(req): Promise<any> {
        try {
            const requestData = req;
            const companyLog = await CompanyLogsService.createCompanyLog(requestData);
            return companyLog;
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a company log by its ID.
     * 
     * @param logId - The ID of the log to retrieve.
     * @returns Promise<HttpResponse>
     * @description Handles the retrieval of a company log by its ID by invoking the CompanyLogsService to get the log, and returning an HTTP response with appropriate status and JSON data.
     */
    static async getCompanyLog(logId: number): Promise<any> {
        try {
            const companyLog = await CompanyLogsService.getCompanyLog(logId);
            return companyLog;
        } catch (error) {
            return { status: 404, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a list of company logs.
     * 
     * @param offset - The offset for pagination.
     * @param limit - The number of records to return.
     * @param filter - Optional filters for the query.
     * @param order - The order of the records.
     * @returns Promise<HttpResponse>
     * @description Handles the retrieval of a list of company logs with pagination and filtering options.
     */
    static async listCompanyLogs(offset, limit, filter, order): Promise<any> {
        try {
            const [count, rows] = await CompanyLogsService.listCompanyLogs(offset, limit, filter, order);
            return { status: 204, data: { count, rows } };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Updates an existing company log.
     * 
     * @param logId - The ID of the log to update.
     * @param req - The HTTP request object containing updated log data.
     * @returns Promise<HttpResponse>
     * @description Handles updating a company log by invoking the CompanyLogsService.
     */
    static async updateCompanyLog(logId: number, req): Promise<any> {
        try {
            const updatedData = req;
            const updatedLog = await CompanyLogsService.updateCompanyLog(logId, updatedData);
            return updatedLog;
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }

    /**
     * Deletes a company log by its ID.
     * 
     * @param logId - The ID of the log to delete.
     * @returns Promise<HttpResponse>
     * @description Handles deleting a company log by invoking the CompanyLogsService.
     */
    static async deleteCompanyLog(logId: number): Promise<any> {
        try {
            const deletedLog = await CompanyLogsService.deleteCompanyLog(logId);
            return deletedLog;
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }

    /**
     * Retrieves logs related to a specific company.
     * 
     * @param companyId - The ID of the company whose logs to retrieve.
     * @returns Promise<HttpResponse>
     * @description Fetches logs related to a specific company.
     */
    static async getCompanyLogsByCompanyId(companyId: number): Promise<any> {
        try {
            const logs = await CompanyLogsService.getCompanyLogsByCompanyId(companyId);
            return { status: 204, data: logs };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }
}

export { CompanyLogsController };
