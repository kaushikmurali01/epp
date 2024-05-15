import { HttpRequest, HttpResponse } from "@azure/functions";
import { RoleService } from '../services/roleService';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "enerva-utils/utils/status";

class RoleController {

    /**
     * Creates a new role.
     * 
     * @param req - The HTTP request object containing role data.
     * @returns Promise<HttpResponse>
     * @description Handles the creation of a new role by extracting necessary data from the request body, invoking the RoleService to create the role, and returning an HTTP response with appropriate status and JSON data.
     */
    static async createRole(requestData): Promise<Object> {
        try {
            //  const requestData = req.body;
            const role = await RoleService.createRole(requestData);
            return { status: 201, body: role };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    static async assignPermissions(requestData): Promise<Object> {
        try {
            //  const requestData = req.body;
            const perm = await RoleService.assignPermissions(requestData);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };

        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a role by its ID.
     * 
     * @param req - The HTTP request object containing role ID.
     * @returns Promise<HttpResponse>
     * @description Handles the retrieval of a role by its ID by extracting the role ID from the request parameters, invoking the RoleService to get the role, and returning an HTTP response with appropriate status and JSON data.
     */
    static async getRole(req: HttpRequest): Promise<Object> {
        try {
            const roleId = parseInt(req.params.id);
            const role = await RoleService.getRoleById(roleId);
            return { status: 200, body: role };
        } catch (error) {
            return { status: 404, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a list of roles.
     * 
     * @param req - The HTTP request object.
     * @returns Promise<HttpResponse>
     * @description Handles the retrieval of a list of roles, invoking the RoleService to retrieve the roles, and returning an HTTP response with appropriate status and JSON data.
     */
    static async listRoles(req: HttpRequest): Promise<Object> {
        try {
            const searchPromt = req.query.get('search' || "");
            const roles = await RoleService.listRoles();
            return { status: 200, body: roles };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Updates an existing role.
     * 
     * @param req - The HTTP request object containing updated role data.
     * @returns Promise<HttpResponse>
     * @description Handles the update of an existing role by extracting necessary data from the request body and parameters, invoking the RoleService to update the role, and returning an HTTP response with appropriate status and JSON data.
     */
    static async updateRole(req: HttpRequest): Promise<Object> {
        try {
            const roleId = parseInt(req.params.id);
            const updatedData = req.body;
            await RoleService.updateRole(roleId, updatedData);
            return { status: 200, body: { message: 'Role updated successfully' } };
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }

    /**
     * Deletes an existing role.
     * 
     * @param req - The HTTP request object containing role ID.
     * @returns Promise<HttpResponse>
     * @description Handles the deletion of an existing role by extracting the role ID from the request parameters, invoking the RoleService to delete the role, and returning an HTTP response with appropriate status and JSON data.
     */
    static async deleteRole(req: HttpRequest): Promise<Object> {
        try {
            const roleId = parseInt(req.params.id);
            await RoleService.deleteRole(roleId);
            return { status: 204 };
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }
}

export { RoleController };
