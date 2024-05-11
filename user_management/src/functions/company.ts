import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CompanyController } from '../controllers/companyController';
import { decodeTokenMiddleware } from "../middleware/authMiddleware";



/**
 * Creates a new company based on the provided request data.
 * 
 * @param request The HTTP request object containing company data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing company creation status.
 */
export async function CreateCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create company
        const company = await CompanyController.createCompany(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(company);

        // Return success response
        return { body: responseBody, status: 201 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Updates a company based on the provided request data.
 * 
 * @param request The HTTP request object containing company data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing company updation status.
 */
export async function UpdateCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create company
        const company = await CompanyController.updateCompany(requestData, 1);
       
        // Prepare response body
        const responseBody = JSON.stringify(company);

        // Return success response
        return { body: responseBody, status: 201 };
    } catch (error) {
        
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves all companies.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all companies.
 */
export async function ListCompanies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { offset, limit } = request.params;

        // Get all companies
        const companies = await CompanyController.listCompanies(offset, limit);
       
        // Prepare response body
        const responseBody = JSON.stringify(companies);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Get Company Detail.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all companies.
 */
export async function GetCompanyAdmin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { id } = request.params;

        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

        // Get all companies
        const company = await CompanyController.getCompanyAdmin(id);
       
        // Prepare response body
        const responseBody = JSON.stringify(company);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}
app.http('ListCompanies', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: ListCompanies,
    route: 'companies'
});
app.http('GetCompanyAdmin', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetCompanyAdmin,
    route: 'fetch/company/{id}'
});
app.http('CreateCompany', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateCompany,
    route: 'company'
});
app.http('UpdateCompany', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: UpdateCompany,
    route: 'company'
});





