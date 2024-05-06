import React, { lazy } from 'react';
import { evUserManagementEndPoints, facilityEndPoints, pageSubEndspoints, participantAgreementEndPoints, userManagementEndPoints } from 'constants/endPoints';
import FacilityList from 'pages/Facility/FacilityList';
import AddFacilityComponent from 'pages/Facility/AddFacility';
import Homepage from 'pages/Homepage/Homepage';
import DashboardSectionComponent from 'pages/Facility/FacilityDashboard';
import UserManagement from 'pages/UserManagement/UserManagement';
import ParticipantAgreementComponent from 'pages/ParticipantAgreement';
import FacilityDetailsPage from 'pages/Facility/FacilityDetails';
import EntriesListing from 'sections/Homepage/FacilityDetails/EntriesListing';
import UserManagementAdmin from 'pages/UserManagementAdmin/UserManagementAdmin';
// import Facility from 'sections/Homepage/FacilitySection';

// const Homepage = lazy(() => import("pages/Homepage/Homepage"));

export const adminRoutes = [
  { key: 'homepage', name: 'Homepage', path: pageSubEndspoints.facilityDashboard, component:  <DashboardSectionComponent /> },
  { key: 'facilityDashboard', name: 'facilityDashboard', path: facilityEndPoints.facilityDashboard, component: <DashboardSectionComponent /> },
  { key: 'facilityList', name: 'facilityList', path: facilityEndPoints.facilityList, component: <FacilityList /> },
  { key: 'editFacility', name: 'EditFacility', path: facilityEndPoints.editFacility, component: <AddFacilityComponent /> },
  { key: 'addFacility', name: 'AddFacility', path: facilityEndPoints.addFacility, component: <AddFacilityComponent /> },
  { key: 'participantAgreement', name: 'participantAgreement', path: participantAgreementEndPoints.participantAgreement, component: <ParticipantAgreementComponent /> },
  { key: 'userManagement', name: 'userManagement', path: userManagementEndPoints.userManagement, component: <UserManagement /> },
  { key: 'facilityDetails', name: 'facilityDetails', path: facilityEndPoints.facilityDetails, component: <FacilityDetailsPage /> },
  { key: 'entriesDetails', name: 'entriesDetails', path: facilityEndPoints.entriesDetails, component: <EntriesListing /> },

  // envera admin routes
  { key: 'evUserManagement', name: 'evUserManagement', path: evUserManagementEndPoints.evUserManagement, component: <UserManagementAdmin /> },

];