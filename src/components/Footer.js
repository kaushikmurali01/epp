import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import logo from "../assets/images/logo.png";

const logoStyle = {
  width: "100px",
  height: "auto",
  cursor: "pointer",
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      {new Date().getFullYear()}
      {" Enerva Energy Solutions Inc. All Rights Reserved"}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        py: 4,
      }}
      maxWidth="lg"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 4, sm: 10 },
            width: "100%",
          }}
        >
          <Box sx={{ ml: "-15px" }}>
            <img src={logo} style={logoStyle} alt="logo" />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ width: "100%" }}
          >
            This save on Energy program is delivered by Enerva and brought to
            you by the Independent System Operator. Subject to additional terms
            & conditions found at
            <Link href="#" sx={{ textDecoration: "none" }} color="text.primary">
              &nbsp;SaveOnEnergy.ca&nbsp;
            </Link>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 4,
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 4,
        }}
      >
        <Copyright />
        <Link color="text.primary" href="#" sx={{ textDecoration: "none" }}>
          Privacy
        </Link>
      </Box>
    </Container>
  );
}
