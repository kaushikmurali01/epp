import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFilePath });
console.log(process.env.PGHOST);
console.log("Host",process.env.PGHOST);
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

export { sequelize, testDatabaseConnection };
