import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { EnergyEmailTemplate } from '../utils/energyEmailTemplate'; // Import your email template
import { Email } from '../services/email';  // Create a service to send emails

/**
 * Sends an approval email using the Baseline Approval Email template.
 * 
 * @param request The HTTP request object containing email parameters.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating email sending status.
 */
export async function ModelApprovalEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData:any = await request.json(); 
        // Fetch email template and replace placeholders
        let emailTemplate = await EnergyEmailTemplate.getBaselineApprovalEmailTemplate();
        let emailContent = emailTemplate
            .replace('#facility_address#', requestData.facility_address)
            .replace('#facility_identifier#', requestData.facility_identifier)
            .replace('#legacy_epp_application_id#', requestData.legacy_epp_application_id);

        // Log email content for debugging purposes
        context.log('Sending email to:', requestData.toEmail);

        // Use the email service to send the email
        await Email.send(requestData.toEmail, 'Energy Performance Program - Baseline Approval', emailContent);

        // Return success response
        return { status: 200, body: 'Email sent successfully!' };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error sending email: ${error.message}` };
    }
}

/**
 * Sends a Notice of Approval email using the predefined HTML email template.
 * 
 * @param request The HTTP request object containing email parameters.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating email sending status.
 */
export async function NoticeOfApprovalEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData: any = await request.json();

        // Fetch the Notice of Approval Email template and replace placeholders
        let emailTemplate = await EnergyEmailTemplate.getNoticeOfApprovalEmailTemplate();
        let emailContent = emailTemplate
            .replace('#facility_identifier#', requestData.facility_identifier)
            .replace('#legal_name_of_applicant#', requestData.legal_name_of_applicant)
            .replace('#facility_type#', requestData.facility_type)
            .replace('#facility_address#', requestData.facility_address)
            .replace('#baseline_start_date#', requestData.baseline_start_date)
            .replace('#baseline_end_date#', requestData.baseline_end_date)
            .replace('#baseline_energy_consumption#', requestData.baseline_energy_consumption)
            .replace('#baseline_energy_model#', requestData.baseline_energy_model)
            .replace('#pre_project_incentive#', requestData.pre_project_incentive)
            .replace('#annual_incentive_cap_for_electricity_savings#', requestData.annual_incentive_cap_for_electricity_savings)
            .replace('#month#', requestData.month)
            .replace('#day#', requestData.day)
            .replace('#year#', requestData.year)
            .replace('#participant_first_name#', requestData.participant_first_name)
            .replace('#participant_on_behalf#', requestData.participant_on_behalf);

        // Log email content for debugging purposes
        context.log('Sending Notice of Approval email to:', requestData.toEmail);

        // Use the email service to send the email
        await Email.send(requestData.toEmail, 'Energy Performance Program - Notice of Approval', emailContent, requestData.cc);

        // Return success response
        return { status: 200, body: 'Email sent successfully!' };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error sending email: ${error.message}` };
    }
}

/**
 * Sends an email with the Signed Participant Agreement Acknowledgment template.
 * 
 * @param request The HTTP request object containing email parameters.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating email sending status.
 */
export async function SendSignedParticipantEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData: any = await request.json(); 

        // Fetch the email template and replace placeholders
        let emailTemplate = await EnergyEmailTemplate.getSignedParticipantEmailTemplate();
        let emailContent = emailTemplate
            .replace('#company_name#', requestData.company_name);

        // Log email content for debugging purposes
        context.log('Sending email to:', requestData.toEmail);

        // Use the email service to send the email
        await Email.send(requestData.toEmail, 'Energy Performance Program - Signed Participant Agreement Acknowledgment', emailContent);

        // Return success response
        return { status: 200, body: 'Email sent successfully!' };
    } catch (error) {
        // Log and return error response
        context.log(`Error sending email: ${error.message}`);
        return { status: 500, body: `Error sending email: ${error.message}` };
    }
}

// HTTP trigger for the Azure Function
app.http('ModelApprovalEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'email/sendApproval',
    handler: ModelApprovalEmail
});

app.http('NoticeOfApprovalEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'email/sendNoticeOfApproval',
    handler: NoticeOfApprovalEmail
});

app.http('SendSignedParticipantEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'email/sendSignedParticipant',
    handler: SendSignedParticipantEmail
});