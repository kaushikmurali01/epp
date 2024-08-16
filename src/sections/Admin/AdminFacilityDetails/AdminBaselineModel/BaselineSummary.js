import { Grid, Typography } from "@mui/material";
import React from "react";
import { summaryAccordionContentStyle } from "./styles";
import { getSummaryDataByMeterType } from ".";

const BaselineSummary = ({ summaryData, meterType }) => {
  const summaryDataByMeterType = getSummaryDataByMeterType(
    summaryData,
    meterType
  );
  return (
    <Grid container display={"grid"}>
      {summaryDataByMeterType?.status === "DRAFT" ? (
        <></>
      ) : (
        <>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Number of observations
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Number of observations"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Coefficient of Determination, R2
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Coefficient of Determination, R2"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Adjusted R2
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {summaryDataByMeterType?.parameter_data?.["Adjusted R2"]}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Root-mean-square error, RMSE R2
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Root-mean-square error, RMSE R2"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Coefficient of variation of RMSE, CV(RMSE)
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Coefficient of variation of RMSE"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Auto correlation function
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Auto correlation function"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                Durbin- Watson (P &gt; 0)
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={summaryAccordionContentStyle}>
                {
                  summaryDataByMeterType?.parameter_data?.[
                    "Durbin-Watson (P>0)"
                  ]
                }
              </Typography>
            </Grid>
          </Grid>{" "}
        </>
      )}
    </Grid>
  );
};

export default BaselineSummary;
