import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { FacilityController } from "../controller/facility_user/controller";
import { EmailTemplateController } from "../controller/emailTemplate/controller";
import { uploadBlob } from "../helper/azure-storage.helper";
import { FacilityEnervaController } from "../controller/facility_enerva/controller";
import { FacilityMeterController } from "../controller/facility_meter/controller";
import { FacilityMeterEntriesController } from "../controller/facility_meter_entries/controller";
import { FacilityCharacteristicsController } from "../controller/facility_characteristics/controller";
import { AdminFacilityController } from "../controller/admin/admin-facility/controller";
import { decodeToken } from "../helper/authantication.helper";
import { HTTP_STATUS_CODES } from "../utils/status";
import { FacilityMeterHourlyEntriesController } from "../controller/facility_hourly_entries/controller";
import { FacilityMeasureController } from "../controller/facility_measure/controller";
import { FacilitySavingDocumentController } from "../controller/facility_saving_document/controller";
import { AuthorizationService } from "../helper/authorization.helper";
import { IncentiveSettingsController } from '../controller/incentiveSettings/controller';
import { IIncentiveSettingsAttributes } from "../interfaces/incentiveSettings.interface";

// Facility User CRUD

export async function getAllFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const searchPromt = request.query.get("search" || "");
    const companyId = request.query.get("company_id" || "");
    const { offset, limit } = request.params;

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    if (companyId) {
      const hasPermission = await AuthorizationService.check(
        Number(companyId),
        decodedToken.id,
        ["facility"],
        decodedToken.role_id
      );
      if (!hasPermission)
        return { body: JSON.stringify({ status: 403, message: "Forbidden" }) };
    }

    const result = await FacilityController.getFacility(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      searchPromt ? String(searchPromt) : "",
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getAllFacilityAdmin(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let limit = requestData.limit;
    let colName = requestData.col_name || "id";
    let order = requestData.order || "ASC";

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const result = await AdminFacilityController.getFacility2(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      data
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  }catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getAllFacilityInprocessAdmin(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let limit = requestData.limit;
    let colName = requestData.col_name || "id";
    let order = requestData.order || "ASC";

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const result = await AdminFacilityController.getAllFacilityInprocess(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      data,
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  }catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getUsersFromFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let facility_id = requestData.facility_id;
    let limit = requestData.limit;
    let colName = requestData.col_name || "id";
    let order = requestData.order || "ASC";

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const result = await AdminFacilityController.getUsersFromFacility(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      data,
      Number(facility_id)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  }catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getAllFacility2(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    // const companyId = request.query.get("company_id" || "");
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let limit = requestData.limit;
    let companyId = requestData.company_id;
    let colName = requestData.col_name || "id";
    let order = requestData.order || "ASC";

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    if (companyId) {
      const hasPermission = await AuthorizationService.check(
        Number(companyId),
        decodedToken.id,
        ["facility"],
        decodedToken.role_id
      );
      if (!hasPermission)
        return { body: JSON.stringify({ status: 403, message: "Forbidden" }) };
    }

    const result = await FacilityController.getFacility2(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      data,
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getAllFacilityInprocess(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    // const companyId = request.query.get("company_id" || "");
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let limit = requestData.limit;
    let companyId = requestData.company_id;
    let colName = requestData.col_name || "id";
    let order = requestData.order || "ASC";

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    if (companyId) {
      const hasPermission = await AuthorizationService.check(
        Number(companyId),
        decodedToken.id,
        ["facility"],
        decodedToken.role_id
      );
      if (!hasPermission)
        return { body: JSON.stringify({ status: 403, message: "Forbidden" }) };
    }

    const result = await FacilityController.getAllFacilityInprocess(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      data,
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilityById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get facility by Id

    const result = await FacilityController.getFacilityById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityDetailsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.editFacilityDetailsById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function removeFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.deleteFacility(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function createNewFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const requestData = await request.json();

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.createNewFacility(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function addBaselineData(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { facility_id } = request.params;
    const requestData = await request.json();

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.addBaselineData(
      decodedToken,
      Number(facility_id),
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function editBaselineData(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { id } = request.params;
    const requestData = await request.json();

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.editBaselineData(
      decodedToken,
      Number(id),
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function submitRejectBaseline(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { id } = request.params;

    const requestData = await request.json();

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.submitRejectBaseline(
      decodedToken,
      Number(id),
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function acceptRejectBaseline(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { id } = request.params;

    const requestData = await request.json();

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.acceptRejectBaseline(
      decodedToken,
      Number(id),
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function assigneToBaseline(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { id, user_id } = request.params;
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.assigneToBaseline(
      decodedToken,
      Number(id),
      Number(user_id)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getBaselineDataByfacilityId(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { facility_id } = request.params;
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.getBaselineData(
      Number(facility_id)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getBaseLineList(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { offset, limit } = request.params;
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.getBaselineList(
      decodedToken,
      Number(offset),
      Number(limit)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function postUploadAnyFile(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  // file content must be passed in body
  const formData = await request.formData();
  const temp: any = formData.get("file");
  const uploadedFile: File = temp as File;
  let extLenth = uploadedFile.name.split(".");
  const ext = extLenth[extLenth.length - 1];
  // File
  const fileContents = await uploadedFile.arrayBuffer();
  const fileContentsBuffer: Buffer = Buffer.from(fileContents);
  const size = fileContentsBuffer.byteLength;
  const username = request.query.get("username") || "anonymous";
  let filename =
    "_" +
    size +
    "_" +
    (request.query.get("filename") || "unknown" + Date.now());
  filename += "." + ext;
  console.log(
    `lastModified = ${uploadedFile?.lastModified}, size = ${size}`,
    uploadedFile.type,
    uploadedFile.name,
    ext
  );

  const sasTokenUrl = await uploadBlob(
    process.env?.Azure_Storage_AccountName as string,
    process.env?.Azure_Storage_AccountKey as string,
    filename,
    username,
    fileContentsBuffer
  );
  console.log(sasTokenUrl.split("_")[1], "size");
  return {
    jsonBody: {
      filename,
      storageAccountName: process.env.Azure_Storage_AccountName,
      containername: username,
      sasTokenUrl,
    },
  };
}

export async function submitForApprovalByUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    // Get all result
    const result = await FacilityController.submitForApproval(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getCurrentStatusByUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    // Get all result
    const result = await FacilityController.getCurrentStatus(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityStatusById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityController.editFacilityStatusById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getFacilityNaicCode(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const facilityCategory = request.query.get("facility_category" || "");
    const facilityType = request.query.get("facility_type" || "");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityController.getFacilityNaic(
      decodedToken,
      facilityCategory ? String(facilityCategory) : "",
      facilityType ? String(facilityType) : ""
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getDownloadedCsvFacilities(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch params
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const searchPromt = request.query.get("search" || "");
    const companyId = request.query.get("company_id" || "");
    const { offset, limit } = request.params;

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityController.getDownloadedCsvFacilities(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      searchPromt ? String(searchPromt) : "",
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getDonwloadedCsvFacilityById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get facility by Id

    const result = await FacilityController.getDonwloadedCsvFacilityById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// Facility Enerva

export async function approveFacilityDetails(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    // Get all result
    const result = await FacilityEnervaController.approveFacilityDetails(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// Facility Meter

export async function getFacilityMeterListing(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { offset, limit } = request.params;
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const facilityId = request.query.get("facility_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityMeterController.getFacilityMeters(
      decodedToken,
      Number(offset),
      Number(limit),
      String(colName),
      String(order),
      Number(facilityId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getFacilityMeterById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get facility by Id
    const result = await FacilityMeterController.getFacilityMeterById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityMeterDetailsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await FacilityMeterController.editFacilityMeterDetailsById(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function removeFacilityMeter(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await FacilityMeterController.deleteFacilityMeter(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function addNewMeterFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await FacilityMeterController.addNewMeter(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function addFacilitySavingDocument(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const requestData = await request.json();
    // Get all result
    const result =
      await FacilitySavingDocumentController.addFacilitySavingDocument(
        decodedToken,
        Object(requestData)
      );
    // Prepare response body
    const responseBody = JSON.stringify(result);
    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function editFacilitySavingDocument(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result =
      await FacilitySavingDocumentController.editFacilitySavingDocument(
        decodedToken,
        request,
        Object(requestData)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function deleteFacilitySavingDocument(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const result =
      await FacilitySavingDocumentController.deleteFacilitySavingDocument(
        decodedToken,
        request
      );
    // Prepare response body
    const responseBody = JSON.stringify(result);
    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilitySavingDocument(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result =
      await FacilitySavingDocumentController.getFacilitySavingDocument(
        decodedToken,
        request
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilitySavingDocumentById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result =
      await FacilitySavingDocumentController.getFacilitySavingDocumentById(
        decodedToken,
        request
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function addFacilityMeasure(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const requestData = await request.json();
    // Get all result
    const result = await FacilityMeasureController.addFacilityMeasure(
      decodedToken,
      Object(requestData)
    );
    // Prepare response body
    const responseBody = JSON.stringify(result);
    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function deleteFacilityMeasure(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );
    const result = await FacilityMeasureController.deleteFacilityMeasure(
      decodedToken,
      request
    );
    // Prepare response body
    const responseBody = JSON.stringify(result);
    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function editFacilityMeasure(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await FacilityMeasureController.editFacilityMeasure(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilityMeasure(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityMeasureController.getFacilityMeasure(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilityMeasureById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const facilityId = request.query.get("facility_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityMeasureController.getFacilityMeasureById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function getFacilityMeterStatistics(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const facilityId = request.query.get("facility_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await FacilityMeterController.getMeterStatistics(
      decodedToken,
      request,
      Number(facilityId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// Facility Meter Monthly Entries

export async function getFacilityMeterEntriesListing(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { offset, limit } = request.params;
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const facilityMeterId = request.query.get("facility_meter_detail_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result =
      await FacilityMeterEntriesController.getFacilityMetersEntries(
        decodedToken,
        Number(offset),
        Number(limit),
        String(colName),
        String(order),
        Number(facilityMeterId)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityMeterEntryDetailsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result =
      await FacilityMeterEntriesController.editFacilityMeterEntryById(
        decodedToken,
        request,
        Object(requestData)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function removeFacilityMeterEntry(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result =
      await FacilityMeterEntriesController.deleteFacilityMeterEntry(
        decodedToken,
        request
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function addNewMeterEntry(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await FacilityMeterEntriesController.addNewEntry(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// Facility Meter Monthly Entries

export async function getFacilityMeterHourlyEntriesListing(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { offset, limit } = request.params;
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const facilityMeterId = request.query.get("facility_meter_detail_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result =
      await FacilityMeterHourlyEntriesController.getFacilityMetersHourlyEntries(
        decodedToken,
        Number(offset),
        Number(limit),
        String(colName),
        String(order),
        Number(facilityMeterId)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityMeterEntryHourlyDetailsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result =
      await FacilityMeterHourlyEntriesController.editFacilityMeterHourlyEntryById(
        decodedToken,
        request,
        Object(requestData)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function removeFacilityMeterHourlyEntry(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result =
      await FacilityMeterHourlyEntriesController.deleteFacilityMeterHourlyEntry(
        decodedToken,
        request
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function addNewMeterHourlyEntry(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await FacilityMeterHourlyEntriesController.addNewHourlyEntry(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// Facility Characteristics

export async function getFacilityCharacteristicsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get facility by Id
    const result =
      await FacilityCharacteristicsController.getFacilityCharacteristicsById(
        decodedToken,
        request
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function editFacilityCharacteristicsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result =
      await FacilityCharacteristicsController.editFacilityDetailsById(
        decodedToken,
        request,
        Object(requestData)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function addNewMCharacteristics(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result =
      await FacilityCharacteristicsController.addFacilityCharacteristics(
        decodedToken,
        request,
        Object(requestData)
      );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

// ADMIN Facility

export async function adminGetAllFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const colName = request.query.get("col_name") || "id";
    const order = request.query.get("order") || "ASC";
    const status = request.query.get("status") || "";
    const searchPromt = request.query.get("search" || "");
    const companyId = request.query.get("company_id" || "");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const { offset, limit } = request.params;

    const result = await AdminFacilityController.getFacility(
      decodedToken,
      Number(offset),
      Number(limit),
      Number(status),
      String(colName),
      String(order),
      searchPromt ? String(searchPromt) : "",
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminGetFacilityById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get facility by Id
    const result = await AdminFacilityController.getFacilityById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminEditFacilityDetailsById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const facility = await AdminFacilityController.editFacilityDetailsById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(facility);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminRemoveFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await AdminFacilityController.deleteFacility(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminCreateNewFacility(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const requestData = await request.json();

    // Get all result
    const result = await AdminFacilityController.createNewFacility(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminFacilityStatistics(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await AdminFacilityController.getCurrentStats(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminDashboradStatistics(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const companyId = request.query.get("company_id");
    const facilityId = request.query.get("facility_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await AdminFacilityController.getDashboardStats(
      decodedToken,
      request,
      Number(facilityId),
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminGetPaById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    if (decodedToken?.company_id) {
      const hasPermission = await AuthorizationService.check(
        decodedToken.company_id,
        decodedToken.id,
        ["bind-company"],
        decodedToken.role_id
      );
      if (!hasPermission)
        return { body: JSON.stringify({ status: 403, message: "Forbidden" }) };
    }

    // Get facility by Id
    const result = await AdminFacilityController.getPaDataById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminCreatePa(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    if (decodedToken?.company_id) {
      const hasPermission = await AuthorizationService.check(
        decodedToken.company_id,
        decodedToken.id,
        ["bind-company"],
        decodedToken.role_id
      );
      if (!hasPermission)
        return { body: JSON.stringify({ status: 403, message: "Forbidden" }) };
    }

    const requestData = await request.json();

    // Get facility by Id
    const result = await AdminFacilityController.getPaData(
      decodedToken,
      request,
      Object(requestData)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function adminEditPaById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    // Get all result
    const result = await AdminFacilityController.signPaById(
      decodedToken,
      request
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getFacilityDropDown(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const companyId = request.query.get("company_id");

    // Fetch values from decoded token
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const { offset, limit } = request.params;

    const result = await AdminFacilityController.getFacilityDropDown(
      decodedToken,
      Number(companyId)
    );

    // Prepare response body
    const responseBody = JSON.stringify(result);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}
export async function createEmailTemplate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const requestBody = await request.json();
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await EmailTemplateController.createEmailTemplate(
      requestBody,
      decodedToken.id
    );

    return { body: JSON.stringify(result) };
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function updateEmailTemplate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const id = Number(request.params.id);
    const requestBody = await request.json();
    const decodedToken = await decodeToken(request, context, async () =>
      Promise.resolve({})
    );

    const result = await EmailTemplateController.updateEmailTemplate(
      id,
      requestBody,
      decodedToken.id
    );

    if (result) {
      return { body: JSON.stringify(result) };
    } else {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        body: "Email template not found",
      };
    }
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function deleteEmailTemplate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const id = Number(request.params.id);

    const result = await EmailTemplateController.deleteEmailTemplate(id);

    if (result) {
      return {
        body: JSON.stringify({
          message: "Email template deleted successfully",
        }),
      };
    } else {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        body: "Email template not found",
      };
    }
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getEmailTemplatesByFacilityId(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const facilityId = Number(request.params.facilityId);

    const result = await EmailTemplateController.getEmailTemplatesByFacilityId(
      facilityId
    );

    return { body: JSON.stringify(result) };
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getEmailTemplatesSubjectAndBody(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const facilityId = Number(request.params.facilityId);

    const result =
      await EmailTemplateController.getEmailTemplatesSubjectAndBody(facilityId);

    return { body: JSON.stringify(result) };
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

export async function getIncentiveSettings(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const facilityId = Number(request.params.facilityId);

    if (!facilityId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        jsonBody: { error: "Facility ID is required" }
      };
    }

    const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));

    const result = await IncentiveSettingsController.getIncentiveSettings(Number(facilityId));

    if (!result) {
      return {
        status: 200,
        jsonBody: { data: null, message: "IncentiveSettings not found" }
      };
    }

    return { jsonBody: result };
  } catch (error) {
    return {
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      jsonBody: { error: error.message }
    };
  }
}

export async function upsertIncentiveSettings(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const decodedToken = await decodeToken(request, context, async () => Promise.resolve({}));

    const requestBody = await request.json();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: "Invalid request body" };
    }

    // Type assertion and partial application of IIncentiveSettingsAttributes
    const data = requestBody as Partial<IIncentiveSettingsAttributes>;
    const result = await IncentiveSettingsController.upsertIncentiveSettings({
      ...data,
      created_by: decodedToken.id,
      updated_by: decodedToken.id,
    } as IIncentiveSettingsAttributes);

    return { body: JSON.stringify(result) };
  } catch (error) {
    return { status: HTTP_STATUS_CODES.BAD_REQUEST, body: `${error.message}` };
  }
}

app.http("get-incentive-settings", {
  methods: ["GET"],
  route: "incentive-settings/{facilityId}",
  authLevel: "anonymous",
  handler: getIncentiveSettings,
});

app.http("upsert-incentive-settings", {
  methods: ["PUT"],
  route: "incentive-settings",
  authLevel: "anonymous",
  handler: upsertIncentiveSettings,
});
app.http("createEmailTemplate", {
  methods: ["POST"],
  route: "email-template",
  authLevel: "anonymous",
  handler: createEmailTemplate,
});

app.http("updateEmailTemplate", {
  methods: ["PUT"],
  route: "email-template/{id}",
  authLevel: "anonymous",
  handler: updateEmailTemplate,
});

app.http("deleteEmailTemplate", {
  methods: ["DELETE"],
  route: "email-template/{id}",
  authLevel: "anonymous",
  handler: deleteEmailTemplate,
});

app.http("getEmailTemplatesByFacilityId", {
  methods: ["GET"],
  route: "email-templates/{facilityId}",
  authLevel: "anonymous",
  handler: getEmailTemplatesByFacilityId,
});

app.http("getEmailTemplatesSubjectAndBody", {
  methods: ["GET"],
  route: "email-templates/{facilityId}/subject-body",
  authLevel: "anonymous",
  handler: getEmailTemplatesSubjectAndBody,
});
app.http(`facility-listing`, {
  methods: ["GET"],
  route: "facility-listing/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getAllFacility,
});
app.http(`facility-listing-post`, {
  methods: ["POST"],
  route: "facility-listing",
  authLevel: "anonymous",
  handler: getAllFacility2,
});
app.http(`facility-listing-post-admin`, {
  methods: ["POST"],
  route: "facility-listing-admin",
  authLevel: "anonymous",
  handler: getAllFacilityAdmin,
});
app.http(`facility-listing-inprocess-admin`, {
  methods: ["POST"],
  route: "facility-inprocess-admin",
  authLevel: "anonymous",
  handler: getAllFacilityInprocessAdmin,
});
app.http(`facility-detail-user-list`, {
  methods: ["POST"],
  route: "facility-users-list",
  authLevel: "anonymous",
  handler: getUsersFromFacility,
});
app.http(`facility-listing-inprocess`, {
  methods: ["POST"],
  route: "facility-inprocess",
  authLevel: "anonymous",
  handler: getAllFacilityInprocess,
});

app.http("facility-details", {
  methods: ["GET"],
  route: "facility-details/{id}",
  authLevel: "anonymous",
  handler: getFacilityById,
});

app.http("edit-facility", {
  methods: ["PATCH"],
  route: "facility/{id}",
  authLevel: "anonymous",
  handler: editFacilityDetailsById,
});
app.http("add-baseline", {
  methods: ["POST"],
  route: "baseline/{facility_id}",
  authLevel: "anonymous",
  handler: addBaselineData,
});
app.http("edit-baseline", {
  methods: ["PATCH"],
  route: "baseline/{id}",
  authLevel: "anonymous",
  handler: editBaselineData,
});
app.http("get-baseline", {
  methods: ["GET"],
  route: "getBaseline/{facility_id}",
  authLevel: "anonymous",
  handler: getBaselineDataByfacilityId,
});
app.http("submit-reject-baseline", {
  methods: ["PATCH"],
  route: "submitRejectedBaseline/{id}",
  authLevel: "anonymous",
  handler: submitRejectBaseline,
});
app.http("accept-reject-baseline", {
  methods: ["PATCH"],
  route: "acceptRejctBaseline/{id}",
  authLevel: "anonymous",
  handler: acceptRejectBaseline,
});
app.http("add-assignee-in-baseline", {
  methods: ["PATCH"],
  route: "baseline/addAssignee/{id}/{user_id}",
  authLevel: "anonymous",
  handler: assigneToBaseline,
});
app.http("get-baseline-list", {
  methods: ["GET"],
  route: "getBaselineList/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getBaseLineList,
});
app.http("remove-facility", {
  methods: ["DELETE"],
  route: "facility/{id}",
  authLevel: "anonymous",
  handler: removeFacility,
});

app.http("facility", {
  methods: ["POST"],
  route: "facility",
  authLevel: "anonymous",
  handler: createNewFacility,
});

app.http("upload", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: postUploadAnyFile,
});

app.http("facility-submission", {
  methods: ["POST"],
  route: "facility-submission/{id}",
  authLevel: "anonymous",
  handler: submitForApprovalByUser,
});

app.http("facility-status", {
  methods: ["GET"],
  route: "facility-status/{id}",
  authLevel: "anonymous",
  handler: getCurrentStatusByUser,
});

app.http("edit-facility-status", {
  methods: ["PATCH"],
  route: "facility-status/{id}",
  authLevel: "anonymous",
  handler: editFacilityStatusById,
});

app.http("facility-naic", {
  methods: ["GET"],
  route: "facility-naic",
  authLevel: "anonymous",
  handler: getFacilityNaicCode,
});

app.http(`csv-download-facilities`, {
  methods: ["GET"],
  route: "csv-facilities/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getDownloadedCsvFacilities,
});

app.http("csv-download-facility", {
  methods: ["GET"],
  route: "csv-facility/{id}",
  authLevel: "anonymous",
  handler: getDonwloadedCsvFacilityById,
});

// Facility Enerva

app.http("approve-facility", {
  methods: ["PATCH"],
  route: "approve-facility/{id}",
  authLevel: "anonymous",
  handler: approveFacilityDetails,
});

// Facility Meter

app.http(`facility-meter-listing`, {
  methods: ["GET"],
  route: "facility-meter-listing/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getFacilityMeterListing,
});

app.http("facility-meter-details", {
  methods: ["GET"],
  route: "facility-meter-details/{id}",
  authLevel: "anonymous",
  handler: getFacilityMeterById,
});
app.http("facility-measure-details", {
  methods: ["GET"],
  route: "facility-measure-details/{id}",
  authLevel: "anonymous",
  handler: getFacilityMeasureById,
});
app.http("remove-facility-measure", {
  methods: ["DELETE"],
  route: "facility-measure/{id}",
  authLevel: "anonymous",
  handler: deleteFacilityMeasure,
});
app.http("facility-measure-lists", {
  methods: ["GET"],
  route: "facility-measure-lists/{facility_id}/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getFacilityMeasure,
});
app.http("edit-facility-measure-details", {
  methods: ["PATCH"],
  route: "facility-measure/{id}",
  authLevel: "anonymous",
  handler: editFacilityMeasure,
});
app.http("facility-measure", {
  methods: ["POST"],
  route: "facility-measure",
  authLevel: "anonymous",
  handler: addFacilityMeasure,
});
app.http("facility-saving-document-details", {
  methods: ["GET"],
  route: "facility-saving-document-details/{id}",
  authLevel: "anonymous",
  handler: getFacilitySavingDocumentById,
});
app.http("facility-saving-document-lists", {
  methods: ["GET"],
  route: "facility-saving-document-lists/{facility_id}/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getFacilitySavingDocument,
});
app.http("edit-facility-saving-document-details", {
  methods: ["PATCH"],
  route: "facility-saving-document/{id}",
  authLevel: "anonymous",
  handler: editFacilitySavingDocument,
});
app.http("remove-facility-saving-document", {
  methods: ["DELETE"],
  route: "facility-saving-document/{id}",
  authLevel: "anonymous",
  handler: deleteFacilitySavingDocument,
});
app.http("facility-saving-document", {
  methods: ["POST"],
  route: "facility-saving-document",
  authLevel: "anonymous",
  handler: addFacilitySavingDocument,
});
app.http("edit-facility-meter-details", {
  methods: ["PATCH"],
  route: "facility-meter/{id}",
  authLevel: "anonymous",
  handler: editFacilityMeterDetailsById,
});

app.http("remove-facility-meter", {
  methods: ["DELETE"],
  route: "facility-meter/{id}",
  authLevel: "anonymous",
  handler: removeFacilityMeter,
});

app.http("facility-meter", {
  methods: ["POST"],
  route: "facility-meter",
  authLevel: "anonymous",
  handler: addNewMeterFacility,
});

app.http(`facility-meter-statistics`, {
  methods: ["GET"],
  route: "facility-meter-statistics",
  authLevel: "anonymous",
  handler: getFacilityMeterStatistics,
});

// Facility Meter entries

app.http(`facility-meter-entry-listing`, {
  methods: ["GET"],
  route: "facility-meter-entries/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getFacilityMeterEntriesListing,
});

app.http("edit-facility-meter-entries", {
  methods: ["PATCH"],
  route: "facility-meter-entry/{id}",
  authLevel: "anonymous",
  handler: editFacilityMeterEntryDetailsById,
});

app.http("remove-facility-meter-entries", {
  methods: ["DELETE"],
  route: "facility-meter-entry/{id}",
  authLevel: "anonymous",
  handler: removeFacilityMeterEntry,
});

app.http("facility-meter-entry", {
  methods: ["POST"],
  route: "facility-meter-entry",
  authLevel: "anonymous",
  handler: addNewMeterEntry,
});

// Facility Meter Hourly entries

app.http(`facility-meter-hourly-entry-listing`, {
  methods: ["GET"],
  route: "facility-meter-hourly-entries/{offset}/{limit}",
  authLevel: "anonymous",
  handler: getFacilityMeterHourlyEntriesListing,
});

app.http("edit-facility-meter-hourly-entries", {
  methods: ["PATCH"],
  route: "facility-meter-hourly-entry/{id}",
  authLevel: "anonymous",
  handler: editFacilityMeterEntryHourlyDetailsById,
});

app.http("remove-facility-meter-hourly-entries", {
  methods: ["DELETE"],
  route: "facility-meter-hourly-entry/{id}",
  authLevel: "anonymous",
  handler: removeFacilityMeterHourlyEntry,
});

app.http("facility-meter-hourly-entry", {
  methods: ["POST"],
  route: "facility-meter-hourly-entry",
  authLevel: "anonymous",
  handler: addNewMeterHourlyEntry,
});

// Facility Charateristicks
app.http("facility-characteristics-details", {
  methods: ["GET"],
  route: "facility-characteristics/{id}",
  authLevel: "anonymous",
  handler: getFacilityCharacteristicsById,
});

app.http("edit-facility-characteristics", {
  methods: ["PATCH"],
  route: "facility-characteristics/{id}",
  authLevel: "anonymous",
  handler: editFacilityCharacteristicsById,
});

app.http("facility-characteristics", {
  methods: ["POST"],
  route: "facility-characteristics",
  authLevel: "anonymous",
  handler: addNewMCharacteristics,
});

// Admin

app.http(`admin-facility-listing`, {
  methods: ["GET"],
  route: "program/facility-listing/{offset}/{limit}",
  authLevel: "anonymous",
  handler: adminGetAllFacility,
});

app.http("admin-facility-details", {
  methods: ["GET"],
  route: "program/facility-details/{id}",
  authLevel: "anonymous",
  handler: adminGetFacilityById,
});

app.http("admin-edit-facility", {
  methods: ["PATCH"],
  route: "program/facility/{id}",
  authLevel: "anonymous",
  handler: adminEditFacilityDetailsById,
});

app.http("admin-remove-facility", {
  methods: ["DELETE"],
  route: "program/facility/{id}",
  authLevel: "anonymous",
  handler: adminRemoveFacility,
});

app.http("admin-facility-creation", {
  methods: ["POST"],
  route: "program/facility",
  authLevel: "anonymous",
  handler: adminCreateNewFacility,
});

app.http("admin-facility-statistics", {
  methods: ["GET"],
  route: "program/facility-statistics",
  authLevel: "anonymous",
  handler: adminFacilityStatistics,
});

app.http("admin-facility-dropdown", {
  methods: ["GET"],
  route: "program/facility-dropdown",
  authLevel: "anonymous",
  handler: getFacilityDropDown,
});

// pA

app.http("create-pa-by", {
  methods: ["POST"],
  route: "pa-details",
  authLevel: "anonymous",
  handler: adminCreatePa,
});

app.http("get-pa-by-id", {
  methods: ["GET"],
  route: "pa-details/{id}",
  authLevel: "anonymous",
  handler: adminGetPaById,
});

app.http("sign-pa-by-id", {
  methods: ["PATCH"],
  route: "sign-pa/{id}",
  authLevel: "anonymous",
  handler: adminEditPaById,
});

app.http("admin-dashboard-statistics", {
  methods: ["GET"],
  route: "dashboard/statistics",
  authLevel: "anonymous",
  handler: adminDashboradStatistics,
});

app.http("admin-dashboard-statistics-1", {
  methods: ["GET"],
  route: "dashboard/statistics1",
  authLevel: "anonymous",
  handler: adminDashboradStatistics,
});
