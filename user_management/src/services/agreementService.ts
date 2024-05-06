import { ParticipantAgreement } from '../models/agreement';
import { Response } from 'enerva-utils/interfaces/response';
import { testDatabaseConnection } from 'enerva-utils/utils/database';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class ParticipantAgreementService {

    /**
     * Creates a new participant agreement with provided details.
     * 
     * @param agreementDetails - Object containing participant agreement details such as company_id, user_id, signed_by, agreement_file_url, is_active, updated_by, etc.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of agreement creation.
     * @description Creates a new participant agreement by creating a record in the database with specified details. Returns a response indicating the success or failure of the creation process.
     */
    static async createParticipantAgreement(agreementDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const agreement = await ParticipantAgreement.create(agreementDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a participant agreement by its ID.
     * 
     * @param agreementId - The ID of the agreement to retrieve.
     * @returns Promise<Response> - A promise resolving to a response containing the retrieved agreement data.
     * @description Retrieves an agreement from the database by its ID. Returns a response containing the retrieved agreement data.
     */
    static async getParticipantAgreementById(agreementId: number): Promise<any> {
        try {
            //await testDatabaseConnection();
            const agreement = await ParticipantAgreement.findByPk(agreementId);
            if (!agreement) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            return { status: HTTP_STATUS_CODES.SUCCESS, data: agreement };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Updates an existing participant agreement with new details.
     * 
     * @param agreementId - The ID of the agreement to update.
     * @param updatedDetails - Object containing updated agreement details.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of agreement update.
     * @description Updates an existing agreement in the database with new details. Returns a response indicating the success or failure of the update process.
     */
    static async updateParticipantAgreement(agreementId: number, updatedDetails): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const agreement = await ParticipantAgreement.findByPk(agreementId);
            if (!agreement) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await agreement.update(updatedDetails);
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Deletes an existing participant agreement.
     * 
     * @param agreementId - The ID of the agreement to delete.
     * @returns Promise<Response> - A promise resolving to a response indicating the status of agreement deletion.
     * @description Deletes an existing agreement from the database. Returns a response indicating the success or failure of the deletion process.
     */
    static async deleteParticipantAgreement(agreementId: number): Promise<Response> {
        try {
            //await testDatabaseConnection();
            const agreement = await ParticipantAgreement.findByPk(agreementId);
            if (!agreement) {
                throw new Error(RESPONSE_MESSAGES.notFound404);
            }
            await agreement.destroy();
            return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    /**
     * Retrieves a list of participant agreements.
     * 
     * @returns Promise<any[]>
     * @description Retrieves a list of agreements from the database.
     */
    static async listParticipantAgreements(): Promise<any[]> {
        try {
            const agreements = await ParticipantAgreement.findAll();
            return agreements;
        } catch (error) {
            throw error;
        }
    }

}

export { ParticipantAgreementService };
