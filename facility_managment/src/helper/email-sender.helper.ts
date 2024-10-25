import { EmailClient } from "@azure/communication-email";
import path from "path";
//import {dotenv from 'dotenv';
import dotenv from "dotenv";
const envFilePath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envFilePath });

class Email {
  static async send(to: string, subject: string, body: string, cc?: string) {
    const connectionString =
      process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"];
    const client = new EmailClient(connectionString);
    const ccRecipients =
      cc && cc.length && cc.split(",").map((email) => email.trim());
    const emailMessage = {
      senderAddress: process.env["EMAIL_SENDER"],
      content: {
        subject: subject,
        html: body,
      },
      recipients: {
        to: [{ address: to }],
        cc:
          (ccRecipients &&
            ccRecipients.length &&
            ccRecipients.map((email) => ({ address: email }))) ||
          [],
      },
    };
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
  }
}
export { Email };
