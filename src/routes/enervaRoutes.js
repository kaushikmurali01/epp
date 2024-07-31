import React, { lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import {  enervaEndPoints, facilityEndPoints, participantAgreementEndPoints, userManagementEndPoints, profilePageEndPoints } from 'constants/endPoints';
import AddFacilityComponent from 'pages/Facility/AddFacility';
import AdminAddFacilityComponent from 'sections/Admin/AdminFacilityDetails/AdminAddFacility';
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
import UserProfilePage from 'pages/UserManagementAdmin/UserProfilePage';
import EnervaAdminDashboard from 'pages/Admin/EnervaAdminDashboard';
import ChangePassword from 'pages/Onboarding/ChangePassword';
import FacilityPermissionPage from 'pages/Admin/Facility/FacilityPermissionPage';
import CompanyUserList from 'pages/Admin/Company/CompanyUserList';
import CompanyManageAccess from 'pages/Admin/Company/CompanyManageAccess';
import UserManagementAdminNew from 'pages/UserManagementAdmin/UserManagementAdminNew';
import AdminFacilityListingNew from 'sections/Admin/AdminFacilityListingNew';
import UserAdminManageAccess from 'pages/UserManagementAdmin/UserAdminManageAccess';
import FacilityManageUserAccess from 'sections/Admin/AdminFacilityListingNew/FacilityManageUserAccess';

const Error404 = lazy(() => import('pages/Error/Error404'));


export const EnervaRoutes = () => {
    return (
      <Routes>
        <Route path='/' element={<Navigate to={facilityEndPoints.facilityDashboard} replace />} />
        <Route path={facilityEndPoints.facilityDashboard} element={<EnervaAdminDashboard />} />
        {/*old*/}
        {/* <Route path= {facilityEndPoints.facilityListNew} element = {<AdminFacilityListingNew />}/>
        <Route path= {facilityEndPoints.facilityList} element = {<AdminFacilityList/>}/> */}
        
        {/*new*/}
        <Route path= {facilityEndPoints.facilityListNew} element = {<AdminFacilityList />}/>
        <Route path= {facilityEndPoints.facilityList} element = {<AdminFacilityListingNew/>}/>

        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.editFacility} element={ <AdminAddFacilityComponent /> }/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.addFacility} element={ <AdminAddFacilityComponent /> }/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.facilityManagePermissions} element={ <FacilityManageUserAccess /> }/>
        {/* <Route path= {participantAgreementEndPoints.participantAgreement} element={ <ParticipantAgreementComponent />} /> */}
        <Route path= {userManagementEndPoints.userManagementNew} element={ <UserManagementAdmin />} />
        <Route path= {userManagementEndPoints.userManagement} element={ <UserManagementAdminNew />} />
        <Route path= {userManagementEndPoints.userManagementAccess} element={ <UserAdminManageAccess />} />
        <Route path= {userManagementEndPoints.userProfile} element={ <UserProfilePage />} />
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.facilityDetails} element={ <AdminFacilityDetailsPage />}/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.entriesDetails} element={ <EntriesListing /> }/>
        <Route path={enervaEndPoints.companies} element={<CompanyList />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyProfile} element={<CompanyProfilePage />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyAgreement} element={<CompanyAgreement />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyUsers} element={<CompanyUserList />} />
        {/* <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyManageAccess} element={<CompanyManageAccess />} /> */}

        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyUserManageAccessByName} element={<CompanyManageAccess />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyUserManageAccessByName+'/'+enervaEndPoints.addUser} element={<UserAdminManageAccess />} />
        <Route path={enervaEndPoints.companies+'/'+enervaEndPoints.companyUserManageAccessByName+'/'+enervaEndPoints.managePermission} element={<UserAdminManageAccess />} />


        <Route path={enervaEndPoints.reportManagement} element={<DashboardSectionComponent />} />
        <Route path={enervaEndPoints.programManagement} element={<DashboardSectionComponent />} />
        <Route path={enervaEndPoints.roleAndPermissionManagement} element={<RolePermissionsUserManagement />} />
        <Route path={enervaEndPoints.clientManagement} element={<DashboardSectionComponent />} />
        <Route path={profilePageEndPoints.profilePage} element={<ProfilePage />} />
        <Route path= {profilePageEndPoints.profilePage} element={ <ProfilePage /> }/>
        {/* <Route path= {profilePageEndPoints.ChangePassword} element={ <ChangePassword /> }/> */}
        <Route path='*' element={<Error404 />} />
      </Routes>
    );
  };