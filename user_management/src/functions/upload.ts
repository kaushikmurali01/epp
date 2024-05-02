import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { uploadFile } from "../services/fileUpload";
//const { v4: uuidv4 } = require('uuid');
//const blobName = uuidv4(); // Generates a UUID

import { v4 as uuidv4 } from 'uuid';
const blobId = uuidv4(); // Generates a UUID



export async function FileUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const imagePath = "D:/docs/img.jpg"; 
        const blobName = `doc${blobId}.jpg`; 
        const containerName = process.env.AGREEMENT_CONTAINER_NAME;
        uploadFile(Buffer.from(request.body.toString(), 'binary'), blobName, containerName);
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

app.http('FileUpload', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'v1/upload',
    handler: FileUpload
});