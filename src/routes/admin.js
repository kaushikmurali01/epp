import React, { lazy } from 'react';
import { pageSubEndspoints } from 'constants/endPoints';

const Homepage = lazy(() => import("../pages/LandingPage"));

export const adminRoutes = [
  { key: 'homepage', name: 'Homepage', path: pageSubEndspoints.index, component: <Homepage /> },
];