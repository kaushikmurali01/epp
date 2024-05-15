import React, { lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import {  enervaEndPoints, facilityEndPoints, participantAgreementEndPoints, userManagementEndPoints, profilePageEndPoints } from 'constants/endPoints';
import AddFacilityComponent from 'pages/Facility/AddFacility';
import DashboardSectionComponent from 'pages/Facility/FacilityDashboard';
import ParticipantAgreementComponent from 'pages/ParticipantAgreement';
import EntriesListing from 'sections/Homepage/FacilityDetails/EntriesListing';
import AdminFacilityList from 'pages/Admin/Facility/AdminFacilityList';
import AdminFacilityDetailsPage from 'pages/Admin/Facility/AdminFacilityDetails';
import UserManagementAdmin from 'pages/UserManagementAdmin/UserManagementAdmin';
import ProfilePage from 'pages/ProfilePage';
import RolePermissionsUserManagement from 'pages/RolesPermissions/RolePermissionsUserManagement';
import CompanyPage from 'sections/Homepage/CompanyPage';
import CompanyList from 'pages/Admin/Company/CompanyList';
import CompanyProfilePage from 'pages/Admin/Company/CompanyProfilePage';
import CompanyAgreement from 'pages/Admin/Company/CompanyAgreement';

const Error404 = lazy(() => import('pages/Error/Error404'));


export const EnervaRoutes = () => {
    return (
      <Routes>
        <Route path='/' element={<Navigate to={facilityEndPoints.facilityDashboard} replace />} />
        <Route path={facilityEndPoints.facilityDashboard} element={<DashboardSectionComponent />} />
        <Route path= {facilityEndPoints.facilityList} element = {<AdminFacilityList />} />
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.editFacility} element={ <AddFacilityComponent /> }/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.addFacility} element={ <AddFacilityComponent /> }/>
        {/* <Route path= {participantAgreementEndPoints.participantAgreement} element={ <ParticipantAgreementComponent />} /> */}
        <Route path= {userManagementEndPoints.userManagement} element={ <UserManagementAdmin />} />
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.facilityDetails} element={ <AdminFacilityDetailsPage />}/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.entriesDetails} element={ <EntriesListing /> }/>
        <Route path={enervaEndPoints.companies} element={<CompanyList />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyProfile} element={<CompanyProfilePage />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyAgreement} element={<CompanyAgreement />} />

        <Route path={enervaEndPoints.reportManagement} element={<DashboardSectionComponent />} />
        <Route path={enervaEndPoints.programManagement} element={<DashboardSectionComponent />} />
        <Route path={enervaEndPoints.roleAndPermissionManagement} element={<RolePermissionsUserManagement />} />
        <Route path={enervaEndPoints.clientManagement} element={<DashboardSectionComponent />} />
        <Route path= {profilePageEndPoints.profilePage} element={ <ProfilePage /> }/>
        <Route path='*' element={<Error404 />} />
      </Routes>
    );
  };