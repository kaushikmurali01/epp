import { Box, styled } from "@mui/material";
import { PDFDisplay } from "components/pdfDisplay";

const StyledContentWrapper = styled(Box)(() => {
  return {
    position: "relative",
    padding: "1rem",
    background: "#F5FFF7",
    borderRadius: "1.25rem",
    border: "1px solid #2E813E",
    maxHeight: "65dvh",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#348D3D60",
      borderRadius: "1.375rem",
      "&:hover": {
        backgroundColor: "#348D3D",
      },
    },
    "&:hover ::-webkit-scrollbar": {
      display: "block",
    },
  };
});

const CompanyAgreementContent = ({ pdfUrl }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "2rem",
      }}
    >
      <StyledContentWrapper>
        <PDFDisplay pdfUrl={pdfUrl} />
      </StyledContentWrapper>
    </Box>
  );
};

export default CompanyAgreementContent;
