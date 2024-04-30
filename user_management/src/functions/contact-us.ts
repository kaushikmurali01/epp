import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ContactUsController } from '../controllers/contactUsController';

// Azure Functions

/**
 * Saves a new contact message based on the provided request data.
 * 
 * @param request The HTTP request object containing contact message data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the status of the contact message saving.
 */
export async function SaveContactMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const requestData = await request.json(); // Parse request data


        // Register user
        const data = await ContactUsController.saveContactMessage(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(data);

        // Return success response
        return { body: responseBody };
       
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves all contact messages.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all contact messages.
 */
export async function GetAllContactMessages(request: HttpRequest, context: InvocationContext): Promise<Object> {
    try {
        const { offset, limit } = request.params;

        // Get all contact messages
        const messages = await ContactUsController.getAllContactMessages(offset, limit);
       
        // Return success response
        return { status: 200, body: { messages } };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves a contact message by ID.
 * 
 * @param request The HTTP request object containing contact message ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the contact message with the specified ID.
 */
export async function GetContactMessageById(id): Promise<Object> {
    try {

        // Get contact message by ID
        const message = await ContactUsController.getContactMessageById(id);
       
        // Return success response
        return { status: 200, body: { message } };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Deletes a contact message by ID.
 * 
 * @param request The HTTP request object containing contact message ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating the status of contact message deletion.
 */
export async function DeleteContactMessage(id): Promise<object> {
    try {

        // Delete contact message by ID
        const deleted = await ContactUsController.deleteContactMessage(id);
       
        // Return success response
        return { status: 204, body: {} };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

// HTTP trigger handlers

// Handler for saving a new contact message
app.http('SaveContactMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/contact',
    handler: SaveContactMessage
});

// // Handler for retrieving all contact messages
// app.http('GetAllContactMessages', {
//     methods: ['GET'],
//     authLevel: 'anonymous',
//     route: 'v1/contact/{offset}/{limit}',
//     handler: GetAllContactMessages
// });

// // Handler for retrieving a contact message by ID
// app.http('GetContactMessageById', {
//     methods: ['GET'],
//     authLevel: 'anonymous',
//     route: 'v1/contact/{id}',
//     handler: GetContactMessageById
// });

// // Handler for deleting a contact message by ID
// app.http('DeleteContactMessage', {
//     methods: ['DELETE'],
//     authLevel: 'anonymous',
//     route: 'v1/contact/{id}',
//     handler: DeleteContactMessage
// });
