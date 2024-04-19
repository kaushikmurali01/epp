import { HttpRequest, HttpResponse } from "@azure/functions";
import { UserService } from '../services/userService';

class UserController {

    /**
     * Registers a new user.
     * 
     * @param req - The HTTP request object containing user data.
     * @returns Promise<HttpResponse>
     * @description Handles the registration of a new user by extracting necessary data from the request body, invoking the UserService to register the user, and returning an HTTP response with appropriate status and JSON data.
     */
    static async registerUser(req): Promise<any> {
        try {
            console.log("body", req.body);
            const { first_name, last_name, email, password, address } = req as any;
            const user = await UserService.registerUser({ first_name, last_name, email, password, address });
            return user;
        } catch (error) {
            return {
                status: 500,
                body: { error: error.message }
            };
        }
    }
}

export { UserController };
