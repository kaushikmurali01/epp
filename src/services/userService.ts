import { User } from '../models/user';
import { UserAttributes } from '../interfaces/user';
import { testDatabaseConnection } from '../services/database';
import { Response } from '../interfaces/response';
import { message } from '../utils/message';
import { StatusCode } from '../utils/status';


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
    console.log("Details", userDetails);
    //await testDatabaseConnection();
    const user = await User.create(userDetails, { fields: ['first_name', 'last_name', 'email', 'password', 'address'] });
    return { status: StatusCode.Created, message: message.userCreated };
  } catch (error) {
    throw new Error(`Error registering user: ${error.message}`);
  }
}

}

export { UserService };
