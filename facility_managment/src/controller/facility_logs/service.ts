import { CompanyLog } from '../../models/company_logs.model';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';
import { User } from '../../models/user.model';
import { sequelize } from '../../utils/database';
//import { sequelize } from '../utils/database';
import { Company } from '../../models/company.model';

class CompanyLogsService {

  /**
   * Creates a new company log.
   * 
   * @param logData - The details of the company log to create, including event, company_id, user_id, and facility_id.
   * @returns Promise<Response> - A promise resolving to a response indicating the success or failure of the log creation.
   * @description Saves a new company log entry in the database.
   */
  static async createCompanyLog(logData): Promise<Response> {
    try {
      const companyLog = await CompanyLog.create(logData, {
        fields: ['event', 'company_id', 'user_id', 'facility_id', 'created_by']
      });
      return { status: 201, message: RESPONSE_MESSAGES.Success};
    } catch (error) {
      throw new Error(`Failed to create company log: ${error.message}`);
    }
  }

  /**
   * Retrieves all company logs from the database.
   * 
   * @param offset - The offset for pagination.
   * @param limit - The limit for pagination.
   * @returns Promise<CompanyLog[]> - A promise resolving to an array of company logs.
   * @description Retrieves all company log entries from the database, optionally with pagination.
   */
  static async getAllCompanyLogs(offset: number, limit: number): Promise<CompanyLog[]> {
    try {
      return await CompanyLog.findAll({
        offset: offset,
        limit: limit,
      });
    } catch (error) {
      throw new Error(`Failed to fetch company logs: ${error.message}`);
    }
  }

  /**
   * Retrieves a company log by ID.
   * 
   * @param id - The ID of the company log to retrieve.
   * @returns Promise<CompanyLog | null> - A promise resolving to the company log if found, otherwise null.
   * @description Fetches a company log record from the database by its ID.
   */
  static async getCompanyLogByIdOld(company_id: number): Promise<CompanyLog[] | null> {
    try {
     // return await CompanyLog.findByPk(id);
    //  return await CompanyLog.findAll({
    //   where: { company_id }
    // });
    return await CompanyLog.findAll({
      where: { company_id },
      include: [
        {
          model: User,
          as: 'user', // Match the alias you defined in the association
          attributes: []
        },
      ],
      attributes: [
        "company_id", "event", "user_id", "createdAt",
        [sequelize.col('user.first_name'), 'event_by_first_name'], // Flatten first_name
        [sequelize.col('user.last_name'), 'event_by_last_name'],   // Flatten last_name
      ],
    });
    
    
    
    } catch (error) {
      throw new Error(`Failed to fetch company log by ID: ${error.message}`);
    }
  }

  static async getCompanyLogById(
    company_id: number,
    offset: number,
    limit: number
  ): Promise<{ rows: CompanyLog[], count: number } | null> {
    try {
      const result = await CompanyLog.findAndCountAll({
        where: { company_id },
        include: [
          {
            model: User,
            as: 'user', // Match the alias you defined in the association
            attributes: []
          },
          {
            model: Company,
            as: 'company', // Match the alias you defined in the association
            attributes: []
          },
        ],
        attributes: [
          "company_id", "event", "user_id", "createdAt",
          [sequelize.col('user.first_name'), 'event_by_first_name'], // Flatten first_name
          [sequelize.col('user.last_name'), 'event_by_last_name'],
          [sequelize.col('company.company_name'), 'company_name'],   // Flatten last_name
        ],
        offset,  // Pagination offset
        limit,   // Pagination limit
      });
  
      return {
        rows: result.rows,   // The result set of rows
        count: result.count, // The total number of rows matching the query
      };
    } catch (error) {
      throw new Error(`Failed to fetch company log by ID: ${error.message}`);
    }
  }

  static async getCompanyLogByUserId(
    user_id: number,
    offset: number,
    limit: number
  ): Promise<{ rows: CompanyLog[], count: number } | null> {
    try {
      const result = await CompanyLog.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: User,
            as: 'user', // Match the alias you defined in the association
            attributes: []
          },
          {
            model: Company,
            as: 'company', // Match the alias you defined in the association
            attributes: []
          },
        ],
        attributes: [
          "company_id", "event", "user_id", "createdAt",
          [sequelize.col('user.first_name'), 'event_by_first_name'], // Flatten first_name
          [sequelize.col('user.last_name'), 'event_by_last_name'],
          [sequelize.col('company.company_name'), 'company_name'],   // Flatten last_name
        ],
        offset,  // Pagination offset
        limit,   // Pagination limit
      });
  
      return {
        rows: result.rows,   // The result set of rows
        count: result.count, // The total number of rows matching the query
      };
    } catch (error) {
      throw new Error(`Failed to fetch company log by ID: ${error.message}`);
    }
  }
  

  /**
   * Updates an existing company log.
   * 
   * @param id - The ID of the company log to update.
   * @param updateData - The data to update in the company log.
   * @returns Promise<Response> - A promise resolving to a response indicating the success or failure of the update.
   * @description Updates a company log with new details in the database.
   */
  static async updateCompanyLog(id: number, updateData): Promise<Response> {
    try {
      const [updatedRows] = await CompanyLog.update(updateData, { where: { id } });
      if (updatedRows === 0) {
        throw new Error('No company log found to update');
      }
      return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
      throw new Error(`Failed to update company log: ${error.message}`);
    }
  }

  /**
   * Deletes a company log by ID.
   * 
   * @param id - The ID of the company log to delete.
   * @returns Promise<boolean> - A promise resolving to true if the deletion was successful, otherwise false.
   * @description Deletes a company log entry from the database by its ID.
   */
  static async deleteCompanyLog(id: number): Promise<boolean> {
    try {
      const rowsAffected = await CompanyLog.destroy({ where: { id } });
      return rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete company log: ${error.message}`);
    }
  }
}

export { CompanyLogsService };
