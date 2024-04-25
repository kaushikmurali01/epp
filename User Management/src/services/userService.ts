import { User } from '../models/user';
import { UserAttributes } from 'enerva-utils/interfaces/user';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
 import { Response } from 'enerva-utils/interfaces/response';
 //import { RESPONSE_MESSAGES } from 'enerva-utils/utils/message';
 import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';


class UserService {

/**
 * Registers a new user with provided details.
 * 
 * @param userDetails - Object containing user details such as first_name, last_name, email, password, and address.
 * @returns Promise<Response> - A promise resolving to a response indicating the status of user registration.
 * @description Registers a new user by creating a user record in the database with specified user details. Returns a response indicating the success or failure of the registration process.
 */
static async registerUser(userDetails): Promise<Response> {
  try {
    //await testDatabaseConnection();
   const user = await User.create(userDetails, { fields: ['first_name', 'last_name', 'email', 'password', 'phonenumber', 'address'] });
    return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.singupSuccess };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

  /**
   * Updates an existing user with provided details.
   * 
   * @param id - The ID of the user to be updated.
   * @param userDetails - Object containing user details to be updated.
   * @returns Promise<User | null> - A promise resolving to the updated user if successful, otherwise null.
   * @description Updates an existing user record in the database with specified user details.
   */
  static async updateUser(id: number, userDetails:Object): Promise<User | null> {
    try {
      const [rowsAffected, updatedUsers] = await User.update(userDetails, {
        where: { id },
        returning: true,
      });
      if (rowsAffected === 0) return null;
      return updatedUsers[0];
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Retrieves all users from the database.
   * 
   * @returns Promise<User[]> - A promise resolving to an array of all users.
   * @description Retrieves all user records from the database.
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Retrieves a user by ID from the database.
   * 
   * @param id - The ID of the user to retrieve.
   * @returns Promise<User | null> - A promise resolving to the user if found, otherwise null.
   * @description Retrieves a user record from the database by its ID.
   */
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Deletes a user from the database by ID.
   * 
   * @param id - The ID of the user to delete.
   * @returns Promise<boolean> - A promise resolving to true if deletion is successful, otherwise false.
   * @description Deletes a user record from the database by its ID.
   */
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const rowsAffected = await User.destroy({ where: { id } });
      return rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

}

export { UserService };
