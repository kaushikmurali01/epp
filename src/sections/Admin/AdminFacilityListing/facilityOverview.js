import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Select,
  MenuItem,
  FormGroup,
  FormControl,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStatistic } from "../../../redux/admin/actions/adminFacilityActions";

const FacilityOverview = () => {
  const [companyFilter, setCompanyFilter] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("");
  const dispatch = useDispatch();
  const viewDataForFacility = useSelector(
    (state) => state?.adminFacilityReducer?.facilityStatistics?.data || []
  );
  useEffect(() => {
    dispatch(fetchAdminStatistic(companyFilter, facilityFilter));
  }, [dispatch, companyFilter, facilityFilter]);

  const adminFacilitiesDropdownData = useSelector(
    (state) => state?.adminFacilityReducer?.facilitiesDropdown?.data || []
  );

  const adminCompaniesDropdownData = useSelector(
    (state) => state?.adminCompanyReducer?.companiesDropdown?.data || []
  );

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
          <Grid container gap={2} alignContent="center" mt={4}>
            <Grid item xs={5}>
              <Typography
                variant="h2"
                sx={{
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
            </Grid>
            <Grid
              item
              sm={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FormGroup className="theme-form-group theme-select-form-group">
                <FormControl sx={{ minWidth: "6rem" }}>
                  <Select
                    displayEmpty={true}
                    className="transparent-border"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Company name</em>
                    </MenuItem>
                    {adminCompaniesDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.company_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid
              item
              sm={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FormGroup className="theme-form-group theme-select-form-group">
                <FormControl sx={{ minWidth: "6rem" }}>
                  <Select
                    displayEmpty={true}
                    className="transparent-border"
                    value={facilityFilter}
                    onChange={(e) => setFacilityFilter(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Facility name</em>
                    </MenuItem>
                    {adminFacilitiesDropdownData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.facility_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Overview</TableCell>
                  <TableCell>Results</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Total companies</TableCell>
                  <TableCell>{viewDataForFacility?.all_company}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>
                    Number of facilities submitted for baseline modelling
                  </TableCell>
                  <TableCell>
                    {viewDataForFacility?.all_acility_with_baseline_approval}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>Number of facilities created</TableCell>
                  <TableCell>{viewDataForFacility?.all_facility}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell>
                    Number of Participant Agreements executed
                  </TableCell>
                  <TableCell>{viewDataForFacility?.all_pa_signed}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityOverview;
