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
    <br/>
    <b>#facilityName#</b> from <b>#companyName#</b> has been submitted to the Energy Performance Program for baseline energy modelling. A program representative will be in touch within a few days to discuss the baseline energy model with you, as well as any other questions about program eligibility. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>`,
    title:
      "Facility Submitted for Baseline Energy Modelling for Energy Performance Program",
  },

  facilityCreatedForAdmin: {
    content: `Hello <b> #adminName# from ENERVA </b>,
    <br/>
    <br/>
    <b>#facilityName#</b> from <b>#companyName#</b> has been submitted to the Energy Performance Program for baseline energy modelling. A program representative will be in touch within a few days to discuss the baseline energy model with you, as well as any other questions about program eligibility. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>`,
    title: `Facility Submitted for Baseline Energy Modelling for Energy Performance Program.`,
  },

  paCreatedForCompany: {
    content: `Hello <b>#userName#</b>,
    <br/>
    <br/>
    The Participant Agreement #version# from <b>#companyName#</b> has been executed by <b>#bindingAuthority#</b>. Please note that all facilities enrolled in the Energy Performance Program will be covered under this Participant Agreement. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>`,
    title:
      "Participant Agreement Executed for Energy Performance Program",
  },

   paCreatedForAdmin: {
    content: `Hello <b> #adminName# from ENERVA </b>,
    <br/>
    <br/>
    The Participant Agreement #version# from <b>#companyName#</b> has been executed by <b>#bindingAuthority#</b>. Please note that all facilities enrolled in the Energy Performance Program will be covered under this Participant Agreement. Thank you for your interest and participation in the Energy Performance Program. 
    <br/>`,
    
    title: `Participant Agreement Executed for Energy Performance Program`,
  },
};

export const adminDetails = {
  adminName: "Mayuran Srikantha",
  adminEmail: "mayurans@enerva.ca",
};
