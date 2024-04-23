import { lazy } from "react";
import { dashboardEndpoints } from "constants/endPoints";
import { adminRoutes } from "../routes/admin";

export const ALL_LINKS = [
    { key: 'admin', name: 'Admin', path: dashboardEndpoints.admin, children: adminRoutes },
];