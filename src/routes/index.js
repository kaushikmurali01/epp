import React, { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DashboardRoutes from './dashboard';

// const CommonLayout = lazy(() => import('layout/dashboardLayout')); //todo

const RoutesComp = () => {
    console.log('kkkkk')
    const { pathname } = useLocation();
    const token  = localStorage.getItem("token");
    return (
        token ? (
            // <CommonLayout>
                <DashboardRoutes />
            // </CommonLayout >
        ) : null
    )
}

export default RoutesComp;