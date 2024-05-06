import { HttpRequest } from "@azure/functions";
import { ParticipantAgreementService } from '../services/agreementService';

class ParticipantAgreementController {

    /**
     * Creates a new participant agreement.
     * 
     * @param req - The HTTP request object containing agreement data.
     * @returns Promise<Object>
     * @description Handles the creation of a new participant agreement by extracting necessary data from the request body, invoking the ParticipantAgreementService to create the agreement, and returning an object with appropriate status and JSON data.
     */
    static async createParticipantAgreement(req): Promise<Object> {
        try {
            const agreementDetails = req.body;
            const agreement = await ParticipantAgreementService.createParticipantAgreement(agreementDetails);
            return { status: 201, body: agreement };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a participant agreement by its ID.
     * 
     * @param req - The HTTP request object containing agreement ID.
     * @returns Promise<Object>
     * @description Handles the retrieval of a participant agreement by its ID by extracting the agreement ID from the request parameters, invoking the ParticipantAgreementService to get the agreement, and returning an object with appropriate status and JSON data.
     */
    static async getParticipantAgreement(req: HttpRequest): Promise<Object> {
        try {
            const agreementId = parseInt(req.params.id);
            const agreement = await ParticipantAgreementService.getParticipantAgreementById(agreementId);
            return { status: 200, body: agreement };
        } catch (error) {
            return { status: 404, body: { error: error.message } };
        }
    }

    /**
     * Retrieves a list of participant agreements.
     * 
     * @param req - The HTTP request object.
     * @returns Promise<Object>
     * @description Handles the retrieval of a list of participant agreements, invoking the ParticipantAgreementService to retrieve the agreements, and returning an object with appropriate status and JSON data.
     */
    static async listParticipantAgreements(req: HttpRequest): Promise<Object> {
        try {
            const agreements = await ParticipantAgreementService.listParticipantAgreements();
            return { status: 200, body: agreements };
        } catch (error) {
            return { status: 500, body: { error: error.message } };
        }
    }

    /**
     * Updates an existing participant agreement.
     * 
     * @param req - The HTTP request object containing updated agreement data.
     * @returns Promise<Object>
     * @description Handles the update of an existing participant agreement by extracting necessary data from the request body and parameters, invoking the ParticipantAgreementService to update the agreement, and returning an object with appropriate status and JSON data.
     */
    static async updateParticipantAgreement(req: HttpRequest): Promise<Object> {
        try {
            const agreementId = parseInt(req.params.id);
            const updatedData = req.body;
            await ParticipantAgreementService.updateParticipantAgreement(agreementId, updatedData);
            return { status: 200, body: { message: 'Participant agreement updated successfully' } };
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }

    /**
     * Deletes an existing participant agreement.
     * 
     * @param req - The HTTP request object containing agreement ID.
     * @returns Promise<Object>
     * @description Handles the deletion of an existing participant agreement by extracting the agreement ID from the request parameters, invoking the ParticipantAgreementService to delete the agreement, and returning an object with appropriate status and JSON data.
     */
    static async deleteParticipantAgreement(req: HttpRequest): Promise<Object> {
        try {
            const agreementId = parseInt(req.params.id);
            await ParticipantAgreementService.deleteParticipantAgreement(agreementId);
            return { status: 204 };
        } catch (error) {
            return { status: 400, body: { error: error.message } };
        }
    }
}

export { ParticipantAgreementController };
