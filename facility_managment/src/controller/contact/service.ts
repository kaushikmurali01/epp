import { Contact } from "../../models/contact.model";
import { IContactAttributes } from "../../interfaces/contact.interface";
import { Op } from 'sequelize';

export class ContactService {
  private static validateRequiredFields(contactData: Partial<IContactAttributes>): void {
    const requiredFields = [
      'name',
      'facility_id',
      'company_name',
      'email',
      'role',
      'phone',
      'street_number',
      'street_name',
      'city',
      'province',
      'country',
      'postal_code'
    ];

    const missingFields = requiredFields.filter(field => !contactData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      throw new Error('Invalid email format');
    }
  }

  static async addContact(contactData: IContactAttributes, decodedToken: any): Promise<IContactAttributes> {
    try {
      this.validateRequiredFields(contactData);

      const newContact = await Contact.create({
        ...contactData,
        created_by: decodedToken.id,
      });
      return newContact.toJSON();
    } catch (error) {
      throw new Error(`Failed to add contact: ${error.message}`);
    }
  }

  static async getContacts(facilityId: number, decodedToken: any): Promise<IContactAttributes[]> {
    try {
      const contacts = await Contact.findAll({
        where: { facility_id: facilityId },
        order: [['created_at', 'DESC']],
      });
      return contacts.map(contact => contact.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }
  }

  static async updateContact(id: number, facilityId: number, contactData: Partial<IContactAttributes>, decodedToken: any): Promise<IContactAttributes> {
    try {
      const contact = await Contact.findOne({ where: { id, facility_id: facilityId } });
      if (!contact) {
        throw new Error("Contact not found");
      }

      // Validate only the fields that are being updated
      const fieldsToValidate = { ...contact.toJSON(), ...contactData };
      this.validateRequiredFields(fieldsToValidate);

      await contact.update({
        ...contactData,
        updated_by: decodedToken.id,
      });
      return contact.toJSON();
    } catch (error) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }

  static async deleteContact(id: number, facilityId: number, decodedToken: any): Promise<void> {
    try {
      const contact = await Contact.findOne({ where: { id, facility_id: facilityId } });
      if (!contact) {
        throw new Error("Contact not found");
      }
      await contact.destroy();
    } catch (error) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }
  static async getContactSuggestions(facilityId: number, query: string, limit: number = 10): Promise<Partial<IContactAttributes>[]> {
    try {
      const contacts = await Contact.findAll({
        where: {
          facility_id: facilityId,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
            { company_name: { [Op.iLike]: `%${query}%` } }
          ]
        },
        attributes: ['id', 'name', 'email', 'company_name', 'role'],
        limit: limit,
        order: [['name', 'ASC']]
      });

      return contacts.map(contact => contact.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch contact suggestions: ${error.message}`);
    }
  }
}