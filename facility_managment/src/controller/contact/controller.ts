import { ContactService } from "./service";
import { IContactAttributes } from "../../interfaces/contact.interface";

export class ContactController {
  static async addContact(contactData: IContactAttributes, decodedToken: any): Promise<IContactAttributes> {
    return ContactService.addContact(contactData, decodedToken);
  }

  static async getContacts(facilityId: number, decodedToken: any): Promise<IContactAttributes[]> {
    return ContactService.getContacts(facilityId, decodedToken);
  }

  static async updateContact(id: number, facilityId: number, contactData: Partial<IContactAttributes>, decodedToken: any): Promise<IContactAttributes> {
    return ContactService.updateContact(id, facilityId, contactData, decodedToken);
  }

  static async deleteContact(id: number, facilityId: number, decodedToken: any): Promise<void> {
    return ContactService.deleteContact(id, facilityId, decodedToken);
  }
  static async getContactSuggestions(facilityId: number, query: string, limit: number, decodedToken: any): Promise<Partial<IContactAttributes>[]> {
    return ContactService.getContactSuggestions(facilityId, query, limit);
  }
}