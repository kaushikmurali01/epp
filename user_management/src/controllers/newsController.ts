import { HttpRequest, HttpResponse } from "@azure/functions";
import { NewsService } from '../services/newsService';

class NewsController {

  /**
   * Creates a new news article.
   * 
   * @param req - The HTTP request object containing news data.
   * @returns Promise<HttpResponse>
   * @description Handles the creation of a new news article by extracting necessary data from the request body, invoking the NewsService to create the news article, and returning an HTTP response with appropriate status and JSON data.
   */
  static async createNews(req): Promise<any> {
    try {
      const { title, description, image, created_by, updated_by } = req.body;
      const news = await NewsService.createNews({ title, description, image, created_by, updated_by });
      return news;
    } catch (error) {
      return {
        status: 500,
        body: { error: error.message }
      };
    }
  }

  /**
   * Updates an existing news article.
   * 
   * @param req - The HTTP request object containing news data.
   * @returns Promise<HttpResponse>
   * @description Handles the updating of an existing news article by extracting necessary data from the request body, invoking the NewsService to update the news article, and returning an HTTP response with appropriate status and JSON data.
   */
  static async updateNews(req): Promise<any> {
    try {
      const { id } = req.params;
      const { title, description, image, updated_by } = req.body;
      const updatedNews = await NewsService.updateNews(parseInt(id), { title, description, image, updated_by });
      if (updatedNews) {
        return {
          status: 200, // OK status code
          body: { news: updatedNews }
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'News article not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  /**
   * Retrieves all news articles.
   * 
   * @returns Promise<HttpResponse>
   * @description Handles the retrieval of all news articles by invoking the NewsService to fetch all news articles and returning an HTTP response with appropriate status and JSON data.
   */
  static async getAllNews(): Promise<any> {
    try {
      const news = await NewsService.getAllNews();
      return {
        status: 200, // OK status code
        body: { news }
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  /**
   * Retrieves a news article by ID.
   * 
   * @param req - The HTTP request object containing news ID.
   * @returns Promise<HttpResponse>
   * @description Handles the retrieval of a news article by ID by extracting the ID from the request parameters, invoking the NewsService to fetch the news article, and returning an HTTP response with appropriate status and JSON data.
   */
  static async getNewsById(req): Promise<Object> {
    try {
      const { id } = req.params;
      const news = await NewsService.getNewsById(parseInt(id));
      if (news) {
        return {
          status: 200, // OK status code
          body: { news }
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'News article not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }

  /**
   * Deletes a news article by ID.
   * 
   * @param req - The HTTP request object containing news ID.
   * @returns Promise<HttpResponse>
   * @description Handles the deletion of a news article by ID by extracting the ID from the request parameters, invoking the NewsService to delete the news article, and returning an HTTP response with appropriate status and JSON data.
   */
  static async deleteNews(req): Promise<Object> {
    try {
      const { id } = req.params;
      const deleted = await NewsService.deleteNews(parseInt(id));
      if (deleted) {
        return {
          status: 204, // No Content status code (successful deletion)
          body: {}
        };
      } else {
        return {
          status: 404, // Not Found status code
          body: { error: 'News article not found' }
        };
      }
    } catch (error) {
      return {
        status: 500, // Internal Server Error status code
        body: { error: error.message }
      };
    }
  }
}

export { NewsController };
