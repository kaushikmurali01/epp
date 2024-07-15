import React, { useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import {
  Button,
  FormControl,
  FormGroup,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import { MiniTable } from "components/MiniTable";

const DetailsAndSetting = () => {
  const [activeButton, setActiveButton] = useState("outliers_info");

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const outliersInfoColumn = [
    {
      Header: "ID",
      accessor: "",
      headerVisibility: "hidden",
    },
    {
      Header: "Electricity",
      accessor: "Electricity",
    },
    {
      Header: "NG",
      accessor: "NG",
    },

    {
      Header: "Temperature",
      accessor: "details",
    },
    {
      Header: "Independent variable",
      accessor: "Threshold",
    },
  ];

  const outliersSettingsColumn = [
    {
      Header: "ID",
      accessor: "",
      headerVisibility: "hidden",
    },
    {
      Header: "Electricity",
      accessor: "Electricity",
    },
    {
      Header: "NG",
      accessor: "NG",
    },

    {
      Header: "Temperature",
      accessor: "details",
    },
    {
      Header: "Independent variable",
      accessor: "Threshold",
    },
  ];
  return (
    <Grid>
      <Grid container alignItems="center">
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "outliers_info"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("outliers_info")}
          >
            Outliers Info
          </Button>
          <Button
            sx={
              activeButton === "outliers_settings"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("outliers_settings")}
          >
            Outliers settings
          </Button>
        </StyledButtonGroup>
        {activeButton === "outliers_settings" && (
          <FormGroup className="theme-form-group theme-select-form-group">
            <FormControl
              sx={{ minWidth: "6rem", maxWidth: "8rem", flexGrow: "1" }}
            >
              <Select
                value=""
                displayEmpty={true}
                className="transparent-border"
              >
                <MenuItem value="">Outlier Detection Method</MenuItem>
              </Select>
            </FormControl>
          </FormGroup>
        )}
      </Grid>

      <Grid container mt={4}>
        {activeButton === "outliers_info" && (
          <MiniTable columns={outliersInfoColumn} data={[{}]} />
        )}
        {activeButton === "outliers_settings" && (
          <MiniTable columns={outliersSettingsColumn} data={[{}]} />
        )}
      </Grid>
    </Grid>
  );
};

export default DetailsAndSetting;
