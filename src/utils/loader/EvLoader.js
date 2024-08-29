import * as React from "react";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

 const EvLoader = () => {
 
  const reduxLoaderState = useSelector(
    (state) => state?.loaderReducer?.ev_pageLoader
  );

  const show_loader =  reduxLoaderState;


  return (
    <>
      <Box   
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: '100vh',
            zIndex: "999999",
            top: "0",
            left: 0,
            background: "rgba(255,255,255,0.4)",
            position: 'fixed',
            display: show_loader ? "flex" : "none",
          }}
        >
         <CircularProgress color="success" />
        </Box>
    </>
  );
}

export default EvLoader;