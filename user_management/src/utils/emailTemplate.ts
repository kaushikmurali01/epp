export class EmailTemplate {
    static async getContactUsTemplate(data) {
        return`<div class="container">
        <h4>New Contact Form Submission</h4>
        <p class="field">Name: ${data.name}</p>
        
        <p class="field">Company: ${data.company}</p>
        
        <p class="field">Email: ${data.email}</p>
        
        <p class="field">Phone: ${data.phone}</p>
        
        <p class="field">Message: ${data.message}</p>
        
    </div>
     `;
        
        
    }
    

    static async getLogo() {
        return '';
    }

    static async getEmailTemplate() {

      return `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>Enerva Mail</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
      
        <style>
          @media screen and (max-width: 599px) {
            table {
              display: block;
              width: 100% !important;
            }
          }
        </style>
      </head>
      
      <body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          ">
        <table style="
              width: 100%;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              background: #ffffff;
            ">
          <caption style="visibility: hidden"></caption>
          <th style="visibility: hidden"></th>
          <tr>
            <td style="padding: 0">
              <table style="
                    width: 600px;
                    margin: 0 auto;
                    border-collapse: collapse;
                    border: 1px solid #ece8e8;
                    border-spacing: 0;
                  ">
                <caption style="visibility: hidden"></caption>
                <th style="visibility: hidden"></th>
                <tr>
                  <td style="padding: 0;">
                    <table style="
                          width: 100%;
                          border-collapse: collapse;
                          border: 0;
                          border-spacing: 0;
                        ">
                      <caption style="visibility: hidden"></caption>
                      <th style="visibility: hidden"></th>
                      <tr style="background: #FFF;">
                        <td style="width: 1.5rem;"></td>
                        <td style="height: 2rem;"></td>
                        <td style="width: 1.5rem;"></td>
                      </tr>
                      <tr style="background: #FFF;">
                        <td style="width: 1.5rem;"></td>
                        <td>
                          <img src="https://eppdevstorage.blob.core.windows.net/assets/new_logo.png" alt="mailer-bg" class="mail-bg" style="display: block; max-width:100%" />
                        </td>
                        <td style="width: 1.5rem;"></td>
                      </tr>
                      <tr style="background: #FFF;">
                        <td style="width: 1.5rem;"></td>
                        <td style="height: 2rem;"></td>
                        <td style="width: 1.5rem;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
      
      
                <tr>
      
                  <td style="padding: 0;">
                    <table style="
                          width: 100%;
                          border-collapse: collapse;
                          border: 0;
                          border-spacing: 0;
                        ">
                      <caption style="visibility: hidden"></caption>
                      <th style="visibility: hidden"></th>
                      <tr style="
                          mask: radial-gradient(11.93px at 50% 16.5px,#000 99%,#0000 101%) calc(50% - 20px) 0/40px 100%,
                          radial-gradient(11.93px at 50% -6.5px,#0000 99%,#000 101%) 50% 10px/40px 100% repeat-x;">
                        <td style="width: 1.5rem; background: rgb(86, 178, 174, 0.2);"></td>
                        <td style="height: 2rem; background: rgb(86, 178, 174, 0.2);"></td>
                        <td style="width: 1.5rem; background: rgb(86, 178, 174, 0.2);"></td>
                      </tr>
                      <tr style="background: rgb(86, 178, 174, 0.2);">
                        <td style="width: 1.5rem;"></td>
                        <td>
                          <table style="
                                border-collapse: collapse;
                                border-spacing: 0;
                                border: transparent;
                              ">
                            <caption style="visibility: hidden"></caption>
                            <th style="visibility: hidden"></th>
                            <tr>
                              <td class="common-para subject-heading" style="
                                    color: #2E813E;
                                    font-size: 1.125rem;
                                    font-weight: 600;
                                  ">
                                #heading#
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 1.25rem"></td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                    color: #242424;
                                    font-size: 0.875rem;
                                    font-weight: 400;
                                  ">
                                Hello #name#,
                              </td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                    color: #242424;
                                    font-size: 0.875rem;
                                    font-weight: 400;
                                    line-height: normal;
                                  ">
                                #content#
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 1.25rem"></td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                    color: #5b5b5b;
                                    font-size: 0.75rem;
                                    font-weight: 400;
                                    text-transform: lowercase;
                                    display: #isDisplay#
                                  ">
                                  <a href="https://eppstgstorage.z14.web.core.windows.net/" target="_blank" style="
                                    border: transparent;
                                    padding: 0.5rem 0.75rem;
                                    border-radius: 0.25rem;
                                    background: #2E813E;
                                    text-decoration: none;
                                    color: #fff;
                                    font-size: 0.875rem;
                                    font-style: normal;
                                    font-weight: 400;
                                  ">View application</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 1.25rem"></td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                    color: #242424;
                                    font-size: 0.875rem;
                                    font-weight: 400;
                                  ">
                                If you believe you received this email in error, please contact Customer Service for
                                assistance.<br />
                                <!-- <a href="#"
                                  style="text-decoration: none; color: #2C77E9; font-size: 0.875rem; font-weight: 600; font-style: italic;">dummycontactsupport@enerva.com</a> -->
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 1.25rem"></td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                    color: #242424;
                                    font-size: 0.875rem;
                                    font-weight: 400;
                                  ">
                                Thank You,
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 1.25rem"></td>
                            </tr>
                            <tr>
                              <td>
                                <img src="https://eppdevstorage.blob.core.windows.net/assets/new_logo.png" alt="mailer-bg" class="mail-bg"
                                  style="display: block; max-width:17%" />
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 0.62rem"></td>
                            </tr>
                            <tr>
                              <td class="common-para" style="
                                                          color: #2E813E;
                                                          font-size: 0.875rem;
                                                          font-weight: 500;
                                                          font-style: italic;
                                                        ">
                                Energy Performance Program
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="width: 1.5rem;"></td>
                      </tr>
                      <tr>
                        <td style="width: 1.5rem; background: rgb(86, 178, 174, 0.2);"></td>
                        <td style="height: 2rem; background: rgb(86, 178, 174, 0.2);"></td>
                        <td style="width: 1.5rem; background: rgb(86, 178, 174, 0.2);"></td>
                      </tr>
                    </table>
                  </td>
      
                </tr>
      
              </table>
            </td>
          </tr>
        </table>
      </body>
      
      </html>`;
      
    }
}