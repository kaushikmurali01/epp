import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import path from 'path';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFilePath });

// Define your Azure Storage account name and key
const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;

// Create a StorageSharedKeyCredential object
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a BlobServiceClient object
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Define the name of the container where you want to upload the image
//const containerName = process.env.AGREEMENT_CONTAINER_NAME;

// Function to upload an image to Azure Blob Storage
 async function uploadFile(imagePath, blobName:string, containerName:string) {
  try {
    console.log("containerName",imagePath);
    console.log("accountName",accountName);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a new block blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the image
    const uploadBlobResponse = await blockBlobClient.uploadData(imagePath);

    console.log(`Image uploaded successfully. Blob URL: ${blockBlobClient.url}`);
  } catch (error) {
    console.error(`Error uploading image: ${error}`);
  }
}

export {uploadFile}


