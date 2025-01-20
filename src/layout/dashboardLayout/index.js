import React, { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../../redux/superAdmin/actions/facilityActions";
import TabsSection from "sections/Homepage/TabsSection";
import axiosInstance from "utils/interceptor";
import EvModal from "utils/modal/EvModal";
import { useDispatch } from "react-redux";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Header = lazy(() => import("components/CommonHeader/Header"));
const Footer = lazy(() => import("components/CommonFooter/Footer"));

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //  check permissions 
  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "authentication-modal",
      headerTextStyle: {
        textAlign: "center",
      },
      headerSubTextStyle: "",
      fotterActionStyle: {
        justifyContent: "center",
        gap: "1rem",
        padding: "1rem",
      },
      modalBodyContentStyle: {
        // minHeight: "120px",
        minWidth: { xs: "100%", sm: "450px" },
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        color: "#242424",
        fontSize: "1.5rem",
        textAlign: "center",
      },
    },
    buttonsUI: {
      saveButton: true,
      cancelButton: false,
      // saveButtonName: "Back to dashboard",
      cancelButtonName: "",
      // successButtonStyle: {
      //   backgroundColor: "#2e813e",
      //   "&:hover": { backgroundColor: "#1e6329" },
      //   color: "#fff",
      // },
      cancelButtonStyle: {},
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    // headerText: <img src="/images/icons/iIcon.svg" alt="info" />,
    headerSubText: "",
    // modalBodyContent: "Unauthorized Access!",
    // saveButtonAction: () => handelPermissionCheck(),
    // closeButtonRedirect: "/facility-dashboard",
  });

  const handlePermissionCheck = ()=> {
    console.log('check permission')
    if(localStorage.getItem("selectedCompanyId")){
      dispatch(fetchUserDetails(localStorage.getItem("selectedCompanyId")));
      navigate('/facility-dashboard')
    } else{
      localStorage.setItem("selectedCompanyId", 0)
      dispatch(fetchUserDetails());
      navigate('/facility-dashboard')
    }
    // window.location.reload();
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  }

  const handleRefreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.status === 403) {
          console.log(response, "check api response");
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            buttonsUI: {
              saveButton: true,
              saveButtonName: "Back to dashboard",
              successButtonStyle: {
                backgroundColor: "#2e813e",
                "&:hover": { backgroundColor: "#1e6329" },
                color: "#fff",
              },
            },
            headerText: <img src="/images/icons/iIcon.svg" alt="info" />,
            modalBodyContent: "Unauthorized Access!",
            saveButtonAction: () => handlePermissionCheck(),
            closeButtonRedirect: "/facility-dashboard",
          }));
        } else if (response.data.status === 502) {
          console.log(response, "check api response");
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            buttonsUI: {
              saveButton: true,
              saveButtonName: "Refresh",
              successButtonStyle: {
                backgroundColor: "#2e813e",
                "&:hover": { backgroundColor: "#1e6329" },
                color: "#fff",
              },
            },
            headerText: <img src="/images/icons/iIcon.svg" alt="info" />,
            modalBodyContent:
              "Your internet might be down! Please refresh the page",
            saveButtonAction: () => handleRefreshPage(),
          }));
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="site-container">
        <Header page={"authenticated"} />
        <TabsSection />
        <div className="main-inner-contianer">{children}</div>
        <Footer />
      </div>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </React.Fragment>
  );
};
export default DashboardLayout;
