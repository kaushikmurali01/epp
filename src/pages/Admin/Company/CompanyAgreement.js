import {
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CompanyAgreementContent from "sections/Admin/CompanyManagement/CompanyAgreementContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

const CompanyAgreement = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const getParams = useLocation();


  return (
    <Container>
      <Box>
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
            onClick={() => navigate(getParams.state?.returnPageURL)}
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
            Participant Agreement
          </Typography>
        </Grid>
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
