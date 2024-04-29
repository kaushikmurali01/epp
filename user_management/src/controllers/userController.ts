import { HttpRequest, HttpResponse } from "@azure/functions";
import { UserService } from '../services/userService';

class UserController {

    /**
     * Registers a new user.
     * 
     * @param req - The HTTP request object containing user data.
     * @returns Promise<HttpResponse>
     * @description Handles the registration of a new user by extracting necessary data from the request body, invoking the UserService to register the user, and returning an HTTP response with appropriate status and JSON data.
     */
    static async registerUser(req): Promise<any> {
        try {
            console.log("body", req.body);
            const { first_name, last_name, email, password, address, phonenumber } = req as any;
            const user = await UserService.registerUser({ first_name, last_name, email, password, address, phonenumber });
            console.log('3333', user);
            return user;
        } catch (error) {
            return {
                status: 500,
                body: { error: error.message }
            };
        }
    }

      /**
   * Updates an existing user.
   * 
   * @param req - The HTTP request object containing user data.
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the updating of an existing user by extracting necessary data from the request body, invoking the UserService to update the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async updateUser(req): Promise<any> {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password, address, phonenumber } = req.body;
      const updatedUser = await UserService.updateUser(parseInt(id), { first_name, last_name, email, password, address, phonenumber });
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
   * Retrieves all users.
   * 
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of all users by invoking the UserService to fetch all users and returning an HTTP response with appropriate status and JSON data.
   */
  static async getAllUsers(): Promise<any> {
    try {
      const users = await UserService.getAllUsers();
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
   * Retrieves a user by ID.
   * 
   * @param req - The HTTP request object containing user ID.
   * @returns Promise<any> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of a user by ID by extracting the ID from the request parameters, invoking the UserService to fetch the user, and returning an HTTP response with appropriate status and JSON data.
   */
  static async getUserById(id): Promise<any> {
    try {
     // const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));
      console.log('user1000', user);
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
}

export { UserController };
