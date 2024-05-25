import { Typography, Box, styled, Stack, Link } from "@mui/material";
import useMediaQueries from "utils/mediaQueries/mediaQueries";
import { useEffect, useRef, useState } from "react";
import { PDFDisplay } from "components/pdfDisplay";
import { PDFContent } from "./PDFContent";

const StyledContentWrapper = styled(Box)(() => {
  const { getTheme } = useMediaQueries();

  return {
    position: "relative",
    padding: "1rem",
    background: "#F5FFF7",
    borderRadius: "1.25rem",
    border: "1px solid #2E813E",
    maxHeight: "150dvh",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
      marginTop: '10px',
     marginBottom: '10px',
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#348d3d99",
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

const ParticipantAgreementContent = ({ onScrollToBottom, pdfUrl }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = contentRef.current;
      console.log("scroll items", scrollTop, clientHeight, scrollHeight, scrollTop + clientHeight)
      if (Math.abs(scrollTop + clientHeight - scrollHeight) <= 10) {
        onScrollToBottom(true);
      } else {
        onScrollToBottom(false);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);

      return () => {
        contentElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [onScrollToBottom]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "2rem",
      }}
    >
      <StyledContentWrapper ref={contentRef}>
        
        <PDFDisplay pdfUrl={pdfUrl}/>
        {/* <PDFContent /> */}
      </StyledContentWrapper>
    </Box>
  );
};

export default ParticipantAgreementContent;
