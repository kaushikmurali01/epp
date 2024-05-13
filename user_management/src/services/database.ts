import { QueryTypes, Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFilePath });
console.log(process.env.PGHOST);
console.log("Host", process.env.PGHOST);
// Initialize Sequelize with  database credentials
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || ''),
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD?.toString(),
});



// Test the database connection
async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

const rawQuery = async (query: string | { query: string; values: unknown[] }, replacements?: any) => {
  let transaction;
  try {
    // Start a transaction to acquire a connection
    transaction = await sequelize.transaction();
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT, // Adjust the query type as needed
      replacements,
      transaction,
    });
    // Commit the transaction to release the connection
    await transaction.commit();
    return results;
  } catch (error) {
    if (transaction) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
    }
    console.error('Error executing raw query:', error);
    throw error;
  }
};
export { sequelize, testDatabaseConnection, rawQuery };
