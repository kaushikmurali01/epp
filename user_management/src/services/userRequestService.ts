import { UserRequest } from '../models/user-request';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class UserRequestService {

    /**
     * Creates a new user request with provided details.
     * 
     * @param userRequestDetails - Object containing user request details such as company_id, role, date_of_request_sent, etc.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user request creation.
     * @description Creates a new user request by creating a user request record in the database with specified details. Returns a response indicating the success or failure of the creation process.
     */
    static async createUserRequest(userRequestDetails, resp): Promise<Response> {
        try {
            //await testDatabaseConnection();
           // userRequestDetails.user_id = resp.user_id;
            console.log("USerDetails",userRequestDetails );
           // console.log("userRequestDetails",userRequestDetails);
            const userRequest = await UserRequest.create(userRequestDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a user request by its ID.
     * 
     * @param userRequestId - The ID of the user request to retrieve.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved user request data.
     * @description Retrieves a user request from the database by its ID. Returns a response containing the retrieved user request data.
     */
    static async getUserRequestById(userRequestId: number): Promise<any> {
        try {
            await testDatabaseConnection();
            const userRequest = await UserRequest.findByPk(userRequestId);
            if (!userRequest) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            return { status: HTTP_STATUS_CODES.SUCCESS, data: userRequest };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Updates an existing user request with new details.
     * 
     * @param userRequestId - The ID of the user request to update.
     * @param updatedDetails - Object containing updated user request details.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user request update.
     * @description Updates an existing user request in the database with new details. Returns a response indicating the success or failure of the update process.
     */
    static async updateUserRequest(userRequestId: number, updatedDetails): Promise<Response> {
        try {
            await testDatabaseConnection();
            const userRequest = await UserRequest.findByPk(userRequestId);
            if (!userRequest) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await userRequest.update(updatedDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Deletes an existing user request.
     * 
     * @param userRequestId - The ID of the user request to delete.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of user request deletion.
     * @description Deletes an existing user request from the database. Returns a response indicating the success or failure of the deletion process.
     */
    static async deleteUserRequest(userRequestId: number): Promise<Response> {
        try {
            await testDatabaseConnection();
            const userRequest = await UserRequest.findByPk(userRequestId);
            if (!userRequest) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await userRequest.destroy();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a list of user requests.
     * 
     * @returns Promise<any[]>
     * @description Retrieves a list of user requests from the database.
     */
    static async listUserRequests(): Promise<any[]> {
        try {
            const userRequests = await UserRequest.findAll();
            return userRequests;
        } catch (error) {
            throw error;
        }
    }

}

export { UserRequestService };
