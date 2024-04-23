import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { ALL_LINKS } from '../constants/routes';
import { dashboardEndpoints } from '../constants/endPoints';

// const Error404 = lazy(() => import('pages/error/error404'));

const DashboardRoutes = () => {

    console.log('kklkllkl');

    const renderRoutes = (route) => (
        <Route key={route.key} path={route.path} element={<Outlet />}>
            <Route key={route.key} path={route.path} element={route?.children[0].component} />
            {route?.children?.map((subRoutes) => subRoutes?.children ?
                <Route key={route.key} path={route.path} element={<Outlet />}>
                    <Route key={subRoutes.key} path={subRoutes.path} element={subRoutes.children[0].component} />
                    {subRoutes.children.map(subRoute => <Route key={subRoute.key} path={subRoute.path} element={subRoute.component} />)}
                </Route>
                : <Route key={subRoutes.key} path={subRoutes.path} element={subRoutes.component} />)}
        </Route>
    );

    return (
        <Suspense fallback={'loading spinner....'}>
            <Routes>
                <Route path='/' element={<Navigate to={dashboardEndpoints.admin} replace />} />
                {ALL_LINKS.map((route) => route?.children ? renderRoutes(route) : <Route key={route.key} path={route.path} element={route.component} />)}
                {/* <Route path='*' element={<Error404 />} /> */}
            </Routes>
        </Suspense>
    )
}

export default DashboardRoutes;