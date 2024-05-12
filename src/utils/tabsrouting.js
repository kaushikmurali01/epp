export const tabsData = (userType, userRole, permissions = []) => {
  let tabs = [];
  if (userType == 2 && userRole == "Super-Admin") {
    tabs = [
      {
        label:"Facility List",
        route:'/facility-list'
      },
      {
        label:"Participant Agreement",
        route:'/participant-agreement'
      },
      {
        label:"User Management",
        route:'/user-management'
      },
    ];
  }
  else if(userType == 1 && userRole == "Super-Admin"){
    tabs = [
      {
        label:"Companies",
        route:'/companies'
      },
      {
        label:"Facility List",
        route:'/facility-list'
      },
      {
        label:"Participant Agreement",
        route:'/participant-agreement'
      },
      {
        label:"User Management",
        route:'/user-management'
      },
      {
        label:"Client Management",
        route:'/client-management'
      },
      {
        label:"Report Management",
        route:'/report-management'
      },
      {
        label:"Program Management",
        route:'/program-management'
      },
      {
        label:"Roles and Permissions",
        route:'/roles-permissions-management'
      },
    ];
  }
  return tabs;
};
