export async function getEmailTemplate() {
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
                    <tr>
                      <td style="width: 1.5rem;"></td>
                      <td style="height: 2rem;"></td>
                      <td style="width: 1.5rem;"></td>
                    </tr>
                    <tr>
                      <td style="width: 1.5rem;"></td>
                        <td>
                          <img src="https://eppdevstorage.blob.core.windows.net/assets/new_logo.png" alt="mailer-bg" class="mail-bg" style="display: block; max-width:100%" />
                        </td>
                      <td style="width: 1.5rem;"></td>
                    </tr>
                    <tr>
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
                    <tr style="--mask: radial-gradient(11.93px at 50% 16.5px,#000 99%,#0000 101%) calc(50% - 20px) 0/40px 100%,
                        radial-gradient(11.93px at 50% -6.5px,#0000 99%,#000 101%) 50% 10px/40px 100% repeat-x;
                        -webkit-mask: var(--mask);
                        mask: var(--mask);">
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
                                  line-height: normal;
                                ">
                             #content#
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 1.25rem"></td>
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
                              assistance.<br/>
                              <br/>
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
                          <b style="font-weight: 600;">Customer Service Contact Information:</b><br/><br/>
                          Phone Number: <b style="font-weight: 600;">1-888-852-2440</b> <br/>
                          Email: <a href="#" style="text-decoration: none; color: #2C77E9; font-size: 0.875rem; font-weight: 700; font-style: italic;">info@energyperformanceprogram.ca</a>
                          <br/>
                          <br/>
                            <i style="opacity: 0.5; font-size: 12px;">Please do not reply to this message. This email address is not monitored so we are unable to respond to any messages
                          sent to this address.</i>
                            </td>
                            </tr>
                          <tr>
                          <td style="height: 1.25rem"></td>
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
