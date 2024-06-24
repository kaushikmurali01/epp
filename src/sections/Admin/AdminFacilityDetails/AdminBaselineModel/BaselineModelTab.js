import React, { useEffect, useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import { Button, Grid, Typography } from "@mui/material";
import BaselineSummary from "./BaselineSummary";
import BaselineVisualization from "./BaselineVisualization";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminBaselinePeriod } from "../../../../redux/admin/actions/adminBaselineAction";

const BaselineModelTab = ({ handleSufficiencySettings }) => {
  const [activeButton, setActiveButton] = useState(1);
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };
  const facilityCreatedBy = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.created_by
  );

  useEffect(() => {
    dispatch(fetchAdminBaselinePeriod(24, 163));
  }, []);

  return (
    <>
      <Grid item display={"flex"} justifyContent={"space-between"} gap={"1rem"}>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(1)}
          >
            Electricity
          </Button>
          <Button
            sx={activeButton === 2 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(2)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        <Typography
          variant="h6"
          sx={{
            padding: "0.375rem 1rem",
            borderRadius: "1.8125rem",
            background: "#CFEEFF",
            color: "#1976AA",
            fontSize: "0.875rem",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          Electricity baseline has been successfully created on : 2020/03/05
          13:35:01
        </Typography>
      </Grid>

      <Grid item>
        <CustomAccordion
          summary="Model constructor"
          details={
            <ModelConstructorForm
              handleSufficiencySettings={handleSufficiencySettings}
            />
          }
          panelId="modelConstructor"
        />

        <CustomAccordion
          summary="Summary"
          details={<BaselineSummary />}
          panelId="summary"
        />

        <CustomAccordion
          summary="Visualization"
          details={<BaselineVisualization />}
          panelId="visualization"
        />
      </Grid>
    </>
  );
};

export default BaselineModelTab;
