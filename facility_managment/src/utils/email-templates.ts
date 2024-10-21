export class EnergyEmailTemplate {
  static async getBaselineApprovalEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Energy Performance Program - Agreement Acknowledgment</title>

  <style>
    p {
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
          ">
  <table style="max-width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              margin: 0 auto;">
    <tr>
      <td>
        <table style="margin: 0 auto 20px;" width="80%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <p style="color: #2E813E; margin: 0; font-size: 14px; line-height: 1.5; text-transform: uppercase;">
                <strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">P</strong>erformance
                <strong style="font-size: 20px;">P</strong>rogram - <strong style="font-size: 20px;">B</strong>aseline      
                <strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">M</strong>odel
                <strong style="font-size: 20px;">R</strong>eview and
                <strong style="font-size: 20px;">A</strong>pproval
                <strong style="font-size: 20px;">R</strong>equest
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><strong>Facility Address: </strong> #facility_address#  </p>
              <p style="padding: 10px 0 0;"><strong>Unique Facility Identifier: </strong> #facility_identifier#</p>
              <p style="padding: 10px 0 0;"><strong>Legacy EPP Application ID: </strong> #legacy_epp_application_id#</p>

              <p style="padding: 10px 0 0;">The Facility Baseline Energy Model for the above Facility has now been finalized..</p>
              <p style="padding: 10px 0 0;">Please find attached the Baseline Energy Model (BEM).</p>
              <p style="padding: 10px 0 0;">Based on our technical review, we have successfully developed the attached Baseline Energy Model (BEM) for your review
              and approval. Upon receipt of your approval, you will receive a Notice of Approval enrolling the Facility into the
              Program.</p>
              <p style="padding: 10px 0 0;">Should you have any questions or concerns, please
                contact us at <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
                or 1-888-852-2440.</p>
              <p style="padding: 10px 0 0;">If you are not the designated contact for this Application or have received
                this e-mail in error, please advise.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><b>Best Regards,</b><br>
                <strong style="color: #666;">ENERVA ENERGY SOLUTIONS, INC. (service provider for EPP)</strong><br>
                <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <p style="color: #2E813E;"><strong>Save on Energy – Power What's Next</strong></p>
              <p style="color: #666;"><a href="https://SaveOnEnergy.ca" style="color: #666;">SaveOnEnergy.ca</a> |
                Energy Performance
                Program
                Support Line</p>
              <p style="color: #666;">Get the inside track on energy-efficiency by registering for our business <a
                  href="https://saveonenergy.ca/#businessnewsletter" style="color: #1E88E5;">
                  newsletter</a>.</p>
              <img src="https://eppstgstorage.blob.core.windows.net/agreement-docs/save-energy-delivery-partner.png" alt="mailer-bg" style="display: block; max-width:100%" />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 0px; font-size: 12px; color: #666;">
              <p>This e-mail message and any files transmitted with it are intended only for the named recipient(s) above and may contain
              information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the
              intended recipient(s), any dissemination, distribution or copying of this e-mail message or any files transmitted with
              it is strictly prohibited. If you have received this message in error, or are not the named recipient(s), please notify
              the sender immediately and delete this e-mail message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>

</html>`;
  }

  static async getNoticeOfApprovalEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Energy Performance Program</title>

  <style>
    h3{
      margin: 15px 0 5px 0;
    }
    p {
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
          ">
  <table style="max-width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              margin: 0 auto;">
    <tr>
      <td>
        <table style="margin: 0 auto 20px;" width="80%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <p style="color: #2E813E; margin: 0; font-size: 14px; line-height: 1.5; text-transform: uppercase;">
                <strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">P</strong>erformance
                <strong style="font-size: 20px;">P</strong>rogram - <strong style="font-size: 20px;">N</strong>otice of
                <strong style="font-size: 20px;">A</strong>pproval
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><strong>Date: </strong> #month# #day#, #year#</p>
              <p style="padding: 10px 0 0;">Dear #participant_first_name#,</p>

              <p style="padding: 10px 0 0;">We are pleased to inform you that your Application on behalf of #participant_on_behalf# has been approved for participation in the
              <i>Save on Energy – Energy Performance Program, 2021-2024</i> (EPP), offered by the Independent Electricity System Operator
              (IESO). Your EPP Participant Agreement (attached) is effective as of the date of this Notice of Approval.</p>
              <p style="padding: 10px 0 0;">Please be advised that any subsequent Facilities approved under the EPP will also be subject to your EPP Participant
              Agreement. Approval for any additional Facilities will need to be received by December 31, 2024 to be eligible.</p>
              <p style="padding: 10px 0 0;">Per Section 1(a) of your EPP Participant Agreement, #participant_on_behalf2# is entitled to receive the optional Pre-Project
              Incentive (listed in the table below) upon submission of an invoice to the IESO. If you would like to claim this
              incentive, please submit the invoice to: <a href="mailto:info@energyperformanceprogram.ca" style="color: #1E88E5;">info@energyperformanceprogram.ca</a> and kindly ensure that it references the
              Application ID, the Save on Energy - Energy Performance Program, and Pre-Project Incentive for the below-noted Facility.
              Additionally, if the organization is tax-exempt, please indicate such on the actual invoice as the IESO cannot process
              invoices that exclude tax from organizations without tax-exempt status. Please note that the Performance Incentives
              payable will be offset by Pre-Project Incentives paid and are limited to the Incentive Cap per Section 3(b).</p>
              <p style="padding: 10px 0 0;">
                The first Pay-for-Performance (P4P) Period starts on [#Month# #Day#, #Year#]. Per Section 2(e) of your EPP Participant
                Agreement, a Savings Submission is required to be submitted no later than 30 Business Days following the expiration of
                each annual P4P period. After submission, a Savings Report will be generated for your review and approval to proceed
                with a Performance Incentives payment for that period per Section 3(c) of your EPP Participant Agreement. Please take
                note of the annual Incentive Cap for each P4P Period listed in the table below.
              </p>
              <p style="padding: 10px 0 0;">A reminder that the Facility shall achieve a minimum of 5% Electricity Savings by the end of the second
              Pay-for-Performance period. Failure to achieve the Minimum Savings may result in elimination from the EPP as per Section
              2(d) of your EPP Participant Agreement.</p>
              <p style="padding: 10px 0 0;">Please review the details of your Application below and if you have any questions, please
                contact us at <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
                or 1-888-852-2440.</p>
              <p style="padding: 10px 0 0;">Capitalized terms used herein and not otherwise defined shall have the meaning given to them in your EPP Participant
              Agreement.</p>
            </td>
          </tr>
          <tr>
            <td>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li>
                  <h3>Facility Application Information</h3>
                  <ul>
                    <li>Unique Facility Identifier:
                    #facility_identifier#
                    </li>
                    <li>Legal Name of Applicant: #legal_name_of_applicant#.</li>
                    <li>Facility Type: #facility_type#</li>
                    <li>Facility Address: #facility_address#</li>
                  </ul>
                </li>
                <li>
                  <h3>Baseline Information</h3>
                  <ul>
                    <li>Baseline Periods:
                      <ul>
                        <li>Start: #baseline_start_date#</li>
                        <li>End: #baseline_end_date#</li>
                      </ul>
                    </li>
                    <li>Baseline Energy Consumption: #baseline_energy_consumption#</li>
                    <li>Baseline Energy Model: #baseline_energy_model#</li>
                  </ul>
                </li>
                <li>
                  <h3>Incentive Information</h3>
                  <ul>
                    <li>Pre-Project Incentive: #pre_project_incentive#</li>
                    <li>Annual Incentive Cap for Electricity Savings: #annual_incentive_cap_for_electricity_savings#</li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 30px 0 0;">We look forward to working with you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><b>Best Regards,</b><br>
                <strong style="color: #666;">ENERVA ENERGY SOLUTIONS, INC. (service provider for EPP)</strong><br>
                <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <p style="color: #2E813E;"><strong>Save on Energy – Power What's Next</strong></p>
              <p style="color: #666;"><a href="https://SaveOnEnergy.ca" style="color: #666;">SaveOnEnergy.ca</a> |
                Energy Performance
                Program
                Support Line</p>
              <p style="color: #666;">Get the inside track on energy-efficiency by registering for our business <a
                  href="https://saveonenergy.ca/#businessnewsletter" style="color: #1E88E5;">
                  newsletter</a>.</p>
              <img src="https://eppstgstorage.blob.core.windows.net/agreement-docs/save-energy-delivery-partner.png" alt="mailer-bg" style="display: block; max-width:100%" />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 0px; font-size: 12px; color: #666;">
              <p>This e-mail message and any files transmitted with it are intended only for the named recipient(s)
                above and may contain
                information that is privileged, confidential and/or exempt from disclosure under applicable law. If you
                are not the
                intended recipient(s), any dissemination, distribution or copying of this e-mail message or any files
                transmitted with
                it is strictly prohibited. If you have received this message in error, or are not the named
                recipient(s), please notify
                the sender immediately and delete this e-mail message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>

</html>`;
  }

  static async getSignedParticipantEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Energy Performance Program</title>

  <style>
    p{
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
          ">
  <table style="max-width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              margin: 0 auto;">
    <tr>
      <td>
        <table style="margin: 0 auto 20px;" width="80%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <p style="color: #2E813E; margin: 0; font-size: 14px; line-height: 1.5; text-transform: uppercase;"><strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">P</strong>erformance
                <strong style="font-size: 20px;">P</strong>rogram - <strong style="font-size: 20px;">S</strong>igned <strong style="font-size: 20px;">P</strong>articipant
                <strong style="font-size: 20px;">A</strong>greement
                <strong style="font-size: 20px;">A</strong>cknowledgment
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><strong>Legal Company Name:</strong> #company_name#</p>
              <p style="padding: 10px 0 0;">This email confirms that we have received the signed Participant Agreement for the company mentioned above. Welcome to
              the Energy Performance Program. EPP is an innovative technology-based incentive program incorporating Participant
              feedback to streamline processes, offer a simpler incentive structure, and the flexibility to generate energy savings
              any way you choose.</p>
              <p style="padding: 10px 0 0;">You can continue to add Facilities until December 31, 2024, via the EPP Portal. Each approved Facility will be covered
              under the same Participant Agreement.</p>
              <p style="padding: 10px 0 0;">To get the most from the EPP Portal, we suggest the following:</p>
              <ul style="margin-top: 0;">
                <li>Upload electricity data monthly or bi-weekly to track the energy consumption through the visualizations, access interim
                savings results, and receive insights to reduce energy use</li>
                <li>Add as many Facilities as you like to take advantage of comparison and benchmarking</li>
                <li>Add voluntary data to access added features of the EPP Portal</li>
                <li>Invite others to join the Portal or share your Facilities with the other users</li>
                <li>Check into the EPP Portal as new features and functions will be added frequently</li>
              </ul>
              <p style="padding: 10px 0 0;">If you have any questions or need assistance during this time, please contact us at <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
                or 1-888-852-2440.</p>
              <p style="padding: 10px 0 0;">If you are not the designated contact for this Application or have received this e-mail in error, please advise.</p>
            </td>
          </tr>
          <tr >
            <td>
              <p style="padding: 10px 0 0;"><b>Best Regards,</b><br>
                <strong style="color: #666;">ENERVA ENERGY SOLUTIONS, INC. (service provider for EPP)</strong><br>
                <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <p style="color: #2E813E;"><strong>Save on Energy – Power What's Next</strong></p>
              <p style="color: #666;"><a href="https://SaveOnEnergy.ca" style="color: #666;">SaveOnEnergy.ca</a> | Energy Performance
                Program
                Support Line</p>
              <p style="color: #666;">Get the inside track on energy-efficiency by registering for our business <a href="https://saveonenergy.ca/#businessnewsletter"
                  style="color: #666;">
                  newsletter</a>.</p>
                  <img src="https://eppstgstorage.blob.core.windows.net/agreement-docs/save-energy-delivery-partner.png" alt="mailer-bg" style="display: block; max-width:100%" />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 0px; font-size: 12px; color: #666;">
              <p>This e-mail message and any files transmitted with it are intended only for the named recipient(s) above and may contain
              information that is privileged, confidential and/or exempt from disclosure under applicable law. If you are not the
              intended recipient(s), any dissemination, distribution or copying of this e-mail message or any files transmitted with
              it is strictly prohibited. If you have received this message in error, or are not the named recipient(s), please notify
              the sender immediately and delete this e-mail message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>

</html>`;
  }

  static async getApplicationAcknowledgementEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Energy Performance Program</title>

  <style>
    p {
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
          ">
  <table style="max-width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              margin: 0 auto;">
    <tr>
      <td>
        <table style="margin: 0 auto 20px;" width="80%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <p style="color: #2E813E; margin: 0; font-size: 14px; line-height: 1.5; text-transform: uppercase;">
                <strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">P</strong>erformance
                <strong style="font-size: 20px;">P</strong>rogram - <strong style="font-size: 20px;">A</strong>pplication
                <strong style="font-size: 20px;">A</strong>cknowledgment
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><strong>Facility Address: </strong> #facility_address#</p>
              <p style="padding: 10px 0 0;"><strong>Unique Facility Identifier: </strong> #facility_identifier#</p>

              <p style="padding: 10px 0 0;">This email confirms receipt of your complete Application. We will review the Application with the Program's requirements
              and verify the Eligibility Criteria. If more information is required, we will contact you; otherwise, the Notice of
              Approval will be sent to you within five business days.</p>
              
              <p style="padding: 10px 0 0;">If you have any questions or concerns, please
                contact us at <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
                or 1-888-852-2440.</p>
              <p style="padding: 10px 0 0;">If you are not the designated contact for this Application or have received
                this e-mail in error, please advise.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><b>Best Regards,</b><br>
                <strong style="color: #666;">ENERVA ENERGY SOLUTIONS, INC. (service provider for EPP)</strong><br>
                <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <p style="color: #2E813E;"><strong>Save on Energy – Power What's Next</strong></p>
              <p style="color: #666;"><a href="https://SaveOnEnergy.ca" style="color: #666;">SaveOnEnergy.ca</a> |
                Energy Performance
                Program
                Support Line</p>
              <p style="color: #666;">Get the inside track on energy-efficiency by registering for our business <a
                  href="https://saveonenergy.ca/#businessnewsletter" style="color: #666;">
                  newsletter</a>.</p>
              <img src="https://eppstgstorage.blob.core.windows.net/agreement-docs/save-energy-delivery-partner.png"
                alt="mailer-bg" style="display: block; max-width:100%" />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 0px; font-size: 12px; color: #666;">
              <p>This e-mail message and any files transmitted with it are intended only for the named recipient(s)
                above and may contain
                information that is privileged, confidential and/or exempt from disclosure under applicable law. If you
                are not the
                intended recipient(s), any dissemination, distribution or copying of this e-mail message or any files
                transmitted with
                it is strictly prohibited. If you have received this message in error, or are not the named
                recipient(s), please notify
                the sender immediately and delete this e-mail message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>

</html>`;
  }

  static async getFirstSavingsReportCompleteEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Energy Performance Program</title>

  <style>
    p {
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body style="
            font-family: Asap, sans-serif;
            font-style: normal;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
          ">
  <table style="max-width: 600px;
              border-collapse: collapse;
              border: 0;
              border-spacing: 0;
              margin: 0 auto;">
    <tr>
      <td>
        <table style="margin: 0 auto 20px;" width="80%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <p style="color: #2E813E; margin: 0; font-size: 14px; line-height: 1.5; text-transform: uppercase;">
                <strong style="font-size: 20px;">E</strong>nergy
                <strong style="font-size: 20px;">P</strong>erformance
                <strong style="font-size: 20px;">P</strong>rogram - <strong style="font-size: 20px;">F</strong>irst
                <strong style="font-size: 20px;">S</strong>avings
                <strong style="font-size: 20px;">R</strong>eport
                <strong style="font-size: 20px;">C</strong>omplete
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #2E813E; height: 2.5px;"></td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><strong>Facility Address: </strong> #facility_address#</p>
              <p style="padding: 10px 0 0;"><strong>Unique Facility Identifier: </strong> #facility_identifier#</p>

              <p style="padding: 10px 0 0;">The 1st Savings Report for the above Application is now complete.</p>
              <p style="padding: 10px 0 0;">Based on our technical review, we have verified the following savings and
                the associated Performance Incentives.</p>
              <p style="padding: 10px 0 0;">Please allow 8-12 weeks to receive payment.</p>
              <p style="padding: 10px 0 0;">According to the assessment, the Facility achieved the Minimum Savings
                target or is on track to achieve
                it.</p>

              <ul>
                <li>Electricity Savings
                  <ul>
                    <li>Submitted Values
                      <ul>
                        <li>On-Peak Electricity Savings: #onpeak_electricity_saving_submitted# (kWh) </li>
                        <li>Off-Peak Electricity Savings: #offpeak_electricity_saving_submitted# (kWh)</li>
                      </ul>
                    </li>
                    <li>Approved Values
                      <ul>
                        <li>On-Peak Electricity Savings: #onpeak_electricity_saving_approved# (kWh)</li>
                        <li>Off-Peak Electricity Savings: #offpeak_electricity_saving_approved# (kWh)</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>Reason for Discrepancy (if any)
                  <ul>
                    <li>1. The missing data from the period of #missing_data_removed_from# to #missing_data_removed_to# has been removed from the
                      Pay-for-Performance Period.</li>
                  </ul>
                </li>
                <li>Performance Incentives as per Approved Values
                  <ul>
                    <li>Paid Pre-Project Incentive: #paid_pre_project_incentive#</li>
                    <li>On-Peak Electricity Savings Incentive: #on_peak_electricity_savings_incentive#</li>
                    <li>Off-Peak Electricity Savings Incentive: #off_peak_electricity_savings_incentive#</li>
                    <li>Total Performance Incentive, less Pre-Project Incentive: #total_performance_incentive#</li>
                  </ul>
                </li>
              </ul>

              <p style="padding: 10px 0 0;">Should you have any questions or concerns, please
                contact us at <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
                or 1-888-852-2440.</p>
              <p style="padding: 10px 0 0;">If you are not the designated contact for this Application or have received
                this e-mail in error, please advise.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 10px 0 0;"><b>Best Regards,</b><br>
                <strong style="color: #666;">ENERVA ENERGY SOLUTIONS, INC. (service provider for EPP)</strong><br>
                <a href="mailto:info@energyperformanceprogram.ca"
                  style="color: #1E88E5;">info@energyperformanceprogram.ca</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <p style="color: #2E813E;"><strong>Save on Energy – Power What's Next</strong></p>
              <p style="color: #666;"><a href="https://SaveOnEnergy.ca" style="color: #666;">SaveOnEnergy.ca</a> |
                Energy Performance
                Program
                Support Line</p>
              <p style="color: #666;">Get the inside track on energy-efficiency by registering for our business <a
                  href="https://saveonenergy.ca/#businessnewsletter" style="color: #666;">
                  newsletter</a>.</p>
              <img src="https://eppstgstorage.blob.core.windows.net/agreement-docs/save-energy-delivery-partner.png"
                alt="mailer-bg" style="display: block; max-width:100%" />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 0px; font-size: 12px; color: #666;">
              <p>This e-mail message and any files transmitted with it are intended only for the named recipient(s)
                above and may contain
                information that is privileged, confidential and/or exempt from disclosure under applicable law. If you
                are not the
                intended recipient(s), any dissemination, distribution or copying of this e-mail message or any files
                transmitted with
                it is strictly prohibited. If you have received this message in error, or are not the named
                recipient(s), please notify
                the sender immediately and delete this e-mail message.</p>
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
