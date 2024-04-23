import React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import FacilityStatus from "../components/FacilityStatus";
import CustomSlider from "../components/CustomSlider";

export const FACILITY_COLUMNS = [
  {
    Header: "Name/Nick Name",
    accessor: (item) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        gap={2}
      >
        <Typography>{item.name}</Typography>
        <AvatarGroup>
          {item?.adminList?.map((elements) => (
            <Avatar
              alt={elements.name}
              src={elements.image}
              key={elements.name}
              sx={{ width: "1.75rem", height: "1.75rem" }}
            />
          ))}
        </AvatarGroup>
      </Box>
    ),
  },
  {
    Header: "Facility Id",
    accessor: "facility_id",
  },
  {
    Header: "Total Electicity Savings",
    accessor: "total_electicity_savings",
  },
  {
    Header: "% Energy Savings",
    accessor: (item) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>{item.energy_savings}%</Typography>
        <CustomSlider value={item.energy_savings} />
      </Box>
    ),
  },
  {
    Header: "Total Enetitative Earned",
    accessor: "total_enetitative_earned",
  },
  {
    Header: "Benchmarking EUI",
    accessor: "benchmarking_eui",
  },
  {
    Header: "Facility Status",
    accessor: (item) => <FacilityStatus>{item.facility_status}</FacilityStatus>,
  },
  {
    Header: "View/Edit",
    accessor: (item) => (
      <Box gap={1} sx={{ display: "flex" }}>
        <IconButton>
          <ReplyOutlinedIcon
            sx={{
              color: "text.secondary2",
              WebkitTransform: "scaleX(-1)",
              transform: "scaleX(-1)",
            }}
          />
        </IconButton>
        <IconButton>
          <BorderColorOutlinedIcon sx={{ color: "text.secondary2" }} />
        </IconButton>
      </Box>
    ),
  },
];
