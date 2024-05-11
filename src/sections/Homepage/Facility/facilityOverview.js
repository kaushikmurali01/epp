import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import FacilityOverViewTable from "components/FacilityOverview";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { facilityEndPoints } from "constants/apiEndPoints";
import { GET_REQUEST } from "utils/HTTPRequests";

const FacilityOverview = () => {
  // Sample data for Table 1
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [viewDataForFacility, setViewDataForFacility] = useState('');

  useEffect(() => {
    getOverview();
  }, [])

  const getOverview = () => {
    GET_REQUEST(facilityEndPoints.ADMIN_STATISTICS)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setViewDataForFacility(response.data.data);
        }
      })
      .catch((error) => {
      });
  }

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleFacilityChange = (event) => {
    setSelectedFacility(event.target.value);
  };
  const data1 = [
    {
      facilityId: 1,
      overview: "Total Companies",
      result: "XXXX",
    },
  ];

  // Sample data for Table 2
  const data2 = [
    {
      facilityId: 2,
      overview: "Number of facilities submitted for baseline modelling",
      result: "XXXX",
    },
  ];

  // Merge data1 and data2 into one array
  const mergedData = [...data1, ...data2];

  // Define handleAction function
  const handleAction = (id) => {
    // Your action logic here
    console.log("View details for row with id:", id);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="0.75rem"
            bgcolor={"#F26D04"}
            height="7rem"
            width="11rem"
            marginTop="2rem"
            marginRight="0.50rem"
          >
            <Typography
              variant="h4"
              sx={{
                color: "#FFFFFF",
                fontWeight: "500",
                fontSize: "14px !important",
                fontStyle: "italic",
                lineHeight: "106.815%",
                letterSpacing: "-0.01125rem",
              }}
            >
              # of Facilities Created
              <br />
              <Typography
                variant="h4"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: "18px !important",
                  fontStyle: "italic",
                  lineHeight: "106.815%",
                  letterSpacing: "-0.01125rem",
                }}
              >
                {viewDataForFacility?.all_facility}
              </Typography>
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              marginTop: "2rem",
              color: "#242424",
              fontWeight: "700",
              fontSize: "24px !important",
              fontStyle: "italic",
              lineHeight: "27.5px",
              letterSpacing: "-0.01125rem",
              fontStyle: "italic",
            }}
          >
            Facilities Overview
          </Typography>
          <Typography
            variant="h5"
            sx={{
              marginTop: "0.500rem",
              fontWeight: "400",
              fontSize: "12px !important",
              marginBottom: "2rem",
              lineHeight: "13.75px !important",
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>
          {/* <div>
        <Select
          value={selectedCompany}
          onChange={handleCompanyChange}
          displayEmpty
          variant="outlined"
          sx={{ marginRight: '1rem' }}
        >
          <MenuItem value="" disabled>
            Select Company
          </MenuItem>
        </Select>
        <Select
          value={selectedFacility}
          onChange={handleFacilityChange}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Select Facility
          </MenuItem>
        </Select>
      </div> */}
          <FacilityOverViewTable
            apiData={viewDataForFacility}
            data={mergedData}
            handleAction={handleAction}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityOverview;
