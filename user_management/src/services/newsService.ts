import { News } from '../models/news';
import { Response } from 'enerva-utils/interfaces/response';
import { HTTP_STATUS_CODES, RESPONSE_MESSAGES } from 'enerva-utils/utils/status';

class NewsService {

  /**
   * Creates a new news article with provided details.
   * 
   * @param newsDetails - Object containing news details such as title, description, image, created_by, and updated_by.
   * @returns Promise<Response> - A promise resolving to a response indicating the status of news creation.
   * @description Creates a new news article by adding a news record in the database with specified details. Returns a response indicating the success or failure of the creation process.
   */
  static async createNews(newsDetails): Promise<Response> {
    try {
      const news = await News.create(newsDetails, { fields: ['title', 'description', 'image', 'created_by', 'updated_by'] });
      return { status: HTTP_STATUS_CODES.SUCCESS, message: RESPONSE_MESSAGES.Success };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Updates an existing news article with provided details.
   * 
   * @param id - The ID of the news article to be updated.
   * @param newsDetails - Object containing news details to be updated.
   * @returns Promise<News | null> - A promise resolving to the updated news article if successful, otherwise null.
   * @description Updates an existing news record in the database with specified details.
   */
  static async updateNews(id: number, newsDetails: Object): Promise<News | null> {
    try {
      const [rowsAffected, updatedNews] = await News.update(newsDetails, {
        where: { id },
        returning: true,
      });
      if (rowsAffected === 0) return null;
      return updatedNews[0];
    } catch (error) {
      throw new Error(`Failed to update news article: ${error.message}`);
    }
  }

  /**
   * Retrieves all news articles from the database.
   * 
   * @returns Promise<News[]> - A promise resolving to an array of all news articles.
   * @description Retrieves all news records from the database.
   */
  static async getAllNews(): Promise<News[]> {
    try {
      return await News.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch news articles: ${error.message}`);
    }
  }

  /**
   * Retrieves a news article by ID from the database.
   * 
   * @param id - The ID of the news article to retrieve.
   * @returns Promise<News | null> - A promise resolving to the news article if found, otherwise null.
   * @description Retrieves a news record from the database by its ID.
   */
  static async getNewsById(id: number): Promise<News | null> {
    try {
      return await News.findByPk(id);
    } catch (error) {
      throw new Error(`Failed to fetch news article: ${error.message}`);
    }
  }

  /**
   * Deletes a news article from the database by ID.
   * 
   * @param id - The ID of the news article to delete.
   * @returns Promise<boolean> - A promise resolving to true if deletion is successful, otherwise false.
   * @description Deletes a news record from the database by its ID.
   */
  static async deleteNews(id: number): Promise<boolean> {
    try {
      const rowsAffected = await News.destroy({ where: { id } });
      return rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete news article: ${error.message}`);
    }
  }
}

export { NewsService };
