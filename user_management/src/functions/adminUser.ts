import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { AdminUserController } from "../controllers/adminUserController";
import { UserInvitationService } from "../services/user-invitation-service";
import { UserService } from "../services/userService";
import { RolePermissionService } from "../services/rolePermissionService";
import { RoleController } from "../controllers/roleController";
import { decodeTokenMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/user";
import { UserCompanyRole } from "../models/user-company-role";
import { Role } from "../models/role";
import { sequelize } from "../services/database";
import { UserInvitation } from "../models/user-invitation";
import { Op } from "sequelize";
import { UserResourceFacilityPermission } from "../models/user-resource-permission";
import { UserCompanyRolePermission } from "../models/userCompanyRolePermission";
import { CheckCompanyStatus } from "./company";
import { RESPONSE_MESSAGES } from "enerva-utils/utils/status";
import { CustomColumn } from '../models/custom-columns'; // Import Sequelize model


/**
 * Registers a new user based on the provided request data.
 *
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user registration status.
 */
export async function AdminUserRegister(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request data
    const requestData = await request.json();

    // Register user
    const user = await AdminUserController.registerAdminUser(requestData);

    // Prepare response body
    const responseBody = JSON.stringify(user);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

/**
 * Updates an existing user based on the provided request data.
 *
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user update status.
 */
export async function AdminUserUpdate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request data
    const requestData = await request.json();

    // Update user
    const user = await AdminUserController.updateUser(requestData);

    // Prepare response body
    const responseBody = JSON.stringify(user);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

/**
 * Retrieves Enerva users.
 *
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */
export async function GetEnervaUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { pageOffset, pageLimit } = request.params;
    const searchPromt = request.query.get("search") || "";
    const role = request.query.get("role") || "";
    let where = {};
    if (role) {
      where = { id: Number(role) };
    }

    const [usersResult, invitationsResult] = await Promise.all([
      User.findAndCountAll({
        include: [
          {
            model: UserCompanyRole,
            attributes: [],
            where: {
              is_active: 1,
            },
            include: [
              {
                model: Role,
                attributes: [],
                where,
              },
            ],
          },
        ],
        offset: parseInt(pageOffset),
        limit: parseInt(pageLimit),
        where: {
          type: 1,
          is_active: 1,
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${searchPromt}%` } },
            { last_name: { [Op.iLike]: `%${searchPromt}%` } },
            { email: { [Op.iLike]: `%${searchPromt}%` } },
          ],
        },
        attributes: [
          "id",
          "email",
          "first_name",
          "last_name",
          "createdAt",
          [sequelize.col("UserCompanyRole.Role.rolename"), "rolename"],
          [sequelize.col("UserCompanyRole.Role.id"), "role_id"],
          [sequelize.col("UserCompanyRole.status"), "status"],
        ],
      }),
      UserInvitation.findAndCountAll({
        offset: parseInt(pageOffset),
        limit: parseInt(pageLimit),
        where: {
          is_active: 1,
          type: 1,
          [Op.or]: [{ email: { [Op.iLike]: `%${searchPromt}%` } }],
        },
        attributes: [
          "id",
          "email",
          "invitation_sent_date",
          "invitation_sent_time",
          "status",
          "createdAt",
          [sequelize.col("Role.rolename"), "rolename"],
          [sequelize.col("Role.id"), "role_id"],
        ],
        include: [
          {
            model: Role,
            attributes: [],
            where,
          },
        ],
      }),
    ]);

    const users = usersResult?.rows?.map((user) => ({
      entry_type: 1,
      ...user.toJSON(),
    }));
    let userCount = usersResult.count;
    const invitations = invitationsResult?.rows?.map((invitation) => ({
      entry_type: 2,
      first_name: "",
      last_name: "",
      ...invitation.toJSON(),
    }));

    let inviteCount = invitationsResult.count;

    // Combine all results into one array
    const allData = [...users, ...invitations];
    const data = {
      status: 200,
      body: {
        rows: allData,
        count: userCount + inviteCount,
      },
    };
    const responseBody = JSON.stringify(data);

    return { body: responseBody };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Retrieves Enerva users.
 *
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */

export async function GetIESOUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { pageOffset, pageLimit } = request.params;
    const searchPromt = request.query.get("search") || "";
    const role = request.query.get("role") || "";
    let where = {};
    if (role) {
      where = { id: Number(role) };
    }
    const [usersResult, invitationsResult] = await Promise.all([
      User.findAndCountAll({
        include: [
          {
            model: UserCompanyRole,
            attributes: [],
            where: {
              is_active: 1,
            },
            include: [
              {
                model: Role,
                attributes: [],
                where,
              },
            ],
          },
        ],
        offset: parseInt(pageOffset),
        limit: parseInt(pageLimit),
        where: {
          type: 4,
          is_active: 1,
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${searchPromt}%` } },
            { last_name: { [Op.iLike]: `%${searchPromt}%` } },
            { email: { [Op.iLike]: `%${searchPromt}%` } },
          ],
        },
        attributes: [
          "id",
          "email",
          "first_name",
          "last_name",
          "createdAt",
          [sequelize.col("UserCompanyRole.Role.rolename"), "rolename"],
          [sequelize.col("UserCompanyRole.Role.id"), "role_id"],
          [sequelize.col("UserCompanyRole.status"), "status"],
        ],
      }),
      UserInvitation.findAndCountAll({
        offset: parseInt(pageOffset),
        limit: parseInt(pageLimit),
        where: {
          is_active: 1,
          type: 4,
          [Op.or]: [{ email: { [Op.iLike]: `%${searchPromt}%` } }],
        },
        attributes: [
          "id",
          "email",
          "invitation_sent_date",
          "invitation_sent_time",
          "status",
          "createdAt",
          [sequelize.col("Role.rolename"), "rolename"],
          [sequelize.col("Role.id"), "role_id"],
        ],
        include: [
          {
            model: Role,
            attributes: [],
            where,
          },
        ],
      }),
    ]);

    const users = usersResult?.rows?.map((user) => ({
      entry_type: 1,
      ...user.toJSON(),
    }));

    const invitations = invitationsResult?.rows?.map((invitation) => ({
      entry_type: 2,
      first_name: "",
      last_name: "",
      ...invitation.toJSON(),
    }));

    // Combine all results into one array
    const allData = [...users, ...invitations];

    const data = {
      status: 200,
      body: {
        rows: allData,
        count: usersResult.count + invitationsResult.count,
      },
    };

    const responseBody = JSON.stringify(data);

    return { body: responseBody };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Retrieves Customer users.
 *
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all users.
 */

export async function GetCustomerUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { pageOffset, pageLimit } = request.params;
    const searchPromt = request.query.get("search") || "";
    const role = request.query.get("role") || "";
    let order = request.query.get("order") || "ASC";
    const colName = request.query.get("col_name") || "id";
    order = order.trim();
    console.log("colName", colName);
    let orderCriteria;
    if (colName === "rolename") {
      orderCriteria = [sequelize.col("UserCompanyRole.Role.rolename"), order];
    } else {
      orderCriteria = [colName.trim(), order];
    }
    let where = {};
    if (role) {
      where = { id: Number(role) };
    }
    console.log("colName123", colName);
    console.log("order123", order);
    const [usersResult, invitationsResult] = await Promise.all([
      User.findAndCountAll({
        include: [
          {
            model: UserCompanyRole,
            attributes: [],
            where: {
              is_active: 1,
            },
            include: [
              {
                model: Role,
                attributes: [],
                where,
              },
            ],
          },
        ],
        offset: parseInt(pageOffset),
        limit: parseInt(pageLimit),
        where: {
          type: 2,
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${searchPromt}%` } },
            { last_name: { [Op.iLike]: `%${searchPromt}%` } },
            { email: { [Op.iLike]: `%${searchPromt}%` } },
          ],
        },
        attributes: [
          "id",
          "email",
          "first_name",
          "last_name",
          "createdAt",
          [sequelize.col("UserCompanyRole.Role.rolename"), "rolename"],
          [sequelize.col("UserCompanyRole.Role.id"), "role_id"],
          [sequelize.col("UserCompanyRole.status"), "status"],
          [sequelize.col("UserCompanyRole.company_id"), "company_id"],
        ],
        order: [orderCriteria],
      }),
      { rows: [], count: 0 },
      //UserInvitation.findAndCountAll({
      //     offset: parseInt(pageOffset),
      //     limit: parseInt(pageLimit),
      //     where: {
      //         is_active: 1,
      //         type: 2,
      //         [Op.or]: [
      //             { email: { [Op.iLike]: `%${searchPromt}%` } },
      //         ]
      //     },
      //     attributes: ['id', 'email', 'invitation_sent_date', 'invitation_sent_time', 'status', "createdAt",
      //         [sequelize.col('company'), 'company_id'],
      //         [sequelize.col('Role.rolename'), 'rolename'],
      //         [sequelize.col('Role.id'), 'role_id']
      //     ],
      //     include: [{
      //         model: Role,
      //         attributes: [],
      //         where
      //     }
      //     ]
      // })
    ]);

    const users = usersResult?.rows?.map((user) => ({
      entry_type: 1,
      ...user.toJSON(),
    }));

    const invitations = invitationsResult?.rows?.map((invitation) => ({
      entry_type: 2,
      first_name: "",
      last_name: "",
      ...invitation.toJSON(),
    }));

    // Combine all results into one array
    const allData = [...users, ...invitations];
    const dataSection = {
      status: 200,
      body: {
        rows: allData,
        count: usersResult.count + invitationsResult.count,
      },
    };
    const responseBody = JSON.stringify(dataSection);

    return { body: responseBody };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Retrieves a user by ID.
 *
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the user with the specified ID.
 */
export async function GetAdminUserById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract user ID from request
    const { id } = request.params;

    // Get user by ID
    const user = await AdminUserController.getUserById(id);

    // Prepare response body
    const responseBody = JSON.stringify(user);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: 500, body: `Error: ${error.message}` };
  }
}

/**
 * Deletes a user by ID.
 *
 * @param request The HTTP request object containing user ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating the status of user deletion.
 */
export async function DeleteAdminUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract user ID from request
    const userId = request.params.id;

    // Delete user by ID
    const deleted = await AdminUserController.deleteUser(userId);

    // Prepare response body
    const responseBody = JSON.stringify({ deleted });

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

/**
 * Azure Function to retrieve the list of user invitations.
 *
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the list of user invitations.
 */
export async function GetUserInvitationList(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { offset, limit } = request.params;

    // Get the list of user invitations
    const invitationList =
      await AdminUserController.getAllInvitationsWithUserData(offset, limit);

    // Prepare response body
    const responseBody = JSON.stringify(invitationList);

    // Return success response
    return { body: responseBody };
  } catch (error) {
    // Return error response
    return {
      status: 500, // Internal Server Error status code
      body: `${error.message}`,
    };
  }
}

export async function SendEnervaInvitation(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request data
    const requestData: any = await request.json();
    console.log("requestData", requestData);
    const resp = await decodeTokenMiddleware(request, context, async () =>
      Promise.resolve({})
    );
    if (requestData.type != 2) {
      resp.company_id = null;
    }
    const data = await UserInvitationService.sendInvitation(requestData, resp);

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
 * Retrieves permissions associated with a role by its ID.
 *
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing permissions data.
 */
export async function GetAdmnPermissionsByRoleId(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract role ID from request
    const roleId = parseInt(request.params.id);

    // Get permissions by role ID
    const permissions = await RolePermissionService.getPermissionsByRoleId(
      roleId
    );

    // Prepare response body
    const responseBody = JSON.stringify(permissions);

    // Return success response
    return { body: responseBody, status: 200 };
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

export async function AdAssignPermissions(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request data
    const requestData: any = await request.json();
    if (requestData.type != 2) {
      requestData.company_id = null;
    }

    // Create role
    const role = await RoleController.assignPermissions(requestData, context);

    // Prepare response body
    const responseBody = JSON.stringify(role);

    // Return success response
    return { body: responseBody, status: 200 };
  } catch (error) {
    // Return error response
    return { status: 500, body: `Error: ${error.message}` };
  }
}

/**
 * Retrieves permissions associated with a role by its ID.
 *
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing permissions data.
 */
export async function GetPermissionsByUserAdmin(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract role ID from request
    const user_id = parseInt(request.params.user_id);
    const type = parseInt(request.params.type);
    const company_id = parseInt(request.params.company_id);
    const entry_type = parseInt(request.params.entry_type);
    // let checkStatus = await CheckCompanyStatus(company_id)
    // if (!checkStatus) {
    //     return { status: 401, body: RESPONSE_MESSAGES.notFound404 };
    // }
    let userInvitations;
    if (entry_type == 2) {
      if (type == 2) {
        userInvitations = await UserInvitation.findOne({
          where: {
            company: company_id,
            id: user_id,
          },
        });
      } else {
        userInvitations = await UserInvitation.findOne({
          where: {
            company: null,
            id: user_id,
          },
        });
      }
      const responseBody = JSON.stringify(userInvitations);

      // Return success response
      return { body: responseBody, status: 200 };
    } else if (type == 2) {
      const userPermissions: any = await UserCompanyRolePermission.findAll({
        where: {
          user_id: user_id,
          company_id: company_id,
        },
        include: [
          {
            model: User,
            attributes: ["email"],
          },
        ],
      });

      // Aggregate permissions into an array
      const permissionsArray = userPermissions.map(
        (permission) => permission.permission_id
      );
      context.log("permissionsArray", userPermissions);

      // Return a single object
      let permissions = {
        id: user_id,
        email:
          userPermissions.length > 0 ? userPermissions[0].User.email : null,
        role: userPermissions.length > 0 ? userPermissions[0].role_id : null,
        company: company_id,
        permissions: permissionsArray,
      };

      // console.log("Obj",  obj);
      const responseBody = JSON.stringify(permissions);

      // Return success response
      return { body: responseBody, status: 200 };
    } else {
      const userPermissions: any = await UserCompanyRolePermission.findAll({
        where: {
          user_id: user_id,
          company_id: null,
        },
        include: [
          {
            model: User,
            attributes: ["email"],
          },
        ],
      });

      // Aggregate permissions into an array
      const permissionsArray = userPermissions.map(
        (permission) => permission.permission_id
      );
      context.log("permissionsArray", userPermissions);

      // Return a single object
      let permissions = {
        id: user_id,
        email:
          userPermissions.length > 0 ? userPermissions[0].User.email : null,
        role: userPermissions.length > 0 ? userPermissions[0].role_id : null,
        permissions: permissionsArray,
      };

      // console.log("Obj",  obj);
      const responseBody = JSON.stringify(permissions);

      // Return success response
      return { body: responseBody, status: 200 };
    }
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

/**
 * Admin add resource permission.
 *
 * @param request The HTTP request object containing role ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing permissions data.
 */
export async function AddResourceFacilityPermission(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract emails from request
    const requestData: any = await request.json();
    //let emails = requestData.email.split(",")
    let emails = requestData.email.split(",").map((email) => email.trim());
    let facilityId = requestData.facilityId;
    let company_id = requestData.companyId;
    for (let i = 0; i < emails.length; i++) {
      for (let j = 0; j < facilityId.length; j++) {
        let alreadyCheck = await UserResourceFacilityPermission.findOne({
          where: {
            email: emails[i],
            facility_id: facilityId[j],
            company_id,
            resource_permission_id: 5, // default for 5 for full crud operation
          },
          attributes: [
            "id",
            "resource_permission_id",
            "email",
            "facility_id",
            "is_created",
          ],
        });
        if (!alreadyCheck && !alreadyCheck?.id) {
          await UserResourceFacilityPermission.create({
            email: emails[i],
            facility_id: facilityId[j],
            resource_permission_id: 5,
            company_id,
          });
        }
      }
    }
    // Prepare response body
    const resp = { status: 200, body: "Permission grant successfully" };
    // Prepare response body
    const responseBody = JSON.stringify(resp);
    // Return success response
    return { body: responseBody, status: 200 };
  } catch (error) {
    // Return error response
    return { status: 500, body: `${error.message}` };
  }
}

export async function SearchUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse request data
    const requestData: any = await request.json();
    let data = requestData.data;
    let offset = requestData.offset;
    let limit = requestData.limit;
    let order = requestData.order || "ASC";
    let col_name = requestData.col_name || "id";
    let company_id = requestData.company_id || null;
    if (!data) {
      data = [];
    }
    const users = await AdminUserController.searchUsers(
      data,
      offset,
      limit,
      order,
      col_name,
      company_id
    );

    // Prepare response body
    const responseBody = JSON.stringify(users);

    // Return success response
    return { body: responseBody, status: 200 };
  } catch (error) {
    // Return error response
    return { status: 500, body: `Error: ${error.message}` };
  }
}

/**
 * Add or update custom columns.
 *
 * @param request The HTTP request object containing fields and type.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the result of the operation.
 */
export async function SaveCustomColumns(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract data from request
    const requestData: any = await request.json();
    const { fields, type } = requestData;

    for (let i = 0; i < fields.length; i++) {
      const { field_slug, field_name, is_checked } = fields[i];

      // Check if the record exists
      let existingColumn = await CustomColumn.findOne({
        where: {
          field_slug,
          module_type: type,
        },
      });

      if (existingColumn) {
        // If it exists, update the `is_checked` value
        existingColumn.is_checked = is_checked;
        await existingColumn.save();
      } else {
        // If it doesn't exist, create a new record
        await CustomColumn.create({
          field_slug,
          field_name,
          field_type: 'text',  // Assuming field_type is always 'text' as per your instructions
          module_type: type,
          createdat: new Date(),
          updatedat: new Date(),
          created_by: 1,
          updated_by: 1,
          is_checked,
        });
      }
    }

    // Prepare response
    const response = { status: 200, body: 'Custom columns processed successfully' };
    return { body: JSON.stringify(response), status: 200 };
  } catch (error) {
    // Return error response in case of failure
    return { status: 500, body: `Error: ${error.message}` };
  }
}

/**
 * Get custom columns based on module type.
 *
 * @param request The HTTP request object containing the module type.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the columns data.
 */
export async function GetCustomColumns(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Extract module type from query parameters
    //const moduleType = request.query.get('type');

    const moduleType = request.params.type;


    if (!moduleType) {
      return { status: 400, body: 'Type is required' };
    }

    // Fetch custom columns based on the module type
    const customColumns = await CustomColumn.findAll({
      where: {
        module_type: moduleType,
      },
      attributes: ['id', 'field_slug', 'field_name', 'module_type', 'is_checked']
    });

    // Prepare response
    const response = { status: 200, body: JSON.stringify(customColumns) };
    return { body: response.body, status: response.status };
  } catch (error) {
    // Return error response in case of failure
    return { status: 500, body: `Error: ${error.message}` };
  }
}

app.http("SaveCustomColumns", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "columns/save",
  handler: SaveCustomColumns,
});

app.http("GetCustomColumns", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "columns/get/{type}",
  handler: GetCustomColumns,
});

app.http("SearchUsers", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "search/users",
  handler: SearchUsers,
});

app.http("SendEnervaInvitation", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "program/send",
  handler: SendEnervaInvitation,
});
app.http("AddResourceFacilityPermission", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "resource-permission/add",
  handler: AddResourceFacilityPermission,
});

app.http("GetEnervaUsers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "enerva/{pageOffset}/{pageLimit}",
  handler: GetEnervaUsers,
});
app.http("GetIESOUsers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "ieso/{pageOffset}/{pageLimit}",
  handler: GetIESOUsers,
});
app.http("GetCustomerUsers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "customer/{pageOffset}/{pageLimit}",
  handler: GetCustomerUsers,
});

app.http("GetAdminUserById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "usr/{id}",
  handler: GetAdminUserById,
});

app.http("DeleteAdminUser", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "usr/{id}",
  handler: DeleteAdminUser,
});
app.http("AdAssignPermissions", {
  methods: ["POST"],
  route: "adassign",
  authLevel: "anonymous",
  handler: AdAssignPermissions,
});
app.http("GetAdmnPermissionsByRoleId", {
  route: "program/rolepermission/{id}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetAdmnPermissionsByRoleId,
});

app.http("GetPermissionsByUserAdmin", {
  route: "program/user/permissions/{user_id}/{type}/{company_id}/{entry_type}",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetPermissionsByUserAdmin,
});
