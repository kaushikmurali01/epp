import { HttpRequest } from "@azure/functions";
import { CompanyLogsService } from './service';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class CompanyLogController {

    /**
     * Creates a new company log.
     * 
     * @param requestData - The HTTP request data containing the log details.
     * @returns Promise<Object>
     * @description Handles the creation of a new company log and returns an HTTP response with appropriate status.
     */
    static async createCompanyLog(requestData): Promise<Object> {
        try {
            const log = await CompanyLogsService.createCompanyLog(requestData);
            return { status: 201, body: log };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves all company logs with optional pagination.
     * 
     * @param req - The HTTP request containing optional query parameters for pagination (offset, limit).
     * @returns Promise<Object>
     * @description Fetches all company logs, with optional pagination via query parameters.
     */
    static async getAllCompanyLogs(req: any): Promise<Object> {
        try {
            const offset = Number(req.query.offset || 0);
            const limit = Number(req.query.limit || 10);
            const logs = await CompanyLogsService.getAllCompanyLogs(offset, limit);
            return { status: 201, body: logs };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a specific company log by ID.
     * 
     * @param req - The HTTP request containing the log ID in the parameters.
     * @returns Promise<Object>
     * @description Fetches a specific company log by its ID.
     */
    static async getCompanyLogById(company_id, offset, limit): Promise<Object> {
        try {
            const log = await CompanyLogsService.getCompanyLogById(company_id, offset, limit);
            if (log) {
                return { status: 200, body: log };
            } else {
                return { status: 500, body: { message: RESPONSE_MESSAGES.userNotFound } };
            }
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    static async getCompanyLogByUserId(user_id, offset, limit): Promise<Object> {
        try {
            const log = await CompanyLogsService.getCompanyLogByUserId(user_id, offset, limit);
            if (log) {
                return { status: 200, body: log };
            } else {
                return { status: 500, body: { message: RESPONSE_MESSAGES.userNotFound } };
            }
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Updates an existing company log by ID.
     * 
     * @param req - The HTTP request containing the log ID in the parameters and updated data in the body.
     * @returns Promise<Object>
     * @description Updates an existing company log.
     */
    static async updateCompanyLog(req: HttpRequest): Promise<Object> {
        try {
            const logId = parseInt(req.params.id);
            const updateData = req.body;
            await CompanyLogsService.updateCompanyLog(logId, updateData);
            return { status: 200, body: { message: RESPONSE_MESSAGES.Success } };
        } catch (error) {
            return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: { error: error.message } };
        }
    }

    /**
     * Deletes a company log by ID.
     * 
     * @param req - The HTTP request containing the log ID in the parameters.
     * @returns Promise<Object>
     * @description Deletes a company log by its ID.
     */
    static async deleteCompanyLog(req: HttpRequest): Promise<Object> {
        try {
            const logId = parseInt(req.params.id);
            const success = await CompanyLogsService.deleteCompanyLog(logId);
            if (success) {
                return { status: 200 };
            } else {
                return { status: HTTP_STATUS_CODES.RECORD_NOT_FOUND, body: { message: RESPONSE_MESSAGES.userNotFound } };
            }
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }
}

export { CompanyLogController };
