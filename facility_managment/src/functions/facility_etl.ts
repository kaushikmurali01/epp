import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { decodeToken } from "../helper/authantication.helper";
import { HTTP_STATUS_CODES } from "../utils/status";
import { FacilityEtlController } from "../controller/facility_elt_process/controller";


export async function getFacilityMeterMonthlyEntriesListing(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
    try {
        const colName = request.query.get('col_name') || 'id';
        const order = request.query.get('order') || 'ASC';
        const facilityId = request.query.get('facility_id');
        const offset = request.query.get('offset') || 0;
        const limit = request.query.get('limit') || 100;

        // Fetch values from decoded token
        const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));


        const result = await FacilityEtlController.getFacilityMetersMonthlyEntries(decodedToken, Number(offset), Number(limit), String(colName), String(order), Number(facilityId));
       
        // Prepare response body
        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
         return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}`};
    }
}

export async function  getFacilityMeterMonthlyEntryById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
    try {

      // Fetch values from decoded token
      const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));

       
        const result = await FacilityEtlController.getFacilityMetersMonthlyEntryById(decodedToken, request);
       
        // Prepare response body
        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
         return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}`};
    }
}

export async function getFacilityMeterHourlyEntriesListing(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
    try {
        const colName = request.query.get('col_name') || 'id';
        const order = request.query.get('order') || 'ASC';
        const facilityId = request.query.get('facility_id');
        const offset = request.query.get('offset') || 0;
        const limit = request.query.get('limit') || 100;
        

        // Fetch values from decoded token
        const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));


        const result = await FacilityEtlController.getFacilityMetersHourlyEntries(decodedToken, Number(offset), Number(limit), String(colName), String(order), Number(facilityId));
       
        // Prepare response body
        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
         return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}`};
    }
}

export async function  getFacilityMeterHourlyEntryById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
    try {

      // Fetch values from decoded token
      const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));

       
        const result = await FacilityEtlController.getFacilityMetersHourlyEntryById(decodedToken, request);
       
        // Prepare response body
        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
         return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}`};
    }
}

export async function  getEtlDataFromDb(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
    try {

      // Fetch values from decoded token
      const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));

       
        const result = await FacilityEtlController.getEtlDataFromDb(decodedToken, request);
       
        // Prepare response body
        const responseBody = JSON.stringify(result);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
         return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}`};
    }
}


// app.http("get-facility-monthly-entries", {
//     methods: ["GET"],
//     route: "etl/monthly-entries",
//     authLevel: "anonymous",
//     handler: getFacilityMeterMonthlyEntriesListing,
// });

// app.http("get-facility-monthly-entry-by-id", {
//     methods: ["GET"],
//     route: "etl/monthly-entry/{id}",
//     authLevel: "anonymous",
//     handler: getFacilityMeterMonthlyEntryById,
// });

// app.http("get-facility-hourly-entries", {
//     methods: ["GET"],
//     route: "etl/hourly-entries",
//     authLevel: "anonymous",
//     handler: getFacilityMeterHourlyEntriesListing,
// });

// app.http("get-facility-hourly-entry-by-id", {
//     methods: ["GET"],
//     route: "etl/hourly-entry/{id}",
//     authLevel: "anonymous",
//     handler: getFacilityMeterHourlyEntryById,
// });

// app.http("get-facility-etl-data", {
//     methods: ["GET"],
//     route: "etl/get-data",
//     authLevel: "anonymous",
//     handler: getEtlDataFromDb,
// });
