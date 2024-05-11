import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setOption,
  setOption2,
} from "../../redux/superAdmin/actions/simpleActions";
import TabsSection from "../../sections/Homepage/TabsSection";
import DashboardSection from "../../sections/Homepage/DashboardSection";
import AddFacilityComponent from "../../sections/Homepage/AddFacility";
import Facility from "sections/Homepage/FacilitySection";
import Header from "components/CommonHeader/Header";
import DashboardPage from "sections/Homepage/DashBoardPage";
import CompanyPage from "sections/Homepage/CompanyPage";
import FacilityPage from "sections/Homepage/Facility";
import FacilityOverview from "sections/Homepage/Facility/facilityOverview";

const HomepageComponent = (props) => {
  const [option, setNewOption] = useState("");
  const [option2, setNewOption2] = useState("");

  const setOptionAction = (event) => {
    props.setOption(option);
  };

  const setOption2Action = (event) => {
    props.setOption2(option2);
  };

  return (
    <>
      {/* <TabsSection></TabsSection> */}
      {/* <DashboardSection></DashboardSection> */}
      {/* <AddFacilityComponent></AddFacilityComponent> */}
      <FacilityPage />
      {/* <CompanyPage/> */}
      {/*<ParticipantAgreementSection></ParticipantAgreementSection>
    <UserManagementSection></UserManagementSection> */}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOption: (optionOne) => dispatch(setOption(optionOne)),
  setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(HomepageComponent);
