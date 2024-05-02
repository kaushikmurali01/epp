import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import React from "react";

const EnergyAndWater = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const initialValues = {};

  const handleSubmit = (values) => {};

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Formik
        initialValues={{ ...initialValues }}
        // validationSchema={validationSchemaFacilityEnergyAndWater}
        onSubmit={handleSubmit}
      >
        <Form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            <Box
              sx={{
                cursor: "default",
                borderRadius: "2rem",
                background: "#EBEBEB",
                border: "1px solid #D0D0D0",
                textWrap: "nowrap",
                padding: "0.375rem 1rem",
              }}
            >
              <Typography variant="small">Characterstics</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: isSmallScreen && "1.5rem",
              }}
            >
              <Box
                sx={{
                  cursor: "default",
                  borderRadius: "2rem",
                  background: "#D8FFDC",
                  textWrap: "nowrap",
                  padding: "0.375rem 1rem",
                }}
              >
                <Typography variant="small">
                  status:{" "}
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Draft
                  </Typography>
                </Typography>
              </Box>
              <Button variant="contained" sx={{ marginLeft: "2rem" }}>
                Save
              </Button>
            </Box>
          </Box>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}></Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EnergyAndWater;
