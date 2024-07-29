import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  setOption,
  setOption2,
} from "../../../redux/superAdmin/actions/simpleActions";
import {
  Box,
  Container,
  Grid,
  Typography,
  InputLabel,
  Slider,
  IconButton,
} from "@mui/material";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import { validationSchemaAddFacility } from "../../../utils/validations/formValidation";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { uploadFileEndPoints } from "constants/endPoints";
import axios from "axios";
import {
  USER_MANAGEMENT,
  WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS,
  adminFacilityEndpoints,
  facilityEndPoints,
  imageUploadEndPoints,
} from "constants/apiEndPoints";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import SliderWrapper from "components/FormBuilder/Slider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "pages/Loader";

let OpenLocationCode = require("open-location-code").OpenLocationCode;
let openLocationCode = new OpenLocationCode();

const marksForEnergyTarget = [
  {
    value: 5,
    label: "5 %",
  },
  {
    value: 100,
    label: "100 %",
  },
];

const AdminAddFacilityComponent = (props) => {
  const [imgUrl, setImgUrl] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const uploadLoadingState = useSelector(
    (state) => state?.fileUploadReducer?.loading
  );
  const [initialValues, setInitialValues] = useState({
    facility_construction_status: "Existing Building",
    facility_name: "",
    naic_code: "",
    facility_category: "",
    facility_type: "",
    target_saving: "5",
    unit_number: "",
    street_number: "",
    street_name: "",
    city: "",
    province: "Ontario",
    country: "Canada",
    postal_code: "",
  });

  // const buildingFacilitystr =
  //     "Is . the building/facility in the tariff class GS > 50KW?*";

  // const FacilityConstructionStatusArray = [
  //     {
  //         id: 1,
  //         name: "Existing Building",
  //         label: "Existing Building",
  //         value: "Existing Building"
  //     },
  // ];

  // const FacilityTypeArray = [
  //     {
  //         id: 1,
  //         name: "Multi-Residential - Apartment",
  //         label: "Multi-Residential - Apartment",
  //         value: "Multi-Residential - Apartment",
  //     },
  //     {
  //         id: 2,
  //         name: "Multi-Residential – Condominium",
  //         label: "Multi-Residential – Condominium",
  //         value: "Multi-Residential – Condominium",
  //     },
  //     {
  //         id: 1,
  //         name: "Multi-Residential – Other",
  //         label: "Multi-Residential – Other",
  //         value: "Multi-Residential – Other",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Food Retail/Grocery",
  //         label: "Commercial – Food Retail/Grocery",
  //         value: "Commercial – Food Retail/Grocery",
  //     },
  //     {
  //         id: 1,
  //         name: "Commercial – Non-Food Retail",
  //         label: "Commercial – Non-Food Retail",
  //         value: "Commercial – Non-Food Retail",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Office",
  //         label: "Commercial – Office",
  //         value: "Commercial – Office",
  //     },
  //     {
  //         id: 1,
  //         name: "Commercial - Hotel",
  //         label: "Commercial - Hotel",
  //         value: "Commercial - Hotel",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Accommodation",
  //         label: "Commercial – Accommodation",
  //         value: "Commercial – Accommodation",
  //     },
  //     {
  //         id: 1,
  //         name: "Commercial – Hospitality",
  //         label: "Commercial – Hospitality",
  //         value: "Commercial – Hospitality",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Entertainment",
  //         label: "Commercial – Entertainment",
  //         value: "Commercial – Entertainment",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Long Term Care",
  //         label: "Commercial – Long Term Care",
  //         value: "Commercial – Long Term Care",
  //     },
  //     {
  //         id: 2,
  //         name: "Commercial – Other",
  //         label: "Commercial – Other",
  //         value: "Commercial – Other",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional – School",
  //         label: "Institutional – School",
  //         value: "Institutional – School",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional – University",
  //         label: "Institutional – University",
  //         value: "Institutional – University",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional – Hospital",
  //         label: "Institutional – Hospital",
  //         value: "Institutional – Hospital",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional – Municipal Office/Library",
  //         label: "Institutional – Municipal Office/Library",
  //         value: "Institutional – Municipal Office/Library",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional – Recreational/Community Centre",
  //         label: "Institutional – Recreational/Community Centre",
  //         value: "Institutional – Recreational/Community Centre",
  //     },
  //     {
  //         id: 2,
  //         name: "Institutional - Other",
  //         label: "Institutional - Other",
  //         value: "Institutional - Other",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial – Manufacturing/Assembly",
  //         label: "Industrial – Manufacturing/Assembly",
  //         value: "Industrial – Manufacturing/Assembly",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial - Chemical Processing",
  //         label: "Industrial - Chemical Processing",
  //         value: "Industrial - Chemical Processing",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial – Forestry",
  //         label: "Industrial – Forestry",
  //         value: "Industrial – Forestry",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial – Raw Material Refining",
  //         label: "Industrial – Raw Material Refining",
  //         value: "Industrial – Raw Material Refining",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial – Mining",
  //         label: "Industrial – Mining",
  //         value: "Industrial – Mining",
  //     },
  //     {
  //         id: 2,
  //         name: "Industrial - Other",
  //         label: "Industrial - Other",
  //         value: "Industrial - Other",
  //     },
  // ];

  // const FacilityCategoryArray = [
  //     { id: 1, name: "Commercial", label: "Commercial", value: "Commercial" },
  //     {
  //         id: 2,
  //         name: "Institutional",
  //         label: "Institutional",
  //         value: "Institutional",
  //     },
  //     {
  //         id: 3,
  //         name: "Multi-Family",
  //         label: "Multi-Family",
  //         value: "Multi-Family",
  //     },
  //     { id: 4, name: "Industrial", label: "Industrial", value: "Industrial" },
  // ];

  // const FacilityEnergySavingArray = [
  //     { id: 1, name: "Saving 1", label: "Saving 1", value: "Saving 1" },
  //     { id: 2, name: "Saving 2", label: "Saving 2", value: "Saving 2" },
  // ];

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoriesTypesAndNAICS, setCategoriesTypesAndNAICS] = useState([]);
  const [facilityCategories, setFacilityCategories] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [sliderValue, setSliderValue] = useState(1);

  useEffect(() => {
    getCategoriesTypesAndNAICS();
    getCompanyListData();
  }, []);

  useEffect(() => {
    const distinctCategories = [
      ...new Set(
        categoriesTypesAndNAICS.map((obj) => {
          return obj["facility_category"] != ""
            ? obj["facility_category"]
            : null;
        })
      ),
    ]
      .filter((c) => c != null)
      .map((element, index) => {
        return { id: element, name: element, label: element, value: element };
      });
    setFacilityCategories(distinctCategories);
  }, [categoriesTypesAndNAICS]);

  useEffect(() => {
    if (facilityCategories.length > 0 && id) {
      getFacilityDetailsById();
    }
  }, [facilityCategories]);

  const getFacilityType = (value, formValues, isReset) => {
    const facilitiesType = [...categoriesTypesAndNAICS]
      .map((item) => {
        return item["facility_category"] == value ? item : null;
      })
      .filter((c) => c != null)
      .map((element, index) => {
        return {
          id: element["facility_type"],
          name: element["facility_type"],
          label: element["facility_type"],
          value: element["facility_type"],
        };
      });
    setFacilityTypes(facilitiesType);
    if (!isReset) {
      setInitialValues((prevValues) => {
        return {
          ...formValues,
          facility_category: value,
          facility_type: "",
          naic_code: "",
        };
      });
    }
  };

  const getNAICS = (value, formValues) => {
    const NAICS = [...categoriesTypesAndNAICS]
      .map((item) => {
        return item["facility_type"] == value ? item : null;
      })
      .filter((c) => c != null)
      .map((element, index) => {
        return {
          id: element["naic_code"],
          name: element["naic_code"],
          label: element["naic_code"],
          value: element["naic_code"],
        };
      });
    setInitialValues((prevValues) => {
      return {
        ...formValues,
        facility_type: value || "",
        naic_code: NAICS[0]?.value || "",
      };
    });
  };

  const getCategoriesTypesAndNAICS = () => {
    GET_REQUEST(facilityEndPoints.GET_CATEGORIES_TYPES_AND_NAICS)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setCategoriesTypesAndNAICS(response.data.data);
        }
      })
      .catch((error) => {});
  };

  const getFacilityDetailsById = () => {
    GET_REQUEST(facilityEndPoints.GET_FACILITY_BY_ID + "/" + id)
      .then((response) => {
        if (response.data.statusCode == 200) {
          if (response.data.data.facility_construction_status == 1) {
            response.data.data.facility_construction_status =
              "Existing Building";
          }

          // } else if (response.data.data.facility_construction_status == 2) {
          //     response.data.data.facility_construction_status = 'New';
          // }
          setInitialValues((prevValues) => {
            getFacilityType(
              response?.data?.data?.facility_category,
              response.data.data,
              true
            );
            return {
              ...prevValues,
              ...response.data.data,
            };
          });
          setSelectedFile(
            response.data.data.display_pic_url
              ? response.data.data.display_pic_url
              : ""
          );
        }
      })
      .catch((error) => {});
  };

  const handleButtonClick = () => {
    // Trigger the click event on the hidden file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      if (!allowedFileTypes.includes(fileType)) {
        NotificationsToast({
          message: "Only jpg, jpeg, and png files are allowed!",
          type: "error",
        });
        return;
      }

      if (fileSizeInMB <= 5) {
        setSelectedFile(URL.createObjectURL(selectedFile));
        dispatch(fileUploadAction(selectedFile))
          .then((data) => setImgUrl(data?.sasTokenUrl))
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      } else {
        NotificationsToast({
          message: "File size should be less than 5mb!",
          type: "error",
        });
      }
    }
  };

  const userCompanyId = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.company_id
  );

  const handleSubmit = (values) => {
    delete values.facility_id_submission_status;

    const query =
      values?.unit_number +
      ", " +
      values?.street_number +
      " " +
      values?.street_name +
      ", " +
      values?.city +
      ", " +
      values?.province +
      " " +
      values?.postal_code +
      ", " +
      values?.country;
    const api_key = process.env.REACT_APP_AZURE_MAPS_SECRET_KEY;
    const apiURL = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${api_key}&query=${query}`;

    GET_REQUEST(apiURL)
      .then((response) => {
        const code = openLocationCode.encode(
          parseFloat(response?.data?.results[0]?.position?.lat),
          parseFloat(response?.data?.results[0]?.position?.lon)
        );

        const newValues = {
          ...values,
          display_pic_url: imgUrl,
          facility_ubi: code,
          latitude: parseFloat(response?.data?.results[0]?.position?.lat),
          longitude: parseFloat(response?.data?.results[0]?.position?.lon),
        };

        if (newValues.facility_construction_status == "Existing Building") {
          newValues.facility_construction_status = 1;
        }

        console.log(newValues, "check New values");
        // return;

        if (!id) {
          setLoadingState(true);
          POST_REQUEST(
            adminFacilityEndpoints.ADMIN_ADD_EDIT_FACILITY,
            newValues
          )
            .then((response) => {
            //   if (response?.data?.data) {
            //     const myDataToSend = {
            //       start_year: "2023",
            //       end_year: "2024",
            //       start_month: "1",
            //       end_month: "12",
            //       facility_id: response?.data && response?.data?.data?.id,
            //     };
            //     POST_REQUEST(
            //       WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.INSERT_WEATHER_DATA,
            //       myDataToSend
            //     );
            //   }
              setLoadingState(false);
              NotificationsToast({
                message: "Facility added successfully!",
                type: "success",
              });
              navigate(
                `/facility-list/facility-details/${response?.data?.data?.id}`
              );
            })
            .catch((error) => {
              setLoadingState(false);
              NotificationsToast({
                message: error?.message
                  ? error.message
                  : "Something went wrong!",
                type: "error",
              });
            });
        } else {
          setLoadingState(true);
          PATCH_REQUEST(
            adminFacilityEndpoints.ADMIN_ADD_EDIT_FACILITY + "/" + id,
            newValues
          )
            .then((response) => {
              if (response) {
                // const myDataToSend = {
                //   start_year: "2023",
                //   end_year: "2024",
                //   start_month: "1",
                //   end_month: "12",
                //   facility_id: id,
                // };
                // POST_REQUEST(
                //   WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.INSERT_WEATHER_DATA,
                //   myDataToSend
                // );
                navigate(
                  `/facility-list/facility-details/${response?.data?.data?.id}`
                );
              }
              setLoadingState(false);
              NotificationsToast({
                message: "Facility updated successfully!",
                type: "success",
              });
              // navigate(`/facility-list/facility-details/${id}`)
            })
            .catch((error) => {
              setLoadingState(false);
              NotificationsToast({
                message: error?.message
                  ? error.message
                  : "Something went wrong!",
                type: "error",
              });
            });
        }
      })
      .catch((error) => console.log(error));
  };

  const deletePicture = () => {
    setSelectedFile("");
  };

  const getCompanyListData = () => {
    GET_REQUEST(USER_MANAGEMENT.GET_DROPDOWN_COMPANY_LIST)
      .then((response) => {
        if (response.data.status == 204) {
          setCompanyData(response.data.data);
        }
      })
      .catch((error) => {});
  };

  const backToFacility = () => {
    navigate(-1);
  };

  return (
    <>
      <Container my={4} sx={{ marginTop: "50px" }}>
        <Grid container className="heading-row">
          <Grid container item xs={10}>
            {id ? (
              <IconButton
                sx={{
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                  marginRight: "1rem",
                }}
                onClick={backToFacility}
              >
                <ArrowBackIcon
                  sx={{
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                />
              </IconButton>
            ) : (
              ""
            )}
            <Typography sx={{ fontWeight: "600", fontSize: "24px" }}>
              {id ? "Edit Facility" : "Add Facility"}
            </Typography>
          </Grid>
          <Grid container item xs={2}>
            {id ? (
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid #D8FFDC",
                  backgroundColor: "#D8FFDC",
                  padding: "0 16px",
                  borderRadius: "10px",
                  width: "200px",
                  height: "38px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#54585A",
                    fontWeight: "400",
                    fontSize: "12px",
                  }}
                >
                  Status:
                </Typography>
                <Typography
                  sx={{
                    color: "#348D3D",
                    fontWeight: "500",
                    fontSize: "18px",
                    marginLeft: "5px",
                  }}
                >
                  Existing
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid #FEFFE6",
                  backgroundColor: "#FEFFE6",
                  padding: "0 16px",
                  borderRadius: "10px",
                  width: "200px",
                  height: "38px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#54585A",
                    fontWeight: "400",
                    fontSize: "12px",
                  }}
                >
                  Status:
                </Typography>
                <Typography
                  sx={{
                    color: "#348D3D",
                    fontWeight: "500",
                    fontSize: "18px",
                    marginLeft: "5px",
                  }}
                >
                  Draft
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Typography
          my={4}
          sx={{
            color: "#696969",
            fontWeight: "bold",
            fontSize: "14px",
            // border: "1px solid #D0D0D0",
            // backgroundColor: "#EBEBEB",
            // padding: "4px 16px",
            // borderRadius: "10px",
            // width: "175px",
            // height: "38px",
          }}
        >
          Facility Details
        </Typography>

        <Formik
          initialValues={{ ...initialValues }}
          validationSchema={validationSchemaAddFacility}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={4}>
                  {/* <SelectBox
                                        name="facility_construction_status"
                                        label="Facility construction status*"
                                        options={FacilityConstructionStatusArray}
                                    /> */}
                  <InputField
                    name="facility_construction_status"
                    label="Facility construction status*"
                    type="text"
                    isDisabled={true}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    name="facility_name"
                    label="Facility name*"
                    type="text"
                  />
                </Grid>
              </Grid>

              {/* <Grid item xs={12} sm={12} my={2}>
                                <InputLabel sx={{ color: '#2E813E' }}>{buildingFacilitystr}</InputLabel>
                                <Box sx={{ display: 'flex' }} my={2}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: '600', fontSize: '14px', width: '57px', height: '32px', backgroundColor: '#2E813E', borderRadius: '8px 0px 0px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        Yes
                                    </Typography>
                                    <Typography sx={{ color: '#000000', fontWeight: '600', fontSize: '14px', width: '57px', height: '32px', backgroundColor: '#E9E9E9', borderRadius: '0px 8px 8px 0px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        No
                                    </Typography>
                                </Box>
                            </Grid> */}

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="facility_category"
                    label="Facility category*"
                    options={facilityCategories || []}
                    onChange={(e) => {
                      getFacilityType(e.target.value, values);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="facility_type"
                    label="Facility type*"
                    options={facilityTypes || []}
                    onChange={(e) => {
                      getNAICS(e.target.value, values);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    isDisabled={!(values?.facility_type == "Other")}
                    name="naic_code"
                    label="NAIC’s code*"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="company_id"
                    label="Company name*"
                    options={companyData}
                    labelKey="company_name"
                    valueKey="id"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={4}>
                  {/* <InputField
                                    name="target_saving"
                                    label="What is your target energy savings for this facility?*"
                                    type="text"
                                /> */}
                  <Typography
                    my={4}
                    sx={{
                      color: "#696969",
                      fontWeight: "500",
                      fontSize: "0.875rem !important",
                    }}
                  >
                    What is your target energy savings for this facility?
                    <span className="asterisk">*</span>
                  </Typography>
                  <SliderWrapper
                    name="target_saving"
                    min={5}
                    max={100}
                    aria-labelledby="number-slider"
                    valueLabelDisplay="on"
                    marks={marksForEnergyTarget}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12} sx={{ marginTop: "10px" }}>
                {/* <InputLabel sx={{ color: "#2E813E" }}>Facility photo</InputLabel> */}
                <Typography
                  my={4}
                  sx={{
                    color: "#696969",
                    fontWeight: "500",
                    fontSize: "0.875rem !important",
                  }}
                >
                  Facility photo
                </Typography>
                {!selectedFile ? (
                  <>
                    <Typography
                      my={1}
                      sx={{
                        color: "#2E813E",
                        fontWeight: "500",
                        fontSize: "18px",
                        backgroundColor: "#D1FFDA",
                        padding: "6px 34px",
                        borderRadius: "8px",
                        width: "140px",
                        height: "40px",
                      }}
                      onClick={handleButtonClick}
                    >
                      Upload
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/jpg, image/jpeg, image/png"
                    />
                  </>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div>
                      <img
                        src={selectedFile}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <Typography
                        my={1}
                        sx={{
                          color: "#2C77E9",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={handleButtonClick}
                      >
                        Change picture
                      </Typography>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept="image/jpg, image/jpeg, image/png"
                      />
                      <Typography
                        my={1}
                        sx={{
                          color: "#FF5858",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={deletePicture}
                      >
                        Delete picture
                      </Typography>
                    </div>
                  </div>
                )}
              </Grid>

              {/* </Grid> */}

              <Typography
                my={4}
                sx={{
                  color: "#696969",
                  fontWeight: "bold",
                  fontSize: "14px",
                  // border: "1px solid #D0D0D0",
                  // backgroundColor: "#EBEBEB",
                  // padding: "4px 16px",
                  // borderRadius: "10px",
                  // width: "100px",
                  // height: "37px",
                }}
              >
                Address
              </Typography>

              {/* <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={8}>
                                <InputField name="address" label="Address line 1*" type="text" />
                            </Grid>

                        </Grid> */}

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="unit_number"
                    label="Unit number"
                    type="text"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    name="street_number"
                    label="Street number*"
                    type="text"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    name="street_name"
                    label="Street name*"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={3}>
                  <InputField name="city" label="City*" type="text" />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    name="province"
                    label="Province*"
                    type="text"
                    isDisabled={true}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    name="country"
                    label="Country*"
                    type="text"
                    isDisabled={true}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputField
                    name="postal_code"
                    label="Postal code*"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Box mt={4} rowGap={4}>
                <ButtonWrapper
                  type="submit"
                  color="neutral"
                  width="165px"
                  height="48px"
                  onClick={handleSubmit}
                >
                  {id ? "Save" : "Add Facility"}
                </ButtonWrapper>
              </Box>
            </Form>
          )}
        </Formik>
        <Loader
          sectionLoader
          minHeight="100vh"
          loadingState={loadingState || uploadLoadingState}
          loaderPosition="fixed"
        />
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOption: (optionOne) => dispatch(setOption(optionOne)),
  setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(AdminAddFacilityComponent);
