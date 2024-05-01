import React, { lazy } from 'react';
import { pageSubEndspoints } from 'constants/endPoints';

const Homepage = lazy(() => import("pages/Homepage/Homepage"));

export const adminRoutes = [
  { key: 'homepage', name: 'Homepage', path: pageSubEndspoints.dashboard, component: <Homepage /> },
];