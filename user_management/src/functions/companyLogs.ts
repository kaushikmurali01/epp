import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CompanyLogController } from "../controllers/companyLogsController";

/**
 * Create a new company log entry.
 * 
 * @param request The HTTP request object containing log data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the created log entry.
 */
export async function CreateCompanyLog(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData = await request.json();
        const logEntry = await CompanyLogController.createCompanyLog(requestData);
        const responseBody = JSON.stringify(logEntry);

        return { body: responseBody, status: 201 };
    } catch (error) {
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Get a company log entry by its ID.
 * 
 * @param request The HTTP request object containing log ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the log entry.
 */
export async function GetCompanyLogById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
       // const logId = parseInt(request.params.id);
        const { offset, limit, id } = request.params;
        const logEntry = await CompanyLogController.getCompanyLogById(id, offset, limit);
        const responseBody = JSON.stringify(logEntry);

        return { body: responseBody, status: 200 };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}

export async function GetUserLogById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
       // const logId = parseInt(request.params.id);
        const { offset, limit, id } = request.params;
        const logEntry = await CompanyLogController.getCompanyLogByUserId(id, offset, limit);
        const responseBody = JSON.stringify(logEntry);

        return { body: responseBody, status: 200 };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * List all company log entries.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the list of log entries.
 */
export async function ListCompanyLogs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const logEntries = await CompanyLogController.getAllCompanyLogs(request.params);
        const responseBody = JSON.stringify(logEntries);

        return { body: responseBody, status: 200 };
    } catch (error) {
        return { status: 500, body: `${error.message}` };
    }
}





// Azure Function HTTP triggers
app.http('CreateCompanyLog', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateCompanyLog,
    route: 'companyLog',
});

app.http('GetCompanyLogById', {
    route: 'companyLog/{id}/{offset}/{limit}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetCompanyLogById
});
app.http('GetUserLogById', {
    route: 'userLog/{id}/{offset}/{limit}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetUserLogById
});



app.http('ListCompanyLogs', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'companyLog',
    handler: ListCompanyLogs
});


