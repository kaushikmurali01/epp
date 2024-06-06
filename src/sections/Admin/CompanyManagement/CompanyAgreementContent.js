import { Box, Typography, styled, useMediaQuery, Button } from "@mui/material";
import { PDFDisplay } from "components/pdfDisplay";
import { PA_MANAGEMENT } from "constants/apiEndPoints";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_REQUEST } from "utils/HTTPRequests";
import { parseUTCDateToLocalDate } from "utils/dateFormat/ConvertIntoDateMonth";
import NotificationsToast from "utils/notification/NotificationsToast";

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
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
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

  const onDownloadSignedPA = () => {
    if(!PAData.signed_doc){
      NotificationsToast({ message: "There is no signed participant agreement exist for you!", type: "error" });

    } else {
      fetch(PAData.signed_doc).then((response) => {
        response.blob().then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement("a");
          alink.href = fileURL;
          let fileName = PAData?.company_name + "_signed_participant_agreement.pdf"
          alink.download = fileName;
          alink.click();
        });
      });
    }
    
  }

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
            The company {PAData?.company_name} has not signed participant
            agreement yet.
          </Typography>
        )}
      </StyledContentWrapper>
      {PAData?.is_signed ? 
       <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: "2rem",
            flexDirection: `${isSmallScreen ? "column" : "row"}`,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
          <Typography variant="h6" ml={2} mr={2}>
            Signed by: {PAData?.signed_by?.first_name}
          </Typography>
          <Typography variant="h6" ml={2} mr={2}>
            Signed on: {parseUTCDateToLocalDate(PAData?.signed_on)}
          </Typography>
        </Box>
        {PAData?.is_signed ? <Button
          sx={{ fontSize: "1rem", marginTop: isSmallScreen ? 2 : 0 }}
          onClick={onDownloadSignedPA}
        >
          {PAData?.is_signed ? 'Download signed participant agreement' : 'Download as PDF'}
        </Button> : null}
        </Box> : null}
    </Box>
  );
};

export default CompanyAgreementContent;
