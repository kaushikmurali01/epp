import { Contact } from '../models/contact-us';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { Email } from 'enerva-utils/common/email';
import { EmailTemplate } from '../utils/emailTemplate';

class ContactUsService {

  /**
   * Saves a new contact message with provided details.
   * 
   * @param contactDetails - Object containing contact details such as name, company, email, phone, and message.
   * @returns Promise<Response> - A promise resolving to a response indicating the status of contact message saving.
   * @description Saves a new contact message by creating a record in the database with specified details. Returns a response indicating the success or failure of the process.
   */
  static async saveContactMessage(contactDetails): Promise<Response> {
    try {
      
      const contact = await Contact.create(contactDetails, { fields: ['name', 'company', 'email', 'phone', 'message'] });
      const body = await EmailTemplate.getContactUsTemplate(contactDetails);
      Email.send(process.env["CONTACT_EMAIL_TO"], "Enerva Contact Us", body);
      return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
      throw new Error(`Failed to save contact message: ${error.message}`);
    }
  }

  /**
   * Retrieves all contact messages from the database.
   * 
   * @returns Promise<Contact[]> - A promise resolving to an array of all contact messages.
   * @description Retrieves all contact message records from the database.
   */
  static async getAllContactMessages(offset, limit): Promise<Contact[]> {
    try {
      return await Contact.findAll({
        offset: offset,
        limit: limit,
      });
    } catch (error) {
      throw new Error(`Failed to fetch contact messages: ${error.message}`);
    }
  }

  /**
   * Retrieves a contact message by ID from the database.
   * 
   * @param id - The ID of the contact message to retrieve.
   * @returns Promise<Contact | null> - A promise resolving to the contact message if found, otherwise null.
   * @description Retrieves a contact message record from the database by its ID.
   */
  static async getContactMessageById(id: number): Promise<Contact | null> {
    try {
      return await Contact.findByPk(id);
    } catch (error) {
      throw new Error(`Failed to fetch contact message: ${error.message}`);
    }
  }

  /**
   * Deletes a contact message from the database by ID.
   * 
   * @param id - The ID of the contact message to delete.
   * @returns Promise<boolean> - A promise resolving to true if deletion is successful, otherwise false.
   * @description Deletes a contact message record from the database by its ID.
   */
  static async deleteContactMessage(id: number): Promise<boolean> {
    try {
      const rowsAffected = await Contact.destroy({ where: { id } });
      return rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete contact message: ${error.message}`);
    }
  }

}

export { ContactUsService };
