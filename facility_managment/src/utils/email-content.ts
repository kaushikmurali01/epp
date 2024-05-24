export const EmailContent = {
  invitationEmailForExistingUser: {
    content: `You have been invited to join #company# by #admin#.
         <br/>
       To accept this invitation, please click this link.`,
    title: "User Invitation to Energy Performance Program",
  },
  invitationEmailForAdmins: {
    content: `#user# has been invited to join #company# by #admin.`,
    title: "User Invitation Sent for Energy Performance Program Portal",
  },
  invitationEmailForNewUser: {
    content: "Your are invited to join company",
    title: "Invited to join company",
  },
  alertEmail: {
    title: "Alert from admin",
  },

  facilityCreatedForUser: {
    content: `Hello <b> #userName# </b>,
    <br/>
    <b>#facilityName#</b> from <b>#companyName#</b> has been submitted to the Energy Performance Program for baseline energy modelling. A program representative will be in touch within a few days to discuss the baseline energy model with you, as well as any other questions about program eligibility. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>
    If you believe you received this email in error, please contact Customer Service for assistance.
    <br/>
    <br/>
    Thank You,
    <br/>
    Energy Performance Program`,
    title:
      "Facility Submitted for Baseline Energy Modelling for Energy Performance Program",
  },

  facilityCreatedForAdmin: {
    content: `Hello <b> #adminName# from ENERVA </b>,
    <br/>
    <b>#facilityName#</b> from <b>#companyName#</b> has been submitted to the Energy Performance Program <b>#userName#</b> , for baseline energy modelling. A program representative will be in touch within a few days to discuss the baseline energy model with you, as well as any other questions about program eligibility. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>
    If you believe you received this email in error, please contact Customer Service for assistance.
    <br/>
    <br/>
    Thank You,
    <br/>
    Energy Performance Program`,
    title: `New Facility Submitted for Baseline Energy Modelling for Energy Performance Program.`,
  },

  paCreatedForCompany: {
    content: `Hello <b>#userName#</b>,

    The Participant Agreement #version#>  from <b>#companyName#</b> has been executed by <b>#bindingAuthority#</b>. Please note that all facilities enrolled in the Energy Performance Program will be covered under this Participant Agreement. Thank you for your interest and participation in the Energy Performance Program. 
    
    If you believe you received this email in error, please contact Customer Service for assistance.
    
    The phone number is 1-888-852-2440 and the email is info@energyperformanceprogram.ca.
    
    Please do not reply to this message. This email address is not monitored so we are unable to respond to any messages sent to this address.
    
    Thank You,
    
    Energy Performance Program`,
    title:
      "Participant Agreement Executed for Energy Performance Program",
  },

   paCreatedForAdmin: {
    content: `Hello <b> #adminName# from ENERVA </b>,

    The Participant Agreement #version#>  from <b>#companyName#</b> has been executed by <b>#bindingAuthority#</b> by <b>#userName#</b> . Please note that all facilities enrolled in the Energy Performance Program will be covered under this Participant Agreement. Thank you for your interest and participation in the Energy Performance Program. 
    
    If you believe you received this email in error, please contact Customer Service for assistance.
    
    The phone number is 1-888-852-2440 and the email is info@energyperformanceprogram.ca.
    
    Please do not reply to this message. This email address is not monitored so we are unable to respond to any messages sent to this address.
    
    Thank You,
    
    Energy Performance Program`,
    title: `New Participant Agreement Executed for Energy Performance Program`,
  },
};

export const adminDetails = {
  adminName: "Mayuran Srikantha",
  adminEmail: "mayurans@enerva.ca",
};
