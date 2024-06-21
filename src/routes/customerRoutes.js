import React, { lazy } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import {
  facilityEndPoints,
  participantAgreementEndPoints,
  userManagementEndPoints,
  profilePageEndPoints,
} from "constants/endPoints";
import FacilityList from "pages/Facility/FacilityList";
import AddFacilityComponent from "pages/Facility/AddFacility";
import DashboardSectionComponent from "pages/Facility/FacilityDashboard";
import UserManagement from "pages/UserManagement/UserManagement";
import ParticipantAgreementComponent from "pages/ParticipantAgreement";
import FacilityDetailsPage from "pages/Facility/FacilityDetails";
import EntriesListing from "sections/Homepage/FacilityDetails/EntriesListing";
import ProfilePage from "pages/ProfilePage";
import ChangePassword from 'pages/Onboarding/ChangePassword';
const Error404 = lazy(() => import("pages/Error/Error404"));

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

export const CustomerRoutes = ({ userDetails, userPermissions, userCompany }) => {
  let routesToPermit = [];
  if(userDetails?.status == "Inactive" || userCompany?.is_active == 0){
    routesToPermit.push(<Route path="*" element={<Error404 />} />, 
    <Route path= {profilePageEndPoints.profilePage} element={ <ProfilePage /> }/>,)
  }else{
    routesToPermit.push(
    <Route
      path="/"
      element={<Navigate to={facilityEndPoints.facilityDashboard} replace />}
    />,
    <Route
      path={facilityEndPoints.facilityDashboard}
      element={<DashboardSectionComponent />}
    />,
    <Route path="*" element={<Error404 />} />,
    <Route path= {profilePageEndPoints.profilePage} element={ <ProfilePage /> }/>,)
  }

  for (let i = 0; i < userPermissions.length; i++) {
    if (userPermissions[i].permission === "add-user" || userPermissions[i].permission =="grant-revoke-access") {
      routesToPermit.push(
        <Route
          path={userManagementEndPoints.userManagement}
          element={<UserManagement />}
        />
      );
    } else if (userPermissions[i].permission == "bind-company") {
      routesToPermit.push(
        <Route
          path={participantAgreementEndPoints.participantAgreement}
          element={<ParticipantAgreementComponent />}
        />
      );
    } else if (userPermissions[i].permission == "facility") {
      routesToPermit.push(
        <Route
          path={facilityEndPoints.facilityList}
          element={<FacilityList />}
        />,
        <Route
          path={
            facilityEndPoints.facilityList +
            "/" +
            facilityEndPoints.editFacility
          }
          element={<AddFacilityComponent />}
        />,
        <Route
          path={
            facilityEndPoints.facilityList + "/" + facilityEndPoints.addFacility
          }
          element={<AddFacilityComponent />}
        />,
      );
    } else if (userPermissions[i].permission == "facility-data" || userPermissions[i].permission == "facility-data-visualizations") {
      routesToPermit.push(
        <Route
          path={
            facilityEndPoints.facilityList +
            "/" +
            facilityEndPoints.facilityDetails
          }
          element={<FacilityDetailsPage />}
        />,
        <Route
          path={
            facilityEndPoints.facilityList +
            "/" +
            facilityEndPoints.entriesDetails
          }
          element={<EntriesListing />}
        />
      );
    }
  }

  console.log('routes to permin', routesToPermit)

  return (
    <Routes>
      {routesToPermit.length > 0 ? routesToPermit.map((item) => item) : null}
    </Routes>
  );
};
