import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, List } from "@mui/material";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminCompanyDetails } from "../../../redux/admin/actions/adminCompanyAction";
import { useParams } from "react-router-dom";
import { userTypes } from "constants/allDefault";

const CompanyProfile = () => {
  const tabStyle = {
    width: "max-content",
    padding: "0.375rem 1rem",
    borderRadius: "138.875rem",
    border: "1px solid #D0D0D0",
    background: "#EBEBEB",
    color: "#696969",
    fontSize: "0.875rem !important",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchAdminCompanyDetails(id));
  }, [dispatch, id]);

  const companyProfileData = useSelector(
    (state) => state?.adminCompanyReducer?.companyDetails?.data
  );
  const getCompanyType = (type) => {
    const companyType = userTypes.find((company) => company.id === type);
    return companyType ? companyType.userType : "";
  };
  return (
    <Container>
      <Typography
        variant="h4"
        fontWeight={"700"}
        marginBlockEnd={"3rem"}
        display={"flex"}
        alignItems={"center"}
      >
        Company Details
      </Typography>

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
        <Grid
          container
          item
          sx={{
            width: "auto",
            flex: "none",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "12.5rem",
              height: "12.5rem",
              maxWidth: "100%",
              aspectRatio: 1,
              borderRadius: "100%",
            }}
            src={companyProfileData?.profile_pic}
            alt="company-profile"
          />
        </Grid>

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
              <Typography variant="h3">
                {(companyProfileData?.first_name || "") +
                  " " +
                  (companyProfileData?.last_name || "")}
              </Typography>
              <Typography variant="h6">
                Role: {companyProfileData?.role_name || ""}
              </Typography>
            </Grid>
          </Grid>

          <Box display={"flex"} flexDirection={"column"} gap={"3.25rem"}>
            <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
              <Typography variant="h6" sx={tabStyle}>
                Company details
              </Typography>
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
                {companyProfileData?.landline && (
                  <MicroStyledListItemComponent
                    primary="Business mobile"
                    secondary={companyProfileData?.landline}
                  />
                )}
                {companyProfileData?.email && (
                  <MicroStyledListItemComponent
                    primary="Business email"
                    secondary={companyProfileData?.email}
                  />
                )}
                {companyProfileData?.company_name && (
                  <MicroStyledListItemComponent
                    primary="Company name"
                    secondary={companyProfileData?.company_name}
                  />
                )}
                {companyProfileData?.company_type && (
                  <MicroStyledListItemComponent
                    primary="Company type"
                    secondary={getCompanyType(companyProfileData?.company_type)}
                  />
                )}
                {companyProfileData?.website && (
                  <MicroStyledListItemComponent
                    primary="Company url"
                    secondary={companyProfileData?.website}
                  />
                )}
              </List>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyProfile;
