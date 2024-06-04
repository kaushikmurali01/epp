import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Loader({fallBackLoader, sectionLoader, minHeight, customStyles }) {
  // sectionLoader is for circular loader 
  // the Loader Box's min height will be sent via prop "minHeight" so that For a particular section we can show this loader

  const show_loader = useSelector((state) => state?.loaderReducer?.show_loader);

  const displayType = sectionLoader ? "flex" : "block";

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
          minHeight={sectionLoader ? minHeight : "auto"}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            zIndex: "999999",
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(255,255,255,0.4)",
            ...customStyles,
          }}
        >
          {sectionLoader ? (
            <CircularProgress color="success" />
          ) : (
            <LinearProgress color="success" />
          )}
        </Box>
      )}
    </>
  );
}