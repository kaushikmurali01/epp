import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import CompanyAgreementContent from "sections/Admin/CompanyManagement/CompanyAgreementContent";

const CompanyAgreement = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Container>
      <Box>
        <Typography
          variant="h4"
          sx={{
            textAlign: `${isSmallScreen ? "center" : ""}`,
            fontSize: "1.5rem",
            color: "text.secondary2",
            fontWeight: "700",
            marginBottom: "0.75rem",
          }}
        >
          Participant Agreement
        </Typography>
      </Box>
      <CompanyAgreementContent />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "2rem",
          flexDirection: `${isSmallScreen ? "column" : "row"}`,
          alignItems: "center",
        }}
      ></Box>
    </Container>
  );
};

export default CompanyAgreement;
