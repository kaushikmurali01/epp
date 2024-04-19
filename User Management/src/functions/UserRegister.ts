import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { UserController } from '../controllers/userController';

/**
 * Registers a new user based on the provided request data.
 * 
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user registration status.
 */
export async function UserRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Register user
        const user = await UserController.registerUser(requestData);

        // Prepare response body
        const responseBody = JSON.stringify(user);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}


app.http('UserRegister', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: UserRegister
});
