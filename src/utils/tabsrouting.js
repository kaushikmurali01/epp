//permission list for developer reference
// [
//   {
//       "id": 1,
//       "permission": "add-user",
//       "permission_type": "user"
//   },
//   {
//       "id": 2,
//       "permission": "grant-revoke-access",
//       "permission_type": "user"
//   },
//   {
//       "id": 3,
//       "permission": "edit-profile",
//       "permission_type": "user"
//   },
//   {
//       "id": 4,
//       "permission": "bind-company",
//       "permission_type": "company"
//   },
//   {
//       "id": 9,
//       "permission": "baseline-energy-modelling",
//       "permission_type": "energy"
//   },
//   {
//       "id": 10,
//       "permission": "energy-savings-calculations",
//       "permission_type": "energy"
//   },
//   {
//       "id": 11,
//       "permission": "view-incentive-payment",
//       "permission_type": "finance"
//   },
//   {
//       "id": 12,
//       "permission": "view-insitu-benchmarking",
//       "permission_type": "benchmarking"
//   },
//   {
//       "id": 13,
//       "permission": "energy-start-benchmarking",
//       "permission_type": "benchmarking"
//   },
//   {
//       "id": 14,
//       "permission": "ewrb-report",
//       "permission_type": "report"
//   },
//   {
//       "id": 15,
//       "permission": "green-button",
//       "permission_type": "integration"
//   },
//   {
//       "id": 16,
//       "permission": "financial-details",
//       "permission_type": "finance"
//   },
//   {
//       "id": 5,
//       "permission": "account-data-visualizations",
//       "permission_type": "account"
//   },
//   {
//       "id": 6,
//       "permission": "facility",
//       "permission_type": "facility"
//   },
//   {
//       "id": 7,
//       "permission": "facility-data",
//       "permission_type": "facility"
//   },
//   {
//       "id": 8,
//       "permission": "facility-data-visualizations",
//       "permission_type": "facility"
//   }
// ]

export const tabsData = (userType, userRole, permissions = []) => {
  let tabs = [];
  if(userType === 2){
    for(let i = 0; i < permissions.length; i++){
        if (permissions[i].permission === "add-use" || permissions[i].permission == "grant-revoke-access") {
          tabs.push(
            {
              label:"User Management",
              route:'/user-management'
            },
          );
        } else if (permissions[i].permission == "bind-company") {
          tabs.push(
            {
              label:"Participant Agreement",
              route:'/participant-agreement'
            },
          );
        } else if (permissions[i].permission == "facility") {
          tabs.push(
            {
              label:"Facility List",
              route:'/facility-list'
            },
          );
        }
    }
  }
  // if (userType == 2 && userRole == "Super-Admin") {
  //   tabs = [
  //     {
  //       label:"Facility List",
  //       route:'/facility-list'
  //     },
  //     {
  //       label:"Participant Agreement",
  //       route:'/participant-agreement'
  //     },
  //     {
  //       label:"User Management",
  //       route:'/user-management'
  //     },
  //   ];
  // }
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
      // {
      //   label:"Participant Agreement",
      //   route:'/participant-agreement'
      // },
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
  const uniqueTabs = [...new Map(tabs.map(item =>
    [item['label'], item])).values()];
  
  return uniqueTabs;
};
