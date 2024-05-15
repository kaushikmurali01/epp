import { Box, Typography, styled } from "@mui/material";
import { PDFDisplay } from "components/pdfDisplay";
import { PA_MANAGEMENT } from "constants/apiEndPoints";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_REQUEST } from "utils/HTTPRequests";

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

const CompanyAgreementContent = () => {
  const { id } = useParams();
  const [PAData, setPAData] = useState({
    company_id: id,
    unsigned_doc:
      "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf",
    upload_sign: null,
    is_signed: false,
    signed_doc: null,
    status: null,
    signed_on: "",
    is_active: 1,
    created_by: null,
    updated_by: null,
    company_name: null,
  });
  useEffect(() => {
    getParticipantAgreementData();
  }, []);

  const getParticipantAgreementData = () => {
    const apiURL = PA_MANAGEMENT.CREATE_PA;
    GET_REQUEST(apiURL + `/${id}`)
      .then((res) => {
        setPAData((prevState) => {
          return {
            ...prevState,
            ...res?.data?.data,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        {PAData?.is_signed ? (
          <PDFDisplay pdfUrl={PAData?.is_signed && PAData?.signed_doc} />
        ) : (
          <Typography>
            The company {PAData?.company_name} has not signed paticipant
            agreement yet.
          </Typography>
        )}
      </StyledContentWrapper>
    </Box>
  );
};

export default CompanyAgreementContent;
