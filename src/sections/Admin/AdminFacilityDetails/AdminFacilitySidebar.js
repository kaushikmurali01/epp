import * as React from "react";
import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

export default function AdminFacilitySidebar({ selectedTab, setSelectedTab }) {
  const facility_status = useSelector(
    (state) => state?.adminFacilityReducer?.facilityStatus?.data?.timeline
  );
  const disabledTab = useSelector(
    (state) => state?.adminFacilityReducer?.facilityStatus?.data?.disabled
  );
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const menuItems = [
    { label: "Summary", id: 0, type: "output", value: "summary" },
    { label: "Details", id: 1, type: "input", value: "detail" },
    {
      label: "Energy and Water",
      id: 2,
      type: "input",
      value: "ew",
    },
    {
      label: "Weather & Independent Variables",
      id: 3,
      type: "input",
      value: "weather_iv",
    },
    {
      label: "Savings Plan and Document",
      id: 4,
      type: "input",
      value: "savings",
    },
    { label: "Baseline Modeling", id: 5, type: "input", value: "baseline" },
    { label: "Performance", id: 6, type: "input", value: "performance" },
    { label: "QA/QC checklist", id: 7, type: "input", value: "qaqcChecklist" },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: isSmallScreen ? "100%" : "13rem",
        height: "50%",
      }}
    >
      <Tabs
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        onChange={handleTabChange}
        value={selectedTab}
        TabIndicatorProps={{
          style: { display: "none" },
        }}
        variant={isSmallScreen ? "scrollable" : "fullWidth"}
        sx={{
          borderRight: !isSmallScreen && "1px solid #89AD90",
          borderBottom: isSmallScreen && "1px solid #89ad90",
        }}
      >
        {menuItems?.map((item, index) => (
          <Tab
            key={item.label}
            label={item.label}
            value={item.id}
            sx={{
              position: "relative",
              borderRadius: isSmallScreen
                ? ".625rem .625rem 0 0"
                : "0.625rem 0 0 0.625rem",
              backgroundColor:
                item.type === "input" ? "#2E8B5770" : "#058dcf70",
              width: { xs: "166px", md: "96%" },
              minHeight: "48px", // Ensure consistent height
              padding: "0", // Remove padding to prevent height increase
              margin: "0.125rem",
              "&.Mui-selected": {
                color: "white",
                backgroundColor: item.type === "input" ? "#2E8B57" : "#058dcf",
              },
              textTransform: "inherit",
              fontSize: ".875rem",
              color: "#242424",
            }}
            icon={
              item.type === "input" && (
                <Box
                  sx={{
                    position: "absolute",
                    width: ".55rem",
                    height: ".55rem",
                    borderRadius: "50%",
                    background: facility_status?.[item?.value]
                      ? "#80FF98"
                      : "#FFD5A4",
                    right: ".5rem",
                    top: ".15rem",
                    margin: "0!important",
                  }}
                ></Box>
              )
            }
            // disabled={!disabledTab?.[item?.value]}
          />
        ))}
      </Tabs>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        mt={2}
        alignSelf="flex-end"
        rowGap={1}
      >
        <Box sx={{ display: "flex" }} gap={2}>
          <Box
            sx={{ height: "1rem", width: "1.2rem", background: "#FFD5A4" }}
          ></Box>
          <Typography variant="small">Pending</Typography>
        </Box>
        <Box sx={{ display: "flex" }} gap={2}>
          <Box
            sx={{ height: "1rem", width: "1.2rem", background: "#80FF98" }}
          ></Box>

          <Typography variant="small">Completed</Typography>
        </Box>
      </Box>
    </Box>
  );
}
