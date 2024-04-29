
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { FacilityController } from "../controller";
 
class AzureFunction {
 
    static async getAllFacility(request, context) {
        try {
            // Get all users
            const users = await FacilityController.getFacility({});
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
    static async getFacilityById(request, context) {
        try {
            
            // Get all users
            const users = await FacilityController.getFacilityById(request);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
    static async editFacilityDetailsById(request, context) {
        try {
            // Get all users
            const users = await FacilityController.getFacility(request);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
    static async removeFacility(request, context) {
        try {
            // Get all users
            const users = await FacilityController.deleteFacility(request);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
    static async createNewFacility(request, context) {
        try {
            // Get all users
            const users = await FacilityController.createNewFacility(request);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
    static async approveFacilityDetails(request, context) {
        try {
            // Get all users
            const users = await FacilityController.approveFacilityDetails(request);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);
 
            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }
 
}
 
 
 
app.http(`facility-listing`, {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: AzureFunction.getAllFacility
});
 
 
app.http('facility-details', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: AzureFunction.getFacilityById
});
 
 
 
app.http('edit-facility', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    handler: AzureFunction.editFacilityDetailsById
});
 
 
app.http('remove-facility', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: AzureFunction.removeFacility
});
 
 
app.http('facility', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: AzureFunction.createNewFacility
});
 
 
app.http('approve-facility', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    handler: AzureFunction.approveFacilityDetails
});
 
 
 