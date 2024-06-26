import React, { useEffect, useState } from "react";
import ModelConstructorForm from "./ModelConstructorForm";
import CustomAccordion from "components/CustomAccordion";
import { Box, Button, Grid, Typography } from "@mui/material";
import BaselineSummary from "./BaselineSummary";
import BaselineVisualization from "./BaselineVisualization";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchBaselinePeriod } from "../../../../redux/superAdmin/actions/baselineAction";
import { useParams } from "react-router-dom";

const BaselineModelTab = () => {
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
    dispatch(fetchBaselinePeriod(id, facilityCreatedBy));
  }, [dispatch, id, facilityCreatedBy]);

  return (
    <>
      <Grid container justifyContent="space-between">
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
            mt: { xs: 2, lg: 0 },
          }}
        >
          Electricity baseline has been successfully created on : 2020/03/05
          13:35:01
        </Typography>
      </Grid>

      <Box>
        <CustomAccordion
          summary="Model constructor"
          details={<ModelConstructorForm meterType={activeButton} />}
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
      </Box>
    </>
  );
};

export default BaselineModelTab;
