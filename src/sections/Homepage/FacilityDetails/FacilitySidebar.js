import * as React from "react";
import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";

export default function FacilitySidebar({ selectedTab, setSelectedTab }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const menuItems = [
    { label: "Summary", id: 0, type: "output" },
    { label: "Details", id: 1, type: "input" },
    { label: "Energy and Water", id: 2, type: "input" },
    // { label: "Weather & Independent Variables", id: 3, type: "input" },
    // { label: "Savings Plan and Document", id: 4, type: "input" },
    // { label: "Baseline Model", id: 5 , type: "input"},
    // { label: "Performance", id: 6 , type: "input"},
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
                    background: true ? "#80FF98" : "#FFD5A4",
                    right: ".5rem",
                    top: ".15rem",
                    margin: "0!important",
                  }}
                ></Box>
              )
            }
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
