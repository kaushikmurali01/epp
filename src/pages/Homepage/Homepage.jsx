import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setOption, setOption2 } from "../redux/actions/simpleActions";
// import Dashboarsection from "./DashboardSection";
import TabsSection from '../sections/TabsSection'

const ActionComponent = (props) => {
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
    <TabsSections></TabsSections>
    <DashboardSection></DashboardSection>
    <FacilitySection></FacilitySection>
    <ParticipantAgreementSection></ParticipantAgreementSection>
    <UserManagementSection></UserManagementSection>
    </>
    
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOption: (optionOne) => dispatch(setOption(optionOne)),
  setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(ActionComponent);
