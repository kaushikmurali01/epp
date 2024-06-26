import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CompanyController } from '../controllers/companyController';
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { Company } from "../models/company";
import { sequelize } from "../services/database";
import { CompanyService } from "../services/companyService";



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
 * Updates a company status based on the provided request data.
 * 
 * @param request The HTTP request object containing company data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing company updation status.
 */
export async function UpdateCompanyStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json();
        const { id } = request.params;
        const company = await CompanyController.UpdateCompanyStatus(id, requestData);

        const responseBody = JSON.stringify(company);
        // Prepare response body
        return { body: responseBody, status: 201 };
    } catch (error) {

        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Sent a alert for company on the provided request data.
 * 
 * @param request The HTTP request object containing company data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing compnay alert send on mail.
 */
export async function sendAlertForCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const { id } = request.params;
        // let checkStatus = await CheckCompanyStatus(id)
        // if (!checkStatus) {
        //     return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        // }
        const requestData = await request.json();
        const company = await CompanyController.sendAlertForCompany(requestData, id);

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
        const { pageOffset, pageLimit } = request.params;
        const searchPromt = request.query.get('search') || "";
        const companyFilter = request.query.get('company_type');
        const order = request.query.get('order') || 'ASC';
        const colName = request.query.get('col_name') || 'id';
        // Get all companies
        const companies = await CompanyController.listCompanies(pageOffset, pageLimit, searchPromt, companyFilter, order, colName);

        // Prepare response body
        const responseBody = JSON.stringify(companies);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function SearchCompanies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
       // const { pageOffset, pageLimit } = request.params;
       // const companyFilter = request.query.get('company_type');
      //  const order = request.query.get('order') || 'ASC';
       // const colName = request.query.get('col_name') || 'id';
        const requestData:any = await request.json();
        let data = requestData.data;
        let companyFilter = requestData.company_type;
        let pageOffset = requestData.offset;
        let pageLimit = requestData.limit;
        let col_name = requestData.col_name || 'id';
        let order = requestData.order || 'ASC';

        // Get serached companies
        const companies = await CompanyController.searchCompanies(pageOffset, pageLimit, companyFilter, data, col_name, order);

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
 * Retrieves all companies user except of superUser.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all companies.
 */
export async function getCompanyUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { company_id } = request.params;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        const id = resp.id
        const companies = await CompanyController.getCompanyUser(id, company_id);

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
 * Update change super user for company
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all companies.
 */
export async function changeSuperUserForCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { company_id, user_id } = request.params;
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
        const id = resp.id
        const companies = await CompanyController.changeCompanySuperUser(id, company_id, user_id);
        return companies
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}
/**
 * Retrieves all companies for dropDown.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all companies.
 */
export async function DropDownCompanies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const companies = await CompanyController.DropDownCompanies();

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
        // let checkStatus = await CheckCompanyStatus(id)
        // if (!checkStatus) {
        //     return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
        // }
        await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

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

export async function CheckCompanyByName(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        const { company_name } = request.params;
        // const company = await Company.findOne({ where: { company_name: company_name } });

        const company = await Company.findOne({
            where: sequelize.where(sequelize.fn('LOWER', sequelize.col('company_name')), company_name.toLowerCase())
        });
        let resp: object;
        if (company) {
            resp = {
                status: 200,
                exists: true
            }
        } else {
            resp = {
                status: 200,
                exists: false
            }
        }

        // Prepare response body
        const responseBody = JSON.stringify(resp);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function GetCompanyAdmins(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { company_id } = request.params;
    // let checkStatus = await CheckCompanyStatus(company_id)
    // if (!checkStatus) {
    //     return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
    // }
    const result = await CompanyService.GetAdminsOfCompany(company_id);
    const responseBody = JSON.stringify(result);
    return { body: responseBody };
}
export async function CheckCompanyStatus(company_id: string | number): Promise<any> {
    try {
        // Fetch the company details
        const company = await Company.findOne({ where: { id: company_id, is_active: 1 } });
        if (company) {
            return true
        } else {
            return false
        }
    }
    catch (error) {
        return { status: 500, body: `${error.message}` }
    }
}

export async function DeleteCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { company_id } = request.params;
    const result = await CompanyController.deleteCompany(company_id);
    const responseBody = JSON.stringify(result);
    return { body: responseBody };
}

export async function MakeCompanyInActive(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const requestData = await request.json();
    const result = await CompanyController.MakeCompanyInActive(requestData);
    const responseBody = JSON.stringify(result);
    return { body: responseBody };
}
app.http('MakeCompanyInActive', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: MakeCompanyInActive,
    route: 'company/inactive'
});
app.http('DeleteCompany', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteCompany,
    route: 'company/{company_id}'
});
app.http('ListCompanies', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: ListCompanies,
    route: 'companies/{pageOffset}/{pageLimit}'
});
app.http('SearchCompanies', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: SearchCompanies,
    route: 'companies/search'
});
app.http('getUserDropDownForCompany', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getCompanyUser,
    route: 'getCompanyUser/{company_id}'
});
app.http('changeCompanySuperUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: changeSuperUserForCompany,
    route: 'changeCompanySuperUser/{company_id}/{user_id}'
});
app.http('CompaniesDropDown', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: DropDownCompanies,
    route: 'dropDown/companies'
});

app.http('GetCompanyAdmin', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetCompanyAdmin,
    route: 'fetch/company/{id}'
});
app.http('CheckCompanyByName', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: CheckCompanyByName,
    route: 'check/company/{company_name}'
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
app.http('sendAlertForCompany', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: sendAlertForCompany,
    route: 'company/sendAlert/{id}'
});
app.http('UpdateCompanyStatus', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: UpdateCompanyStatus,
    route: 'company/updateStatus/{id}'
});

app.http('GetCompanyAdmins', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetCompanyAdmins,
    route: 'getadms/{company_id}'
});





