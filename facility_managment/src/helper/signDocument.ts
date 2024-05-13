import { PDFDocument, rgb } from 'pdf-lib';
import { BlobServiceClient, AnonymousCredential, StorageSharedKeyCredential } from '@azure/storage-blob';



export async function createSignedPDF(originalPdfBlobUrl: string, signatureImageBlobUrl: string, username: string, userrole: string): Promise<Uint8Array> {
    // Fetch the original PDF blob and the signature image blob
    const originalPdfBlob = await fetch(originalPdfBlobUrl).then(res => res.arrayBuffer());
    const signatureImageBlob = await fetch(signatureImageBlobUrl).then(res => res.arrayBuffer());

    // Load the original PDF
    const originalPdfDoc = await PDFDocument.load(originalPdfBlob);

    // Embed the signature image
    const signatureImage = await originalPdfDoc.embedPng(signatureImageBlob);

    // Get the last page of the original PDF
    const lastPage = originalPdfDoc.getPages()[originalPdfDoc.getPageCount() - 1];

    // Calculate the dimensions of the signature image
    const signatureImageWidth = 140; // Adjust according to your requirement
    const signatureImageHeight = 50; // Adjust according to your requirement

     // Add the username text at the left bottom
    lastPage.drawText(username, {
        x: 60, // Adjust the x coordinate as needed
        y: 40, // Adjust the y coordinate as needed
        size: 12, // Adjust the font size as needed
        color: rgb(0, 0, 0), // Black color
    });
    lastPage.drawText(userrole, {
        x: 60, // Adjust the x coordinate as needed
        y: 25, // Adjust the y coordinate as needed
        size: 10, // Adjust the font size as needed
        color: rgb(0, 0, 0), // Black color
    });

    // Add the signature image to the last page, positioned at the right bottom
    lastPage.drawImage(signatureImage, {
        x: lastPage.getWidth() - signatureImageWidth - 50, // Adjust the x coordinate as needed
        y: 0, // Adjust the y coordinate as needed
        width: signatureImageWidth,
        height: signatureImageHeight,
    });

   

    // Serialize the PDF document
    const modifiedPdfBytes = await originalPdfDoc.save();

    // Return the modified PDF as bytes
    return modifiedPdfBytes;
}



    
    
    // Return the modified PDF as bytes
    // return signedPdfDoc.save();
// }

async function downloadBlob(blobServiceClient: BlobServiceClient, blobUrl: string): Promise<Uint8Array> {
    const containerName = getContainerNameFromUrl(blobUrl);
    const blobName = getBlobNameFromUrl(blobUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadResponse = await blobClient.download();
    const blobContents = await streamToBuffer(downloadResponse.readableStreamBody);
    return blobContents;
}

function getContainerNameFromUrl(blobUrl: string): string {
    // Parse the container name from the blob URL
    // You may need to adjust this based on your blob storage URL format
    return blobUrl.split('/')[3];
}

function getBlobNameFromUrl(blobUrl: string): string {
    // Parse the blob name from the blob URL
    // You may need to adjust this based on your blob storage URL format
    return blobUrl.split('/').slice(4).join('/');
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Uint8Array> {
    const chunks: Uint8Array[] = [];
    return new Promise<Uint8Array>((resolve, reject) => {
        readableStream.on('data', (data: Uint8Array) => chunks.push(data));
        readableStream.on('end', () => resolve(Buffer.concat(chunks)));
        readableStream.on('error', reject);
    });
}

function getBlobServiceClient(serviceName, serviceKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    serviceName,
    serviceKey
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${serviceName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  return blobServiceClient;
}

