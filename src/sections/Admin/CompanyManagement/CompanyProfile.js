import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  List,
  IconButton,
  Link,
  Link as MuiLink,
} from "@mui/material";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminCompanyDetails } from "../../../redux/admin/actions/adminCompanyAction";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { userTypes } from "constants/allDefault";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "pages/Loader";
import CustomAccordion from "components/CustomAccordion";
import { MiniTable } from "components/MiniTable";

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [expanded, setExpanded] = useState("user");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const userColumn = [
    // {
    //   Header: "",
    //   accessor: "id",
    //   cWidth: "15px",
    // },
    {
      Header: "Name of User",
      accessor: (item) => `${item?.first_name ? item?.first_name : ''} ${item?.last_name ? item?.last_name : ''}`,
    },
    {
      Header: "Company name",
      accessor: "company_name",
    },
    {
      Header: "Phone Number",
      accessor: "phonenumber",
    },
    {
      Header: "Business Email",
      accessor: (item) => (
        <Link
          href={`#/user-management/profile/${item?.company_id}/${item?.user_id}`}
          sx={{ color: "#2C77E9" }}
        >
          {item?.email}
        </Link>
      ),
    },
    // {
    //   Header: "User Id",
    //   accessor: "user_id",
    // },
    {
      Header: "User Role",
      accessor: "role_name",
    },
  ];
  const facilityColumn = [
    // {
    //   Header: "",
    //   accessor: "id",
    //   cWidth: "1.5px",
    // },
    {
      Header: "Facility UBI",
      accessor: (item) => (
        <Link
          href={`#/facility-list/facility-details/${item?.id}`}
          sx={{ color: "#2C77E9" }}
        >
          {item?.facility_ubi}
        </Link>
      ),
    },
    {
      Header: "Facility Name",
      accessor: (item) => (
        item?.facility_name
        // <Link
        //   href={`#/facility-list/facility-details/${item?.id}`}
        //   sx={{ color: "#2C77E9" }}
        // >
        //   {item?.facility_name}
        // </Link>
      ),
    },
    {
      Header: "Facility Type",
      accessor: "facility_type",
    },
    {
      Header: "Facility Category",
      accessor: "facility_category",
    },
    {
      Header: "Facility Address",
      accessor: (item) => (
        <>
          {" "}
          {item?.address && `${item?.address} ,`}{" "}
          {item?.street_number && `${item?.street_number} `}{" "}
          {item?.street_name && `${item?.street_name} ,`}{" "}
          {item?.sector && `${item?.sector} ,`}{" "}
          {item?.city && `${item?.city} ,`}{" "}
          {item?.province && `${item?.province} ,`}{" "}
          {item?.country && `${item?.country} ,`}{" "}
          {item?.postal_code && `${item?.postal_code} `}
        </>
      ),
    },
   
  ];

  useEffect(() => {
    dispatch(fetchAdminCompanyDetails(id));
  }, [dispatch, id]);

  const companyProfileData = useSelector(
    (state) => state?.adminCompanyReducer?.companyDetails?.company
  );
  const companyUserData = useSelector(
    (state) => state?.adminCompanyReducer?.companyDetails?.user_roles || []
  );
  const companyFacilityData = useSelector(
    (state) => state?.adminCompanyReducer?.companyDetails?.facilities || []
  );
  const loadingState = useSelector(
    (state) => state?.adminCompanyReducer?.loading
  );

  const filterActiveFacility = companyFacilityData.filter(
    (item) => item?.is_active === 1
  );

  return (
    <Container>
      <Grid container mb={4} alignItems="center">
        <IconButton
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            marginRight: "1rem",
          }}
          textAlign="center"
          onClick={() => navigate("/companies")}
        >
          <ArrowBackIcon
            sx={{
              color: "#fff",
              fontSize: "1.25rem",
            }}
          />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ fontSize: "1.5rem", color: "text.secondary2" }}
        >
          Company Details
        </Typography>
      </Grid>
      <Grid
        container
        gap={"2rem"}
        wrap="nowrap"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Grid container item sx={{ flex: "1", gap: "1.5rem" }}>
          <Grid
            container
            columnGap={"1rem"}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="nowrap"
          >
            <Grid item>
              <Typography variant="h4">
                {companyProfileData?.company_name}
              </Typography>
              <Typography variant="p">
                {companyProfileData?.website || ""}
              </Typography>
            </Grid>
          </Grid>

          <Box display={"flex"} flexDirection={"column"} gap={"3.25rem"}>
            <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
              <List
                disablePadding
                sx={{
                  display: "flex",
                  width: "auto",
                  flexWrap: "wrap",
                  gap: "1.44rem",
                }}
                className="profileLists"
              >
                {companyProfileData?.unit_number && (
                  <MicroStyledListItemComponent
                    primary="Unit number"
                    secondary={companyProfileData?.unit_number}
                  />
                )}
                {companyProfileData?.street_number && (
                  <MicroStyledListItemComponent
                    primary="Street number"
                    secondary={companyProfileData?.street_number}
                  />
                )}
                {companyProfileData?.street_name && (
                  <MicroStyledListItemComponent
                    primary="Street name"
                    secondary={companyProfileData?.street_name}
                  />
                )}
                {companyProfileData?.city && (
                  <MicroStyledListItemComponent
                    primary="City"
                    secondary={companyProfileData?.city}
                  />
                )}
                {companyProfileData?.state && (
                  <MicroStyledListItemComponent
                    primary="Province/state"
                    secondary={companyProfileData?.state}
                  />
                )}

                {companyProfileData?.country && (
                  <MicroStyledListItemComponent
                    primary="Country"
                    secondary={companyProfileData?.country}
                  />
                )}
                {companyProfileData?.postal_code && (
                  <MicroStyledListItemComponent
                    primary="Zip code/Postal code"
                    secondary={companyProfileData?.postal_code}
                  />
                )}
                {/* {companyProfileData?.portal_agreement_accepted && ( */}
                <MicroStyledListItemComponent
                  primary="PA"
                  secondary={
                    // <Link
                    //   href={`#/companies/company-agreement/${id}`}
                    //   target="_self"
                    //   sx={{
                    //     color: "#2C77E9!important",
                    //     textDecoration: "none",
                    //   }}
                    // >
                    //   Link to PA
                    // </Link>
                     <MuiLink
                     component={RouterLink}
                     to= {`/companies/company-agreement/${id}`}
                     state= {{returnPageURL: `/companies/company-profile/${id}` }}
                     sx={{ color: "#2C77E9 !important", textDecoration: "none", }}
                     target="_self"
                   >
                     link to  PA
                   </MuiLink>
                  }
                />
                {/* )} */}
              </List>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, overflowX: "scroll" }}>
        <CustomAccordion
          summary="User"
          panelId="user"
          details={
            <Grid container xs={12} md={8}>
              <MiniTable columns={userColumn} data={companyUserData} />
            </Grid>
          }
          expanded={expanded}
          onChange={handleAccordionChange}
        />
        <CustomAccordion
          summary="Facility"
          panelId="facility"
          details={
            <Grid container>
              <MiniTable columns={facilityColumn} data={filterActiveFacility?.length ? filterActiveFacility : []} />
            </Grid>
          }
          expanded={expanded}
          onChange={handleAccordionChange}
        />
      </Box>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </Container>
  );
};

export default CompanyProfile;
