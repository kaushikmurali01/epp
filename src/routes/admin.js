import React, { lazy } from 'react';
import { facilityEndPoints, pageSubEndspoints } from 'constants/endPoints';
import FacilityList from 'pages/Facility/FacilityList';
// import Facility from 'sections/Homepage/FacilitySection';

const Homepage = lazy(() => import("pages/Homepage/Homepage"));

export const adminRoutes = [
  { key: 'homepage', name: 'Homepage', path: pageSubEndspoints.dashboard, component: <Homepage /> },
  { key: 'facilityList', name: 'facilityList', path: facilityEndPoints.facilityList, component: <FacilityList /> },

];