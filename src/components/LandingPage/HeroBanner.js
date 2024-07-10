import React from 'react';
import { Stack, Button, Typography, Box, Container, Grid, Tooltip } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from "@azure/msal-react";
import { loginRequest } from "authConfig";


const HeroBanner = () => {
    const { theme_Md, theme_Sm } = useMediaQueries();
    const {instance} = useMsal();

    const handleRedirect=()=>{
        console.log('redirecting',)
        instance.loginRedirect({
          ...loginRequest,
          // prompt: 'create'
        }).catch((error)=> console.log("error in login redirect", error))
      }
    return (
      <Box id="heroBanner" component={"section"} className="banner-section">
        <Container maxWidth="lg">
          <Grid
            container
            sx={{
              flexDirection: theme_Sm ? "row" : "column-reverse",
              padding: theme_Sm ? "0" : "1rem 0",
            }}
          >
            <Grid item xs={100} sm={5} className="banner-info">
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: theme_Md ? "2.625rem" : "1.875rem",
                }}
              >
                <span>Save Energy. </span>
                <span>Reduce Costs. </span>
                <span>Earn Incentives.</span>
              </Typography>
              <Typography variant="span" gutterBottom>
                Start today with the{" "}
                <Typography variant="strong" component="strong">
                  {" "}
                  Energy Performance Program,
                </Typography>{" "}
                get a free baseline energy model, receive an upfront incentive
                and annually thereafter.
              </Typography>
              <Stack
                direction="row"
                sx={{
                  gap: 3,
                  marginTop: theme_Md ? "3rem" : "2rem",
                  flexWrap: "wrap",
                }}
                className="action-btn"
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleRedirect}
                >
                  Login/Sign up
                </Button>
                <Tooltip title="Learn more about EPP" arrow>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      window.open(
                        "https://saveonenergy.ca/For-Business-and-Industry/Programs-and-incentives/Energy-Performance-Program",
                        "_blank"
                      )
                    }
                  >
                    More details on SaveOnEnergy.ca
                  </Button>
                </Tooltip>
              </Stack>
              {/* <Typography variant='span' className='whats-new'>What's New <img src="/images/landingPage/speak_icon.svg" /></Typography> */}
            </Grid>

            <Grid item xs={100} sm={7}>
              <span className="banner-bg"></span>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}

export default HeroBanner