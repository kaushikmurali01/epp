import React from "react";
import {
  Box,
  LinearProgress,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function Loader({
  fallBackLoader,
  sectionLoader,
  minHeight,
  loadingState,
  customStyles,
  loaderPosition = "absolute",
  textLoader,
  loaderText = "Loading",
  customLoaderText,
}) {
  // sectionLoader is for circular loader
  // the Loader Box's min height will be sent via prop "minHeight" so that For a particular section we can show this loader
  // loaderPosition to change the Position of section loader, if "fixed" then loader will work on whole page, and if "absolute" then it will work for that section only

  const reduxLoaderState = useSelector(
    (state) => state?.loaderReducer?.show_loader
  );

  const show_loader = loadingState || reduxLoaderState;

  const displayType = sectionLoader || textLoader ? "flex" : "block";

  return (
    <>
      {fallBackLoader ? (
        <Box
          sx={{
            display: "block",
            width: "100%",
            zIndex: "999999",
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(255,255,255,0.4)",
          }}
        >
          <LinearProgress color="success" />
        </Box>
      ) : (
        <Box
          display={show_loader ? displayType : "none"}
          minHeight={sectionLoader || textLoader ? minHeight : "auto"}
          position={loaderPosition}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            zIndex: "999999",
            top: "0",
            left: 0,
            background: "rgba(255,255,255,0.4)",
            ...customStyles,
          }}
        >
          {textLoader ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                marginTop: "1rem",
                marginInline: "1rem",
                justifyContent: "center",
                padding: "2rem",
                background: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                maxWidth: "45rem",
              }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  marginRight: "1rem",
                  fontWeight: 700,
                }}
              >
                {customLoaderText
                  ? customLoaderText
                  : `Be patient, ${loaderText} is in process`}
              </Typography>
              <div className="progress-loader"></div>
            </Box>
          ) : sectionLoader ? (
            <CircularProgress color="success" />
          ) : (
            <LinearProgress color="success" />
          )}
        </Box>
      )}
    </>
  );
}
