import { EmailTemplate } from "../../models/emailTemplate.model";
import { IEmailTemplateAttributes } from "../../interfaces/emailTemplate.interface";

export class EmailTemplateController {
  static async createEmailTemplate(
    data: Partial<IEmailTemplateAttributes>,
    userId: number
  ): Promise<IEmailTemplateAttributes> {
    const emailTemplate = await EmailTemplate.create({
      ...data,
      created_by: userId,
    });
    return emailTemplate.toJSON();
  }

  static async updateEmailTemplate(
    id: number,
    data: Partial<IEmailTemplateAttributes>,
    userId: number
  ): Promise<IEmailTemplateAttributes | null> {
    const [updated] = await EmailTemplate.update(
      {
        ...data,
        updated_by: userId,
        updated_at: new Date(),
      },
      { where: { id } }
    );
    if (updated) {
      const updatedTemplate = await EmailTemplate.findByPk(id);
      return updatedTemplate?.toJSON() || null;
    }
    return null;
  }

  static async deleteEmailTemplate(id: number): Promise<boolean> {
    const deleted = await EmailTemplate.destroy({ where: { id } });
    return deleted > 0;
  }

  static async getEmailTemplatesByFacilityId(
    facilityId: number
  ): Promise<IEmailTemplateAttributes[]> {
    const templates = await EmailTemplate.findAll({
      where: { facility_id: facilityId },
    });
    return templates.map((template) => template.toJSON());
  }

  static async getEmailTemplatesSubjectAndBody(
    facilityId: number
  ): Promise<Pick<IEmailTemplateAttributes, "subject" | "body">[]> {
    const templates = await EmailTemplate.findAll({
      attributes: ["subject", "body"],
      where: { facility_id: facilityId },
    });
    return templates.map((template) => ({
      subject: template.subject,
      body: template.body,
    }));
  }
}