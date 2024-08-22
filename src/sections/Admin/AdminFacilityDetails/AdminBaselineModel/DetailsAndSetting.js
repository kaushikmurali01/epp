import React, { useState, useMemo, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { MiniTable } from "components/MiniTable";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminOutliersSettingsData } from "../../../../redux/admin/actions/adminBaselineAction";

const DetailsAndSetting = () => {
  const [activeButton, setActiveButton] = useState("outliers_info");
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  useEffect(() => {
    dispatch(fetchAdminOutliersSettingsData(id));
  }, [dispatch, id]);

  const summaryData = useSelector(
    (state) => state?.adminBaselineReducer?.outliersSettingsData
  );

  const formatPropertyName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getOutliersInfoData = useMemo(() => {
    if (!summaryData?.info) {
      return [];
    }

    const properties = [
      "first_quartile",
      "inter_quartile",
      "lower_limit",
      "third_quartile",
      "upper_limit",
    ];

    return properties.map((prop) => {
      const row = { property: formatPropertyName(prop) };
      summaryData.info.forEach((item) => {
        row[item.meter_name] = item[prop];
      });
      return row;
    });
  }, [summaryData?.info]);

  const getOutliersSettingsData = useMemo(() => {
    if (!summaryData?.settings) {
      return [];
    }

    const row = { property: "Range Factor" };
    summaryData.settings.forEach((item) => {
      const [key, value] = Object.entries(item)[0];
      row[key] = value;
    });

    return [row];
  }, [summaryData?.settings]);

  const getTableColumns = useMemo(() => {
    if (!summaryData?.info) {
      return [];
    }

    return [
      { Header: "Property", accessor: "property", headerVisibility: "hidden" },
      ...summaryData.info.map((item) => ({
        Header: (
          <Typography
            variant="small2"
            sx={{
              textTransform: "capitalize",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {item.meter_name.toLowerCase()}
          </Typography>
        ),
        accessor: item.meter_name,
      })),
    ];
  }, [summaryData?.info]);

  const getTableData = () => {
    if (activeButton === "outliers_settings") {
      return getOutliersSettingsData;
    }
    return getOutliersInfoData;
  };

  const renderTable = () => {
    const tableData = getTableData();
    const tableColumns = getTableColumns;

    return <MiniTable columns={tableColumns} data={tableData} />;
  };

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
                value="interquartile"
                displayEmpty={true}
                className="transparent-border"
              >
                <MenuItem value="">Outlier Detection Method</MenuItem>
                <MenuItem value="interquartile">Interquartile</MenuItem>
              </Select>
            </FormControl>
          </FormGroup>
        )}
      </Grid>
      <Grid container mt={4}>
        {renderTable()}
      </Grid>
    </Grid>
  );
};

export default DetailsAndSetting;
