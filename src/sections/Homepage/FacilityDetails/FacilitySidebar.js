import * as React from "react";
import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";

export default function FacilitySidebar({ selectedTab, setSelectedTab }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const menuItems = [
    { label: "Summary", id: 0, type: "output" },
    { label: "Details", id: 1, type: "input" },
    { label: "Energy and Water", id: 2, type: "input" },
    { label: "Weather & Independent Variables", id: 3 },
    { label: "Reports and Studies", id: 4 },
    { label: "Baseline Model", id: 5 },
    { label: "Performance", id: 6 },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        width: isSmallScreen ? "100%" : "13rem",
        borderRight: !isSmallScreen && "1px solid #89AD90",
        borderBottom: isSmallScreen && "1px solid #89ad90",
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
      >
        {menuItems?.map((item, index) => (
          <Tab
            key={item.label}
            label={item.label}
            value={item.id}
            sx={{
              borderRadius: isSmallScreen
                ? ".625rem .625rem 0 0"
                : "0.625rem 0 0 0.625rem",
              backgroundColor:
                item.type === "input" ? "#2E8B5770" : "#058dcf70",
              margin: "0.125rem",
              "&.Mui-selected": {
                color: "white",
                backgroundColor: item.type === "input" ? "#2E8B57" : "#058dcf",
              },
              textTransform: "inherit",
              fontSize: ".875rem",
              color: "#242424",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
