import React, { lazy } from 'react';
import { facilityEndPoints, pageSubEndspoints } from 'constants/endPoints';
import FacilityList from 'pages/Facility/FacilityList';
import AddFacilityComponent from 'pages/Facility/AddFacility';
import Homepage from 'pages/Homepage/Homepage';
import DashboardSectionComponent from 'pages/Facility/FacilityDashboard';
// import Facility from 'sections/Homepage/FacilitySection';

// const Homepage = lazy(() => import("pages/Homepage/Homepage"));

export const adminRoutes = [
  { key: 'homepage', name: 'Homepage', path: pageSubEndspoints.dashboard, component: <Homepage /> },
  { key: 'facilityDashboard', name: 'facilityDashboard', path: facilityEndPoints.facilityDashboard, component: <DashboardSectionComponent /> },
  { key: 'facilityList', name: 'facilityList', path: facilityEndPoints.facilityList, component: <FacilityList /> },
  { key: 'addFacility', name: 'AddFacility', path: facilityEndPoints.addFacility, component: <AddFacilityComponent /> },
];