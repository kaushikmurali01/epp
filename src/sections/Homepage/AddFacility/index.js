import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  setOption,
  setOption2,
} from "../../../redux/superAdmin/actions/simpleActions";
import { Box, Container, Grid, Typography, InputLabel, Slider } from "@mui/material";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import { validationSchemaAddFacility } from "../../../utils/validations/formValidation";
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { uploadFileEndPoints } from "constants/endPoints";
import axios from "axios";
import {
  facilityEndPoints,
  imageUploadEndPoints,
} from "constants/apiEndPoints";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import SliderWrapper from "components/FormBuilder/Slider";

const marksForEnergyTarget = [
  {
    value: 0,
    label: '0 %',
  },
  {
    value: 100,
    label: '100 %',
  },
];

const AddFacilityComponent = (props) => {
  const [imgUrl, setImgUrl] = useState("");

  const [initialValues, setInitialValues] = useState({
    facility_construction_status: "",
    facility_name: "",
    naic_code: "",
    facility_category: "",
    facility_type: "",
    target_saving: "",
    unit_number: "",
    street_number: "",
    street_name: "",
    city: "",
    province: "Ontario",
    country: "Canada",
    postal_code: "",
  });

  const buildingFacilitystr =
    "Is . the building/facility in the tariff class GS > 50KW?*";

  const FacilityConstructionStatusArray = [
    {
      id: 1,
      name: "Existing Building",
      label: "Existing Building",
      value: "Existing Building"
    },
    {
      id: 2,
      name: "New Construction",
      label: "New Construction",
      value: "New Construction",
    },
    {
      id: 3,
      name: "Test Facility",
      label: "Test Facility",
      value: "Test Facility",
    },
  ];

  const FacilityTypeArray = [
    {
      id: 1,
      name: "Multi-Residential - Apartment",
      label: "Multi-Residential - Apartment",
      value: "Multi-Residential - Apartment",
    },
    {
      id: 2,
      name: "Multi-Residential – Condominium",
      label: "Multi-Residential – Condominium",
      value: "Multi-Residential – Condominium",
    },
    {
      id: 1,
      name: "Multi-Residential – Other",
      label: "Multi-Residential – Other",
      value: "Multi-Residential – Other",
    },
    {
      id: 2,
      name: "Commercial – Food Retail/Grocery",
      label: "Commercial – Food Retail/Grocery",
      value: "Commercial – Food Retail/Grocery",
    },
    {
      id: 1,
      name: "Commercial – Non-Food Retail",
      label: "Commercial – Non-Food Retail",
      value: "Commercial – Non-Food Retail",
    },
    {
      id: 2,
      name: "Commercial – Office",
      label: "Commercial – Office",
      value: "Commercial – Office",
    },
    {
      id: 1,
      name: "Commercial - Hotel",
      label: "Commercial - Hotel",
      value: "Commercial - Hotel",
    },
    {
      id: 2,
      name: "Commercial – Accommodation",
      label: "Commercial – Accommodation",
      value: "Commercial – Accommodation",
    },
    {
      id: 1,
      name: "Commercial – Hospitality",
      label: "Commercial – Hospitality",
      value: "Commercial – Hospitality",
    },
    {
      id: 2,
      name: "Commercial – Entertainment",
      label: "Commercial – Entertainment",
      value: "Commercial – Entertainment",
    },
    {
      id: 2,
      name: "Commercial – Long Term Care",
      label: "Commercial – Long Term Care",
      value: "Commercial – Long Term Care",
    },
    {
      id: 2,
      name: "Commercial – Other",
      label: "Commercial – Other",
      value: "Commercial – Other",
    },
    {
      id: 2,
      name: "Institutional – School",
      label: "Institutional – School",
      value: "Institutional – School",
    },
    {
      id: 2,
      name: "Institutional – University",
      label: "Institutional – University",
      value: "Institutional – University",
    },
    {
      id: 2,
      name: "Institutional – Hospital",
      label: "Institutional – Hospital",
      value: "Institutional – Hospital",
    },
    {
      id: 2,
      name: "Institutional – Municipal Office/Library",
      label: "Institutional – Municipal Office/Library",
      value: "Institutional – Municipal Office/Library",
    },
    {
      id: 2,
      name: "Institutional – Recreational/Community Centre",
      label: "Institutional – Recreational/Community Centre",
      value: "Institutional – Recreational/Community Centre",
    },
    {
      id: 2,
      name: "Institutional - Other",
      label: "Institutional - Other",
      value: "Institutional - Other",
    },
    {
      id: 2,
      name: "Industrial – Manufacturing/Assembly",
      label: "Industrial – Manufacturing/Assembly",
      value: "Industrial – Manufacturing/Assembly",
    },
    {
      id: 2,
      name: "Industrial - Chemical Processing",
      label: "Industrial - Chemical Processing",
      value: "Industrial - Chemical Processing",
    },
    {
      id: 2,
      name: "Industrial – Forestry",
      label: "Industrial – Forestry",
      value: "Industrial – Forestry",
    },
    {
      id: 2,
      name: "Industrial – Raw Material Refining",
      label: "Industrial – Raw Material Refining",
      value: "Industrial – Raw Material Refining",
    },
    {
      id: 2,
      name: "Industrial – Mining",
      label: "Industrial – Mining",
      value: "Industrial – Mining",
    },
    {
      id: 2,
      name: "Industrial - Other",
      label: "Industrial - Other",
      value: "Industrial - Other",
    },
  ];

  const FacilityCategoryArray = [
    { id: 1, name: "Commercial", label: "Commercial", value: "Commercial" },
    {
      id: 2,
      name: "Institutional",
      label: "Institutional",
      value: "Institutional",
    },
    {
      id: 3,
      name: "Multi-Family",
      label: "Multi-Family",
      value: "Multi-Family",
    },
    { id: 4, name: "Industrial", label: "Industrial", value: "Industrial" },
  ];

  const FacilityEnergySavingArray = [
    { id: 1, name: "Saving 1", label: "Saving 1", value: "Saving 1" },
    { id: 2, name: "Saving 2", label: "Saving 2", value: "Saving 2" },
  ];

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoriesTypesAndNAICS, setCategoriesTypesAndNAICS] = useState([])
  const [facilityCategories, setFacilityCategories] = useState([])
  const [facilityTypes, setFacilityTypes] = useState([]);

  useEffect(() => {
    getCategoriesTypesAndNAICS();
  }, []);

  useEffect(() => {

    const distinctCategories = [...new Set(categoriesTypesAndNAICS.map(obj => {
      return obj['facility_category'] != "" ? obj['facility_category'] : null
    }))].filter(c => c != null).map((element, index) => {
      return { id: element, name: element, label: element, value: element }
    });
    setFacilityCategories(distinctCategories)
  }, [categoriesTypesAndNAICS]);

  useEffect(() => {
    if (facilityCategories.length > 0 && id) {
      getFacilityDetailsById()
    }
  }, [facilityCategories])

  const getFacilityType = (value, formValues, isReset) => {
    const facilitiesType = [...categoriesTypesAndNAICS].map((item) => {
      return item['facility_category'] == value ? item : null
    }).filter(c => c != null).map((element, index) => {
      return { id: element['facility_type'], name: element['facility_type'], label: element['facility_type'], value: element['facility_type'] }
    })
    setFacilityTypes(facilitiesType)
    if (!isReset) {
      setInitialValues((prevValues) => {
        return {
          ...formValues,
          facility_category: value,
          facility_type: '',
          naic_code: '',
        };
      });
    }

  }

  const getNAICS = (value, formValues) => {
    const NAICS = [...categoriesTypesAndNAICS].map((item) => {
      return (item['facility_type'] == value) ? item : null
    }).filter(c => c != null).map((element, index) => {
      return { id: element['naic_code'], name: element['naic_code'], label: element['naic_code'], value: element['naic_code'] }
    })
    setInitialValues((prevValues) => {
      return {
        ...formValues,
        facility_type: value,
        naic_code: NAICS[0]?.value,
      };
    });
  }

  const getCategoriesTypesAndNAICS = () => {
    GET_REQUEST(facilityEndPoints.GET_CATEGORIES_TYPES_AND_NAICS)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setCategoriesTypesAndNAICS(response.data.data);
          ;
        }
      })
      .catch((error) => { });
  }

  const getFacilityDetailsById = () => {
    GET_REQUEST(facilityEndPoints.GET_FACILITY_BY_ID + "/" + id)
      .then((response) => {
        if (response.data.statusCode == 200) {
          // if (response.data.data.facility_construction_status == 1) {
          //     console.log(response.data.data.facility_construction_status)
          //     response.data.data.facility_construction_status = 'Existing';
          //     console.log(response.data.data.facility_construction_status)

          // } else if (response.data.data.facility_construction_status == 2) {
          //     response.data.data.facility_construction_status = 'New';
          // }
          setInitialValues((prevValues) => {
            getFacilityType(response?.data?.data?.facility_category, response.data.data, true)
            return {
              ...prevValues,
              ...response.data.data,
            };
          });
          setSelectedFile(response.data.data.display_pic_url ? response.data.data.display_pic_url : '');
        }
      })
      .catch((error) => { });
  };

  const handleButtonClick = () => {
    // Trigger the click event on the hidden file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Handle the file selection here
    const selectedFile = event.target.files[0];
    setSelectedFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => setImgUrl(data?.sasTokenUrl))
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const userCompanyId = useSelector(
    (state) => state?.facilityReducer?.userDetails?.user?.company_id
  );

  const handleSubmit = (values) => {
    const newValues = { ...values, display_pic_url: imgUrl, company_id: userCompanyId };
    if (values.facility_construction_status == "Existing") {
      values.facility_construction_status = 1;
    } else if (values.facility_construction_status == "New") {
      values.facility_construction_status = 2;
    } else if (values.facility_construction_status == "Test Facility") {
      values.facility_construction_status = 3;
    }

    // const apiURL = role == 'admin' ? facilityEndPoints.ADMIN_ADD_EDIT_FACILITY : facilityEndPoints.ADD_EDIT_FACILITY

    if (!id) {

      POST_REQUEST(facilityEndPoints.ADD_EDIT_FACILITY, newValues)
        .then((response) => {
          NotificationsToast({
            message: "Facility added successfully!",
            type: "success",
          });
          navigate(`/facility-list/facility-details/${response?.data?.data?.id}`)
        })
        .catch((error) => {
          NotificationsToast({
            message: error?.message ? error.message : "Something went wrong!",
            type: "error",
          });
        });
    } else {
      PATCH_REQUEST(facilityEndPoints.ADD_EDIT_FACILITY + '/' + id, newValues)
        .then((response) => {
          NotificationsToast({
            message: "Facility updated successfully!",
            type: "success",
          });
          navigate(`/facility-list/facility-details/${id}`)
        })
        .catch((error) => {
          NotificationsToast({
            message: error?.message ? error.message : "Something went wrong!",
            type: "error",
          });
        });
    }
  };

  const deletePicture = () => {
    setSelectedFile("");
  };

  return (
    <>
      <Container my={4} sx={{ marginTop: "50px" }}>
        <Grid container className="heading-row">
          <Grid container item xs={10}>
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
                  <SelectBox
                    name="facility_construction_status"
                    label="Facility construction status*"
                    options={FacilityConstructionStatusArray}
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
                      getFacilityType(e.target.value, values)
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="facility_type"
                    label="Facility type*"
                    options={facilityTypes || []}
                    onChange={(e) => {
                      getNAICS(e.target.value, values)
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputField
                    isDisabled={true}
                    name="naic_code"
                    label="NAIC’s code*"
                    type="text" />
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
                    What is your target energy savings for this facility?*
                  </Typography>
                  <SliderWrapper
                    name="target_saving"
                    min={0}
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
                  <InputField
                    name="city"
                    label="City*"
                    type="text" />
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
                    isDisabled={true} />
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
                  {id ? "Edit Facility" : "Add Facility"}
                </ButtonWrapper>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOption: (optionOne) => dispatch(setOption(optionOne)),
  setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(AddFacilityComponent);
