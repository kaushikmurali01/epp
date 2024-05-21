import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CompanyController } from '../controllers/companyController';
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { Company } from "../models/company";
import { sequelize } from "../services/database";
import { UserCompanyRole } from "../models/user-company-role";
import { User } from "../models/user";
import { Role } from "../models/role";



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
        const company = await CompanyController.updateCompany(requestData, id);

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

        // Get all companies
        const companies = await CompanyController.listCompanies(pageOffset, pageLimit, searchPromt, companyFilter);

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

        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };

    }
    catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function CheckCompanyStatus(company_id: number): Promise<any> {
    try {
        // Fetch the company details
        const company = await Company.findOne({ where: { id: company_id, is_active: true } });
        if (company) {
            return true
        } else {
            throw new Error('Company not found');
        }



        // Return success response
        return {};

    }
    catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}
app.http('ListCompanies', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: ListCompanies,
    route: 'companies/{pageOffset}/{pageLimit}'
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





