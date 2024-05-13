import React, { lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import {  facilityEndPoints, participantAgreementEndPoints, userManagementEndPoints, profilePageEndPoints } from 'constants/endPoints';
import FacilityList from 'pages/Facility/FacilityList';
import AddFacilityComponent from 'pages/Facility/AddFacility';
import DashboardSectionComponent from 'pages/Facility/FacilityDashboard';
import UserManagement from 'pages/UserManagement/UserManagement';
import ParticipantAgreementComponent from 'pages/ParticipantAgreement';
import FacilityDetailsPage from 'pages/Facility/FacilityDetails';
import EntriesListing from 'sections/Homepage/FacilityDetails/EntriesListing';
import ProfilePage from 'pages/ProfilePage';
const Error404 = lazy(() => import('pages/Error/Error404'));


export const CustomerRoutes = () => {
    return (
      <Routes>
        <Route path='/' element={<Navigate to={facilityEndPoints.facilityDashboard} replace />} />
        <Route path={facilityEndPoints.facilityDashboard} element={<DashboardSectionComponent />} />
        <Route path= {facilityEndPoints.facilityList} element = {<FacilityList />} />
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.editFacility} element={ <AddFacilityComponent /> }/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.addFacility} element={ <AddFacilityComponent /> }/>
        <Route path= {participantAgreementEndPoints.participantAgreement} element={ <ParticipantAgreementComponent />} />
        <Route path= {userManagementEndPoints.userManagement} element={ <UserManagement />} />
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.facilityDetails} element={ <FacilityDetailsPage />}/>
        <Route path= {facilityEndPoints.facilityList+'/'+facilityEndPoints.entriesDetails} element={ <EntriesListing /> }/>
        <Route path= {profilePageEndPoints.profilePage} element={ <ProfilePage /> }/>
        <Route path='*' element={<Error404 />} />
      </Routes>
    );
  };