import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { FacilityController } from "../controller";


import { uploadBlob } from "../lib/azure-storage";

// class AzureFunction {

export async function getAllFacility(request: any, context: any): Promise<HttpResponseInit>  {
        try {
            // Get all users

            const {offset, limit} = request.params


            const users = await FacilityController.getFacility(offset, limit);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);

            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }

    export async function  getFacilityById(request: any, context: any) : Promise<HttpResponseInit>  {
        try {
            
            // Get facility by Id
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

    export async function  editFacilityDetailsById(request: any, context: any): Promise<HttpResponseInit>  {
        try {
            
            const requestData = await request.json(); 

            // Get all users
            const users = await FacilityController.editFacilityDetailsById(request, requestData);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);

            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }

    export async function  removeFacility(request: any, context: any): Promise<HttpResponseInit>  {
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

    export async function  createNewFacility(request: any, context: any): Promise<HttpResponseInit>  {
        try {

            const requestData = await request.json(); 

            // Get all users
            const users = await FacilityController.createNewFacility(requestData);
           
            // Prepare response body
            const responseBody = JSON.stringify(users);

            // Return success response
            return { body: responseBody };
        } catch (error) {
            // Return error response
            return { status: 500, body: `${error.message}` };
        }
    }

    export async function  approveFacilityDetails(request: any, context: any) : Promise<HttpResponseInit> {
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

    export async function postUploadAnyFile(
        request: HttpRequest,
        context: InvocationContext
      ): Promise<HttpResponseInit> {
        context.log(`Http function processed request for url "${request.url}"`);
      
        const username = request.query.get('username') || 'anonymous';
        const filename = request.query.get('filename') || 'unknown' + Date.now();
        const path = `${username}/${filename}`;
        context.log(path);
      
        // file content must be passed in body
        const formData = await request.formData();
        const temp: any = formData.get('file');
        const uploadedFile: File = temp as File;
      
        // File
        const fileContents = await uploadedFile.arrayBuffer();
        const fileContentsBuffer: Buffer = Buffer.from(fileContents);
        const size = fileContentsBuffer.byteLength;
        console.log(`lastModified = ${uploadedFile?.lastModified}, size = ${size}`);
      
        const sasTokenUrl = await uploadBlob(
          process.env?.Azure_Storage_AccountName as string,
          process.env?.Azure_Storage_AccountKey as string,
          filename,
          username,
          fileContentsBuffer
        );
      
        return {
          jsonBody: {
            filename,
            storageAccountName: process.env.Azure_Storage_AccountName,
            containername: username,
            sasTokenUrl
          }
        };
      }
      
      





app.http(`facility-listing`, {
    methods: ['GET'],
    route: 'facility-listing/{offset}/{limit}',
    authLevel: 'anonymous',
    handler: getAllFacility
});


app.http('facility-details', {
    methods: ['GET'],
    route: 'facility-details/{id}',
    authLevel: 'anonymous',
    handler: getFacilityById
});



app.http('edit-facility', {
    methods: ['PATCH'],
    route: 'facility/{id}',
    authLevel: 'anonymous',
    handler: editFacilityDetailsById
});


app.http('remove-facility', {
    methods: ['DELETE'],
    route: 'facility/{id}',
    authLevel: 'anonymous',
    handler: removeFacility
});


app.http('facility', {
    methods: ['POST'],
    route: 'facility',
    authLevel: 'anonymous',
    handler: createNewFacility
});


app.http('approve-facility', {
    methods: ['PATCH'],
    route: 'approve-facility/{id}',
    authLevel: 'anonymous',
    handler: approveFacilityDetails
});

app.http('upload', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: postUploadAnyFile
  });



