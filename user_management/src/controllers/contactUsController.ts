import { HttpRequest, HttpResponse } from "@azure/functions";
import { ContactUsService } from '../services/contactUsService';

class ContactUsController {

  /**
   * Saves a new contact message.
   * 
   * @param req - The HTTP request object containing contact message data.
   * @returns Promise<HttpResponse> - A promise resolving to an HTTP response.
   * @description Handles the saving of a new contact message by extracting necessary data from the request body, invoking the ContactUsService to save the message, and returning an HTTP response with appropriate status and JSON data.
   */
  static async saveContactMessage(requestData): Promise<Object> {
    try {
        const company = await ContactUsService.saveContactMessage(requestData);
        return company;
    } catch (error) {
        return { status: 500, body: { error: error.message } };
    }
  }

  /**
   * Retrieves all contact messages.
   * 
   * @param req - The HTTP request object.
   * @returns Promise<HttpResponse> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of all contact messages by invoking the ContactUsService to fetch them and returning an HTTP response with appropriate status and JSON data.
   */
  static async getAllContactMessages(offset, limit): Promise<Object> {
    try {
     
      const messages = await ContactUsService.getAllContactMessages(offset, limit);
      return {
        status: 200,
        body: { messages }
      };
    } catch (error) {
      return {
        status: 500,
        body: { error: error.message }
      };
    }
  }

  /**
   * Retrieves a contact message by ID.
   * 
   * @param req - The HTTP request object containing contact message ID.
   * @returns Promise<HttpResponse> - A promise resolving to an HTTP response.
   * @description Handles the retrieval of a contact message by ID by extracting the ID from the request parameters, invoking the ContactUsService to fetch the message, and returning an HTTP response with appropriate status and JSON data.
   */
  static async getContactMessageById(req: HttpRequest): Promise<Object> {
    try {
      const { id } = req.params;
      const message = await ContactUsService.getContactMessageById(parseInt(id));
      if (message) {
        return {
          status: 200,
          body: { message }
        };
      } else {
        return {
          status: 404,
          body: { error: 'Contact message not found' }
        };
      }
    } catch (error) {
      return {
        status: 500,
        body: { error: error.message }
      };
    }
  }

  /**
   * Deletes a contact message by ID.
   * 
   * @param req - The HTTP request object containing contact message ID.
   * @returns Promise<HttpResponse> - A promise resolving to an HTTP response.
   * @description Handles the deletion of a contact message by ID by extracting the ID from the request parameters, invoking the ContactUsService to delete the message, and returning an HTTP response with appropriate status and JSON data.
   */
  static async deleteContactMessage(req: HttpRequest): Promise<object> {
    try {
      const { id } = req.params;
      const deleted = await ContactUsService.deleteContactMessage(parseInt(id));
      if (deleted) {
        return {
          status: 204,
          body: {}
        };
      } else {
        return {
          status: 404,
          body: { error: 'Contact message not found' }
        };
      }
    } catch (error) {
      return {
        status: 500,
        body: { error: error.message }
      };
    }
  }
}

export { ContactUsController };
