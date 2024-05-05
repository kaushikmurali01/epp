import React, { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DashboardRoutes from './dashboard';

const CommonLayout = lazy(() => import('layout/dashboardLayout')); //todo

const RoutesComp = () => {
    const { pathname } = useLocation();
    const token  = localStorage.getItem(`msal.${process.env.REACT_APP_AZURE_B2C_CLIENT_ID}.active-account`);
    console.log('kkkkk, ', token); 
    return (
        // token ? (
            <CommonLayout>
                <DashboardRoutes />
            </CommonLayout >
        // ) : null
    )
}

export default RoutesComp;