import { HttpRequest, HttpResponse } from "@azure/functions";
import { AdminUserService } from '../services/adminUserService';
import { UserInvitationService } from '../services/user-invitation-service'; // Assuming the correct import path
import { UserRequestService } from "../services/userRequestService";

class AdminUserController {

    /**
     * Registers a new user.
     * 
     * @param req - The HTTP request object containing user data.
     * @returns Promise<HttpResponse>
     * @description Handles the registration of a new user by extracting necessary data from the request body, invoking the AdminUserService to register the user, and returning an HTTP response with appropriate status and JSON data.
     */
    static async registerAdminUser(requestData): Promise<any> {
        try {
          const company = await AdminUserService.registerUser(requestData);
          return company;
      } catch (error) {
          return { status: 500, body: { error: error.message } };
      }
    }

      /**
   * Updates an existing user.
   * 
   * @param req - The HTTP request object containing user data.
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the updating of an existing user by extracting necessary data from the request body, invoking the AdminUserService to update the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async updateUser(req): Promise<any> {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password, address, phonenumber } = req.body;
      const updatedUser = await AdminUserService.updateUser(parseInt(id), { first_name, last_name, email, password, address, phonenumber });
      if (updatedUser) {
        return {
          status: 200, // OK status code
          body: { user: updatedUser }
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  /**
   * Retrieves all users
   * 
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of all users by invoking the AdminUserService to fetch all users and returning an HTTP response with appropriate status and JSON data.
   */
  static async GetEnervaUsers(offset, limit): Promise<any> {
    try {
      const users = await AdminUserService.getEnervaUsers(offset, limit);
      return {
        status: 200, // OK status code
        body: { users }
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  static async getIESOUsers(offset, limit): Promise<any> {
    try {
      const users = await AdminUserService.getIESOUsers(offset, limit);
      return {
        status: 200, // OK status code
        body: { users }
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  static async getCustomerUsers(offset, limit): Promise<any> {
    try {
      const users = await AdminUserService.getCustomerUsers(offset, limit);
      return {
        status: 200, // OK status code
        body: { users }
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  static async searchUsers(data, offset, limit, order, col_name, company_id, filters): Promise<any> {
    try {
      const users = await AdminUserService.search(data, offset, limit, order, col_name, company_id, filters);
      return users;
      // return {
      //   status: 200, // OK status code
      //   body: { users }
      // };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

   

  /**
   * Retrieves a user by ID.
   * 
   * @param req - The HTTP request object containing user ID.
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of a user by ID by extracting the ID from the request parameters, invoking the AdminUserService to fetch the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async getUserById(id): Promise<any> {
    try {
      const user = await AdminUserService.getUserById(parseInt(id));
      if (user) {
        return {
          status: 200, // OK status code
          body: { user }
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  /**
   * Deletes a user by ID.
   * 
   * @param req - The HTTP request object containing user ID.
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the deletion of a user by ID by extracting the ID from the request parameters, invoking the AdminUserService to delete the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async deleteUser(req): Promise<any> {
    try {
      const { id } = req.params;
      const deleted = await AdminUserService.deleteUser(parseInt(id));
      if (deleted) {
        return {
          status: 204, // No Content status code (successful deletion)
          body: {}
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

    /**
   * Retrieves all user invitations along with associated user data.
   * 
   * @param req - The HTTP request object.
   * @returns Promise<HttpResponse> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of all user invitations along with associated user data by calling the UserInvitationService and returning an HTTP response with the fetched data.
   */
    static async getAllInvitationsWithUserData(offset, limit): Promise<Object> {
      try {
        const invitations = await UserInvitationService.getAllInvitationsWithUserData(offset, limit);
        return {
          status: 200,
          body: invitations
        };
      } catch (error) {
        return {
          status: 500,
          body: { error: error.message }
        };
      }
    }

  //   static async createUserRequest(requestData): Promise<any> {
  //     try {
  //       const data = await UserRequestService.createUserRequest(requestData)
  //       return data;
  //   } catch (error) {
  //       return { status: 500, body: { error: error.message } };
  //   }
  // }

  static async acceptInvitation(requestData): Promise<any> {
    try {
      const data = await AdminUserService.acceptInvitation(requestData);
      return data;
  } catch (error) {
      return { status: 500, body: { error: error.message } };
  }
}
}

export { AdminUserController };
