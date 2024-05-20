import React, { lazy } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import {
  facilityEndPoints,
  profilePageEndPoints,
} from "constants/endPoints";
import ProfilePage from "pages/ProfilePage";
const Error404 = lazy(() => import("pages/Error/Error404"));

export const IndividualUserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={facilityEndPoints.facilityDashboard} replace />}
      />
      <Route
        path={profilePageEndPoints.profilePage}
        element={<ProfilePage />}
      />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};
