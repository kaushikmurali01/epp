import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AdminUserController } from '../controllers/adminUserController';
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

/**
 * Registers a new user based on the provided request data.
 * 
 * @param request The HTTP request object containing user data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing user registration status.
 */
export async function AdminUserRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
export async function AdminUserUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
export async function GetEnervaUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { pageOffset, pageLimit } = request.params;
        const [usersResult, invitationsResult] = await Promise.all([
          User.findAndCountAll({
              include: [{
                  model: UserCompanyRole,
                  attributes: [],
                  where: {
                    is_active: 1
                  },
                  include: [{
                      model: Role,
                      attributes: []
                  }]
              }],
              offset: parseInt(pageOffset),
              limit: parseInt(pageLimit),
              where: {
                type: 1,
                is_active: 1 
              },
              attributes: ["id", "email", "first_name", "last_name", "createdAt",
                  [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
                  [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
                  [sequelize.col('UserCompanyRole.status'), 'status']
              ],
          }),
          UserInvitation.findAndCountAll({
            offset: parseInt(pageOffset),
            limit: parseInt(pageLimit),
              where: {
                is_active: 1,
                type: 1
              },
              attributes: ['id', 'email', 'invitation_sent_date', 'invitation_sent_time', 'status', "createdAt",
                  [sequelize.col('Role.rolename'), 'rolename'],
                  [sequelize.col('Role.id'), 'role_id']
              ],
              include: [{
                      model: Role,
                      attributes: []
                  }
              ]
          })
          
      ]);
      
      const users = usersResult?.rows?.map(user => ({
          entry_type: 1,
          ...user.toJSON()
      }));
      let userCount = usersResult.count;
      const invitations = invitationsResult?.rows?.map(invitation => ({
          entry_type: 2,
          first_name: "",
          last_name: "",
          ...invitation.toJSON()
      }));

      let inviteCount = invitationsResult.count;
      
      
      
      // Combine all results into one array
      const allData = [...users, ...invitations];
      const data = {status: 200, body: {
        rows:allData,
        count:userCount+inviteCount
      }}
      const responseBody = JSON.stringify(data);

      return { body: responseBody };
      
    } catch (error) {
        console.error('Error fetching data:', error);
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

export async function GetIESOUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    

    try {
        const { pageOffset, pageLimit } = request.params;
        const [usersResult, invitationsResult] = await Promise.all([
          User.findAndCountAll({
              include: [{
                  model: UserCompanyRole,
                  attributes: [],
                  where: {
                    is_active: 1
                  },
                  include: [{
                      model: Role,
                      attributes: []
                  }]
              }],
              offset: parseInt(pageOffset),
              limit: parseInt(pageLimit),
              where: {
                type: 4,
                is_active: 1 
              },
              attributes: ["id", "email", "first_name", "last_name", "createdAt",
                  [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
                  [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
                  [sequelize.col('UserCompanyRole.status'), 'status']
              ],
          }),
          UserInvitation.findAndCountAll({
            offset: parseInt(pageOffset),
            limit: parseInt(pageLimit),
              where: {
                is_active: 1,
                type: 4
              },
              attributes: ['id', 'email', 'invitation_sent_date', 'invitation_sent_time', 'status', "createdAt",
                  [sequelize.col('Role.rolename'), 'rolename'],
                  [sequelize.col('Role.id'), 'role_id']
              ],
              include: [{
                      model: Role,
                      attributes: []
                  }
              ]
          })
          
      ]);
      
      const users = usersResult?.rows?.map(user => ({
          entry_type: 1,
          ...user.toJSON()
      }));
      
      const invitations = invitationsResult?.rows?.map(invitation => ({
          entry_type: 2,
          first_name: "",
          last_name: "",
          ...invitation.toJSON()
      }));
      
      
      
      // Combine all results into one array
      const allData = [...users, ...invitations];
      

      const data = {status: 200, body: {
        rows:allData,
        count:usersResult.count+invitationsResult.count
      }}

      const responseBody = JSON.stringify(data);

      return { body: responseBody };
      
    } catch (error) {
        console.error('Error fetching data:', error);
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

export async function GetCustomerUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // try {

    //     const { offset, limit } = request.params;

    //     // Get all users
    //     const users = await AdminUserController.getCustomerUsers(offset, limit);
       
    //     // Prepare response body
    //     const responseBody = JSON.stringify(users);

    //     // Return success response
    //     return { body: responseBody };
    // } catch (error) {
    //     // Return error response
    //     return { status: 500, body: `${error.message}` };
    // }

    try {
        const { pageOffset, pageLimit } = request.params;
        const [usersResult, invitationsResult] = await Promise.all([
          User.findAll({
              include: [{
                  model: UserCompanyRole,
                  attributes: [],
                  where: {
                    is_active: 1
                  },
                  include: [{
                      model: Role,
                      attributes: []
                  }]
              }],
              offset: parseInt(pageOffset),
              limit: parseInt(pageLimit),
              where: {
                type: 2,
                is_active: 1 
              },
              attributes: ["id", "email", "first_name", "last_name", "createdAt",
                  [sequelize.col('UserCompanyRole.Role.rolename'), 'rolename'],
                  [sequelize.col('UserCompanyRole.Role.id'), 'role_id'],
                  [sequelize.col('UserCompanyRole.status'), 'status']
              ],
          }),
          UserInvitation.findAll({
            offset: parseInt(pageOffset),
            limit: parseInt(pageLimit),
              where: {
                is_active: 1,
                type: 2
              },
              attributes: ['id', 'email', 'invitation_sent_date', 'invitation_sent_time', 'status', "createdAt",
                  [sequelize.col('Role.rolename'), 'rolename'],
                  [sequelize.col('Role.id'), 'role_id']
              ],
              include: [{
                      model: Role,
                      attributes: []
                  }
              ]
          })
          
      ]);
      
      const users = usersResult.map(user => ({
          entry_type: 1,
          ...user.toJSON()
      }));
      
      const invitations = invitationsResult.map(invitation => ({
          entry_type: 2,
          first_name: "",
          last_name: "",
          ...invitation.toJSON()
      }));
      
      
      
      // Combine all results into one array
      const allData = [...users, ...invitations];
      const responseBody = JSON.stringify(allData);

      return { body: responseBody };
      
    } catch (error) {
        console.error('Error fetching data:', error);
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
export async function GetAdminUserById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
export async function DeleteAdminUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
export async function GetUserInvitationList(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { offset, limit } = request.params;

        // Get the list of user invitations
        const invitationList = await AdminUserController.getAllInvitationsWithUserData(offset, limit);

        // Prepare response body
        const responseBody = JSON.stringify(invitationList);

       
        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return {
            status: 500, // Internal Server Error status code
            body: `${error.message}`
        };
    }
}

export async function SendEnervaInvitation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // try {
    //     // Parse request data
    //     const requestData = await request.json(); 
    //     const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));

    //     const data = await UserInvitationService.sendInvitation(requestData, resp);
       
    //     // Prepare response body
    //     const responseBody = JSON.stringify(data);

    //     // Return success response
    //     return { body: responseBody };
    // } catch (error) {
    //     // Return error response
    //     return { status: 500, body: `${error.message}` };
    // }

    try {
        // Parse request data
        const requestData = await request.json(); 
        console.log('requestData', requestData);
        const resp = await decodeTokenMiddleware(request, context, async () => Promise.resolve({}));
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
export async function GetAdmnPermissionsByRoleId(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        const roleId = parseInt(request.params.id);

        // Get permissions by role ID
        const permissions = await RolePermissionService.getPermissionsByRoleId(roleId);

        // Prepare response body
        const responseBody = JSON.stringify(permissions);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

export async function AdAssignPermissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create role
        const role = await RoleController.assignPermissions(requestData);
       
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
export async function GetPermissionsByUserAdmin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract role ID from request
        const user_id = parseInt(request.params.user_id);
      //  const company_id = parseInt(request.params.company_id);

        // Get permissions by role ID
        const userInvitations = await UserInvitation.findAll({
            where: {
              type: 1,
              id: user_id
            }
        });

        // Prepare response body
        const responseBody = JSON.stringify(userInvitations);

        // Return success response
        return { body: responseBody, status: 200 };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

app.http('SendEnervaInvitation', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'program/send',
    handler: SendEnervaInvitation
});

app.http('GetEnervaUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'enerva/{pageOffset}/{pageLimit}',
    handler: GetEnervaUsers
});
app.http('GetIESOUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'ieso/{pageOffset}/{pageLimit}',
    handler: GetIESOUsers
});
app.http('GetCustomerUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'customer/{pageOffset}/{pageLimit}',
    handler: GetCustomerUsers
});


app.http('GetAdminUserById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usr/{id}',
    handler: GetAdminUserById
});

app.http('DeleteAdminUser', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'usr/{id}',
    handler: DeleteAdminUser
});
app.http('AdAssignPermissions', {
    methods: ['POST'],
    route: 'adassign',
    authLevel: 'anonymous',
    handler: AdAssignPermissions
});
app.http('GetAdmnPermissionsByRoleId', {
    route: 'program/rolepermission/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAdmnPermissionsByRoleId
});

app.http('GetPermissionsByUserAdmin', {
    route: 'program/user/permissions/{user_id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetPermissionsByUserAdmin
});


