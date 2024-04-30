import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { NewsController } from '../controllers/newsController';

/**
 * Creates a new news article based on the provided request data.
 * 
 * @param request The HTTP request object containing news data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing news creation status.
 */
export async function CreateNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Create news article
        const news = await NewsController.createNews(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(news);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Updates an existing news article based on the provided request data.
 * 
 * @param request The HTTP request object containing news data.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing news update status.
 */
export async function UpdateNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Parse request data
        const requestData = await request.json(); 

        // Update news article
        const news = await NewsController.updateNews(requestData);
       
        // Prepare response body
        const responseBody = JSON.stringify(news);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves all news articles.
 * 
 * @param request The HTTP request object.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing all news articles.
 */
export async function GetAllNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Get all news articles
        const news = await NewsController.getAllNews();
       
        // Prepare response body
        const responseBody = JSON.stringify(news);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

/**
 * Retrieves a news article by ID.
 * 
 * @param request The HTTP request object containing news ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response containing the news article with the specified ID.
 */
export async function GetNewsById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract news ID from request
        const { id } = request.params;

        // Get news article by ID
        const news = await NewsController.getNewsById(id);
       
        // Prepare response body
        const responseBody = JSON.stringify(news);

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `Error: ${error.message}` };
    }
}

/**
 * Deletes a news article by ID.
 * 
 * @param request The HTTP request object containing news ID.
 * @param context The invocation context of the Azure Function.
 * @returns A promise resolving to an HTTP response indicating the status of news deletion.
 */
export async function DeleteNews(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Extract news ID from request
        const newsId = request.params.id;

        // Delete news article by ID
        const deleted = await NewsController.deleteNews(newsId);
       
        // Prepare response body
        const responseBody = JSON.stringify({ deleted });

        // Return success response
        return { body: responseBody };
    } catch (error) {
        // Return error response
        return { status: 500, body: `${error.message}` };
    }
}

// HTTP trigger handlers
app.http('news', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'v1/news',
    handler: GetAllNews
});
// app.http('CreateNews', {
//     methods: ['POST'],
//     authLevel: 'anonymous',
//     handler: CreateNews
// });

// app.http('UpdateNews', {
//     methods: ['PUT'],
//     authLevel: 'anonymous',
//     handler: UpdateNews
// });



// app.http('GetNewsById', {
//     methods: ['GET'],
//     authLevel: 'anonymous',
//     route: 'news/{id}',
//     handler: GetNewsById
// });

// app.http('DeleteNews', {
//     methods: ['DELETE'],
//     authLevel: 'anonymous',
//     route: 'news/{id}',
//     handler: DeleteNews
// });
