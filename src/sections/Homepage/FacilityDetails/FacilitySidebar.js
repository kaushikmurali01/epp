import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box, ListItem } from "@mui/material";

function FacilitySidebar() {
  const menuItems = [
    { label: "Performance summary", component: "performanceSummary" },
    { label: "Facility user access", component: "facilityUserAccess" },
    { label: "Address and type", component: "addressAndType" },
    { label: "Charcteristics", component: "charcteristics" },
    { label: "Operating Parameter", component: "operatingParameter" },
    { label: "Electricty Consumption", component: "electrictyConsumption" },
  ];

  return (
    <Box
      sx={{
        width: "11rem",
        border: "1px solid #2E813E",
        borderRadius: "0.75rem",
      }}
    >
      <List>
        {menuItems?.map((item) => (
          <ListItem disablePadding>
            <ListItemButton key={item.id} dense>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default FacilitySidebar;
