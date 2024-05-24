import { HTTP_STATUS_CODES } from "../utils/status";
import { uploadBlob } from "./azure-storage.helper";
import { createSignedPDF } from "./signDocument.helper";
const fs = require('fs');

export async function creatSignDocumentUrlForUser(originalPdfPath:string, signatureImagePath:string, username:string, userrole:string): Promise<any> {
    try {
      // const originalPdfPath = "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf"
      // const signatureImagePath = "https://eppdevstorage.blob.core.windows.net/agreement-docs/img"

      console.log(originalPdfPath, signatureImagePath, username, "PPPPPP");
      
      const result = await createSignedPDF(originalPdfPath, signatureImagePath, username, userrole)
      .then(async modifiedPdfBytes => {
        // Once you have the modified PDF bytes, write them to a file
        // fs.writeFile(`${username}-signed_document-${new Date()}.pdf`, Buffer.from(modifiedPdfBytes), async (err) => {
        //   if (err) {
        //     console.error('Error saving signed PDF:', err);
        //     return;
        //   }
          const fileUrl = await uploadBlob(
            process.env?.Azure_Storage_AccountName as string,
            process.env?.Azure_Storage_AccountKey as string,
            `${username}-signed_document-${new Date()}.pdf`,
            "username",
            Buffer.from(modifiedPdfBytes)
          );

          console.log(fileUrl);
          

          console.log('Signed PDF saved successfully as signed_document.pdf');
          console.log('Please manually download the signed document from the file system.');
        // });

        return fileUrl;
      })
      .catch(error => {
        console.error('Error creating signed PDF:', error);
      });
      
      // const result = await AdminFacilityService.getDashboardStats(Object(decodedToken));
      return result
    } catch (error) {
      this.errorMessage = {
        message: error,
        statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      };
      throw this.errorMessage;
    }
  };