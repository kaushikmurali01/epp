import * as React from "react";
import logo from "../../assets/images/logo.svg";
import { logoStyle } from "../../styles/commonStyles";
import { Grid, Box, Container, Link, Typography, Stack } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="small" component='small'  color="dark.light" sx={{ fontWeight: '300'}}>
      {"Copyright © "}
      {new Date().getFullYear()}
      {" Enerva Energy Solutions Inc. All Rights Reserved"}
    </Typography>
  );
}

const footerContentRow = {
  display:'flex', 
  flexDirection: 'column',
  width: { sm: 'calc(100% - 8rem)', lg: 'calc(100% - 8rem)'},
  paddingLeft: { sm: '1rem', lg : '7.25rem' }
}

export default function Footer() {
  return (
    <Box component='footer' sx={{borderTop: '1px solid #ccc'}}>
      {/* Blank div for white space */}
      {/* <Stack direction='row' sx={{ minHeight: {xs: '4rem', lg: '6rem'}, backgroundColor: '#fff', borderBottom: '1px solid #ccc'}}>
      </Stack> */}

      <Stack direction="row" sx={{ padding: {md: '2rem', xs : '1.5rem 0'} }}>
        <Container maxWidth="lg">
          <Grid container >
            <Grid item sx={{ width: '8rem', display: {sm: 'flex'} , alignItems: { sm :'center'}, marginBottom: {xs: '1rem', sm: '0'} }}>
              <figure>
                <img src={logo} style={logoStyle} alt="logo" />
              </figure>
            </Grid>
            <Grid  sx={{...footerContentRow }}>
              <Grid item>
                <Typography
                  variant="body2"
                  color="dark.light"
                  mb={2}
                  sx={{ width: "100%" }}
                >
                  This save on Energy program is delivered by Enerva and brought to
                  you by the Independent System Operator. Subject to additional terms
                  & conditions found at <Link href="#" sx={{ textDecoration: "none" }} color="blue.main">
                    SaveOnEnergy.ca
                  </Link>
                </Typography>
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Copyright />
                <Link color="text.primary" href="#" sx={{ textDecoration: "none", color: 'blue.main' }}>
                  Privacy
                </Link>
              </Grid>
            </Grid>
          </Grid>
          </Container>
        </Stack>
       
      
    </Box>
  );
}
