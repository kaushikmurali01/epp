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

}

export { UserService };
