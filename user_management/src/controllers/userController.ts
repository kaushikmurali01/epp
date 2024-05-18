import { HttpRequest, HttpResponse } from "@azure/functions";
import { UserService } from '../services/userService';
import { UserInvitationService } from '../services/user-invitation-service'; // Assuming the correct import path
import { UserRequestService } from "../services/userRequestService";
import { CompanyService } from "../services/companyService";
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from "enerva-utils/utils/status";
import { UserCompanyRole } from "../models/user-company-role";
import { CompanyController } from "./companyController";

class UserController {

  /**
   * Registers a new user.
   * 
   * @param req - The HTTP request object containing user data.
   * @returns Promise<HttpResponse>
   * @description Handles the registration of a new user by extracting necessary data from the request body, invoking the UserService to register the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async registerUser(user: any, company: any, context): Promise<any> {
    try {
      let companyData = null;
      let company_id = null;
      let data;
      const userData = await UserService.registerUser(user);
      context.log("company", company);
      if (userData.type == 2) {
        companyData = await CompanyService.createCompany(company);
        if (!companyData) {
          return { status: 400, body: { error: "No company created." } };
        }
        context.log("ccccc", companyData);
        data = {
          "company_id": companyData.dataValues.id,
          "role_id": 1,
          "user_id": userData.id
        };
        await UserCompanyRole.create(data);
       
      } 
      // else {
      //    data = {
      //     "company_id": null,
      //     "role_id": 1,
      //     "user_id": userData.id
      // };
      // }
      
          return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, user:userData, company:companyData };
      } catch (error) {
          return { status: 400, body: { error: error.message } };
      }
    }
  

  /**
* Updates an existing user.
* 
* @param req - The HTTP request object containing user data.
* @returns Promise<any> - A promise resolving to an HTTP response.
* @description Handles the updating of an existing user by extracting necessary data from the request body, invoking the UserService to update the user, and returning an HTTP response with appropriate status and JSON data.
*/
  static async updateUser(req, userId, companyId): Promise<any> {
    try {
      // const { id } = req.params;
      // const { first_name, last_name, email, password, address, phonenumber } = req.body;
      // const updatedUser = await UserService.updateUser(parseInt(id), { first_name, last_name, email, password, address, phonenumber });
      let companyData;
      let userData;
      const id = userId;
      const { first_name, last_name, phonenumber, landline, profile_pic } = req.user;
      userData = await UserService.updateUser(parseInt(id), { first_name, last_name, phonenumber, landline, profile_pic });

      if (userData.type === 2) {
        // Update company
        companyData = await CompanyController.updateCompany(req.company, companyId);
      }

      if (userData) {
        return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success, user: userData, company: companyData };

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
   * Retrieves all users.
   * 
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of all users by invoking the UserService to fetch all users and returning an HTTP response with appropriate status and JSON data.
   */
  static async getAllUsers(offset, limit): Promise<any> {
    try {
      const users = await UserService.getEnervaUsers(offset, limit);
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
      const users = await UserService.getIESOUsers(offset, limit);
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

  /**
  * Retrieves all combined users.
  * 
  * @returns Promise<any> - A promise resolving to an HTTP response.
  * @description Handles the retrieval of all users by invoking the UserService to fetch all users and returning an HTTP response with appropriate status and JSON data.
  */
  static async getCombinedUsers(offset, limit, company, entrytype, search): Promise<any> {
    try {
      const data = await UserService.getCombinedUsers(offset, limit, company, entrytype, search);
      return {
        status: 200, // OK status code
        body: data
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  static async getFilteredUsers(offset, limit, company, entrytype, search): Promise<any> {
    try {
      const data = await UserService.getFilteredUsers(offset, limit, company, entrytype, search);
      return {
        status: 200, // OK status code
        body: data
      };
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
   * @description Handles the retrieval of a user by ID by extracting the ID from the request parameters, invoking the UserService to fetch the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async getUserById(tokenData): Promise<any> {
    try {
     // const { id } = req.params;
     let id = tokenData.id;
      const user = await UserService.getUserById(parseInt(id), tokenData.company_id);
      console.log('user1000', user);
      if (user) {
        return user;
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
   * @description Handles the deletion of a user by ID by extracting the ID from the request parameters, invoking the UserService to delete the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async deleteUser(req): Promise<any> {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(parseInt(id));
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

  static async createUserRequest(requestData, resp): Promise<any> {
    try {
      const data = await UserRequestService.createUserRequest(requestData, resp)
      return data;
    } catch (error) {
      return { status: 500, body: { error: error.message } };
    }
  }

  static async acceptInvitation(requestData): Promise<any> {
    try {
      const data = await UserService.acceptInvitation(requestData);
      return data;
    } catch (error) {
      return { status: 500, body: { error: error.message } };
    }
  }
}

export { UserController };
