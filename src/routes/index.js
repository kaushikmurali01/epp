import React, { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DashboardRoutes from './dashboard';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider, useAccount } from "@azure/msal-react";


const CommonLayout = lazy(() => import('layout/dashboardLayout')); //todo

const RoutesComp = () => {
    const { pathname } = useLocation();
    const token  = localStorage.getItem(`msal.${process.env.REACT_APP_AZURE_B2C_CLIENT_ID}.active-account`);
    const { instance, accounts, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();
    

   
    const account = useAccount(accounts[0] || {});

    useEffect(() => {
        if (account) {
        instance.acquireTokenSilent({
            scopes: [],
        }).then((response) => {
            localStorage.setItem("accessToken", response?.idToken)
        });
        }
    }, [account]);

    return (
        true ? (
            <CommonLayout>
                <DashboardRoutes />
            </CommonLayout >
        ) : null
    )
}

export default RoutesComp;