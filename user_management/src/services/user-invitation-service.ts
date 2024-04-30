import { UserInvitation } from '../models/user-invitation';
import { User } from '../models/user';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class UserInvitationService {
  /**
   * Retrieves all user invitations from the database along with user data for the created_by and updated_by fields.
   * 
   * @returns Promise<Response> - A promise resolving to a response containing all user invitations along with user data for created_by and updated_by.
   * @description Retrieves all user invitations from the database along with user data for the created_by and updated_by fields.
   */
  static async getAllInvitationsWithUserData(offset, limit): Promise<Object> {
    try {
      // const invitations = await UserInvitation.findAll({
      //   include: [
      //     {
      //       model: User,
      //       as: 'createdByUser',
      //       attributes: ['invited_by_email'] 
      //     }
      //   ]
      // });

      return await UserInvitation.findAll({
        offset: offset,
        limit: limit,
    });

      // const invitations = await UserInvitation.findAll({
      //   offset: offset, 
      //   limit: limit,   
      //   include: [
      //     {
      //       model: User,
      //       as: 'createdByUser',
      //       attributes: ['email as invitedByEmail'] 
      //     }
      //   ]
      // });

      // return {
      //   status: HTTP_STATUS_CODES.SUCCESS,
      //   message: RESPONSE_MESSAGES.Success,
      //   data: invitations
      // };
    } catch (error) {
      throw new Error(`Failed to fetch user invitations: ${error.message}`);
    }
  }
}

export { UserInvitationService };
