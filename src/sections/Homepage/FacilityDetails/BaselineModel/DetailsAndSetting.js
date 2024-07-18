import React, { useState, useMemo } from "react";
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
import { useSelector } from "react-redux";

const DetailsAndSetting = () => {
  const [activeButton, setActiveButton] = useState("outliers_info");

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const summaryData = useSelector(
    (state) => state?.baselineReducer?.dataExplorationSummaryList
  );

  const propertyNames = {
    first_quartile: "First Quartile",
    third_quartile: "Third Quartile",
    inter_quartile: "Inter Quartile",
    lower_limit: "Lower Limit",
    upper_limit: "Upper Limit",
  };

  const getOutliersInfoColumns = useMemo(() => {
    if (!summaryData?.popup?.columns || !summaryData?.popup?.data) {
      return [];
    }

    const columns = [
      {
        Header: "Property",
        accessor: "property",
        headerVisibility: "hidden",
      },
      ...summaryData?.popup?.columns?.map((columnName) => ({
        Header: columnName,
        accessor: columnName,
      })),
    ];

    return columns;
  }, [summaryData?.popup]);

  const getOutliersInfoData = useMemo(() => {
    if (!summaryData?.popup?.columns || !summaryData?.popup?.data) {
      return [];
    }

    return Object.entries(propertyNames)?.map(([key, propertyName]) => {
      const row = { property: propertyName };
      summaryData?.popup?.columns?.forEach((columnName) => {
        const dataItem = summaryData?.popup.data?.find(
          (item) => (item?.meter_name || item?.iv_name) === columnName
        );
        row[columnName] = dataItem ? dataItem[key] : "";
      });
      return row;
    });
  }, [summaryData?.popup]);

  const getOutliersSettingsColumns = useMemo(() => {
    if (!summaryData?.outlier_settings) {
      return [];
    }
  
    return [
      {
        Header: "Property",
        accessor: "property",
      },
      ...summaryData?.outlier_settings?.map((item) => ({
        Header: item?.meter_name,
        accessor: item?.meter_name,
      })),
    ];
  }, [summaryData?.outlier_settings]);

  const getOutliersSettingsData = useMemo(() => {
    if (!summaryData?.outlier_settings) {
      return [];
    }
  
    const row = { property: "Range Factor" };
    summaryData?.outlier_settings?.forEach((item) => {
      row[item.meter_name] = item?.range_factor;
    });
  
    return [row];
  }, [summaryData?.outlier_settings]);

  const getTableData = () => {
    if (activeButton === "outliers_settings") {
      return getOutliersSettingsData;
    }

    return getOutliersInfoData;
  };

  const getTableColumns = () => {
    if (activeButton === "outliers_settings") {
      return getOutliersSettingsColumns;
    }

    return getOutliersInfoColumns;
  };

  const renderTable = () => {
    const tableData = getTableData();
    const tableColumns = getTableColumns();

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
