import { json2csv } from 'json-2-csv';
import { uploadBlob } from './azure-storage.helper';
const fs = require('fs');

// Function to convert JSON data to CSV using json2csv
const jsonToCsv = async (jsonData: any[]): Promise<string> => {
    try {
        return json2csv(jsonData); // Convert JSON to CSV
    } catch (err) {
        throw new Error('Error converting JSON to CSV');
    }
};

// Function to convert data to CSV string
export const convertToCsv = async (data: any[]): Promise<string> => {
    try {
        // Convert JSON to CSV
        const csvData = await jsonToCsv(data);
        return csvData;
    } catch (err) {
        throw new Error('Error converting data to CSV');
    }
};
export const saveCsvToFile = async (data: any[], filename: string): Promise<string> => {
    try {
        // Convert data to CSV
        const csvData = await convertToCsv(data);

        // Write CSV data to a file
        const fileUrl = await uploadBlob(
            process.env?.Azure_Storage_AccountName as string,
            process.env?.Azure_Storage_AccountKey as string,
            `${filename}-facility-data-${new Date()}.csv`, 
            "username",
            Buffer.from(csvData)
        );

        return fileUrl;
    } catch (err) {
        throw new Error('Error saving CSV data to file');
    }
};