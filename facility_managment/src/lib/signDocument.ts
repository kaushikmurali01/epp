import { PDFDocument } from 'pdf-lib';
import { BlobServiceClient, AnonymousCredential, StorageSharedKeyCredential } from '@azure/storage-blob';

export async function createSignedPDF(originalPdfBlobUrl: string, signatureImageBlobUrl: string): Promise<Uint8Array> {

    const blobServiceClient = getBlobServiceClient(process.env?.Azure_Storage_AccountName,
      process.env?.Azure_Storage_AccountKey);


    // Get references to the blobs
    const originalPdfBlob = await downloadBlob(blobServiceClient, originalPdfBlobUrl);
    // console.log(originalPdfBlob, "originalPdfBlob");
    
    const signatureImageBlob = await downloadBlob(blobServiceClient, signatureImageBlobUrl);
    // console.log(signatureImageBlob, "signatureImageBlob");
    

    // Load the original PDF
    const originalPdfDoc = await PDFDocument.load(originalPdfBlob);
    // console.log(originalPdfDoc,"originalPdfDoc");
    

    // Embed the signature image
    const signatureImage = await originalPdfDoc.embedPng(signatureImageBlob);

    // Create a new PDF document
    const signedPdfDoc = await PDFDocument.create();
    // console.log(signedPdfDoc,"signedPdfDoc");
    

    // Copy pages from the original PDF to the new PDF
    const pages = await signedPdfDoc.copyPages(originalPdfDoc, [...Array(originalPdfDoc.getPageCount()).keys()]);
    pages.forEach(page => signedPdfDoc.addPage(page));

    // Add the signature image to the last page
    const lastPage = signedPdfDoc.getPage(signedPdfDoc.getPageCount() - 1);
    const { width, height } = lastPage.getSize();
    lastPage.drawImage(signatureImage, {
        x: 50,
        y: 50,
        width: signatureImage.width,
        height: signatureImage.height,
    });

    
    
    // Return the modified PDF as bytes
    return signedPdfDoc.save();
}

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

