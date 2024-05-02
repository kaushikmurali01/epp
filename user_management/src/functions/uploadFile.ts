import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { uploadFile } from "../services/fileUpload";
//const { v4: uuidv4 } = require('uuid');
//const blobName = uuidv4(); // Generates a UUID

const { BlobSerivceClient } = require('@azure/storage-blob');
var multipart = require('parse-multipart');


import { v4 as uuidv4 } from 'uuid';
const blobId = uuidv4(); // Generates a UUID



export async function FileUpload2(req: HttpRequest, context: InvocationContext): Promise<any> {
    try {
    context.log('Javascript HTTP trigger function processed a request');
    var bodyBuffer = Buffer.from(req.body.data.toString());
    console.log("bodyBuffer009",req.headers['content-type']);
    var boundary = multipart.getBoundary(req.headers['content-type']);

    var parts = multipart.Parse(bodyBuffer, boundary);
    console.log("parts009", parts);
    return {status: 200, parts : parts }
    } catch (error) {
      //  throw error;
        // Return error response
        return { status: 500, body: `${error}` };
    }
}

app.http('FileUpload2', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/upload2',
    handler: FileUpload2
});