import { HttpRequest } from "@azure/functions";
import { ParticipantAgreementController } from '../controllers/agreementController';

/**
 * Creates a new participant agreement.
 * 
 * @param request The HTTP request object containing agreement data.
 * @returns A promise resolving to an HTTP response containing agreement creation status.
 */
export async function CreateParticipantAgreement(request: HttpRequest): Promise<any> {
    try {
        const agreementDetails = request.body;
        const agreement = await ParticipantAgreementController.createParticipantAgreement(agreementDetails);
        return { status: 201, body: agreement };
    } catch (error) {
        return { status: 500, body: { error: error.message } };
    }
}

/**
 * Retrieves a participant agreement by its ID.
 * 
 * @param request The HTTP request object containing agreement ID.
 * @returns A promise resolving to an HTTP response containing agreement data.
 */
export async function GetParticipantAgreement(request: HttpRequest): Promise<any> {
    try {
        const agreementId = parseInt(request.params.id);
        const agreement = await ParticipantAgreementController.getParticipantAgreement(request);
        return { status: 200, body: agreement };
    } catch (error) {
        return { status: 404, body: { error: error.message } };
    }
}

/**
 * Retrieves a list of participant agreements.
 * 
 * @param request The HTTP request object.
 * @returns A promise resolving to an HTTP response containing a list of agreements.
 */
export async function ListParticipantAgreements(request: HttpRequest): Promise<any> {
    try {
        const agreements = await ParticipantAgreementController.listParticipantAgreements(request);
        return { status: 200, body: agreements };
    } catch (error) {
        return { status: 500, body: { error: error.message } };
    }
}

/**
 * Updates an existing participant agreement.
 * 
 * @param request The HTTP request object containing updated agreement data.
 * @returns A promise resolving to an HTTP response containing agreement updation status.
 */
export async function UpdateParticipantAgreement(request: HttpRequest): Promise<any> {
    try {
        const agreementId = parseInt(request.params.id);
        const updatedData = request.body;
        await ParticipantAgreementController.updateParticipantAgreement(request);
        return { status: 200, body: { message: 'Participant agreement updated successfully' } };
    } catch (error) {
        return { status: 400, body: { error: error.message } };
    }
}

/**
 * Deletes a participant agreement by its ID.
 * 
 * @param request The HTTP request object containing agreement ID.
 * @returns A promise resolving to an HTTP response indicating agreement deletion status.
 */
export async function DeleteParticipantAgreement(request: HttpRequest): Promise<any> {
    try {
        const agreementId = parseInt(request.params.id);
        await ParticipantAgreementController.deleteParticipantAgreement(request);
        return { status: 204 };
    } catch (error) {
        return { status: 400, body: { error: error.message } };
    }
}

