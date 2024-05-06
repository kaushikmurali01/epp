import { Assessment } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import ButtonWrapper from "components/FormBuilder/Button";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fileUploadAction } from "../../../redux/actions/fileUploadAction";
import { useFormikContext } from "formik";

const Details = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { values } = useFormikContext();
  const fileAssemblyInputRef = useRef(null);
  const fileFacilityInputRef = useRef(null);
  const [selectedAssemblyFile, setSelectedAssemblyFile] = useState();
  const [assemblyImgUrl, setAssemblyImgUrl] = useState("");
  const [selectedFacilityFile, setSelectedFacilityFile] = useState();
  const [facilityImgUrl, setFacilityImgUrl] = useState("");

  const initialValues = {};
  console.log(values);

  const NUMBER_OF_ARRAY = [
    { id: 1, value: 1, name: 1, label: 1 },
    { id: 2, value: 2, name: 2, label: 2 },
    { id: 3, value: 3, name: 3, label: 3 },
    { id: 4, value: 4, name: 4, label: 4 },
    { id: 5, value: 5, name: 5, label: 5 },
    { id: 6, value: 6, name: 6, label: 6 },
    { id: 7, value: 7, name: 7, label: 7 },
    { id: 8, value: 8, name: 8, label: 8 },
    { id: 9, value: 9, name: 9, label: 9 },
    { id: 10, value: 10, name: 10, label: 10 },
    { id: 11, value: 11, name: 11, label: 11 },
    { id: 12, value: 12, name: 12, label: 12 },
    { id: 13, value: 13, name: 13, label: 13 },
    { id: 14, value: 14, name: 14, label: 14 },
    { id: 15, value: 15, name: 15, label: 15 },
    { id: 16, value: 16, name: 16, label: 16 },
    { id: 17, value: 17, name: 17, label: 17 },
    { id: 18, value: 18, name: 18, label: 18 },
    { id: 19, value: 19, name: 19, label: 19 },
    { id: 20, value: 20, name: 20, label: 20 },
    { id: 21, value: "others", name: "others", label: "others" },
  ];

  const handleSubmit = (values) => {};

  const handleAssemblyFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedAssemblyFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile));
    // .then(({ data }) =>
    //   setAssemblyImgUrl(data?.sasTokenUrl)
    // );
  };

  const handleAssemblyButtonClick = () => {
    fileAssemblyInputRef.current.click();
  };

  const deleteAssemblyPicture = () => {
    setSelectedAssemblyFile("");
  };

  const handleFacilityFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFacilityFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile));
    // .then(({ data }) =>
    //   setFacilityImgUrl(data?.sasTokenUrl)
    // );
  };

  const handleFacilityButtonClick = () => {
    fileFacilityInputRef.current.click();
  };

  const deleteFacilityPicture = () => {
    setSelectedFacilityFile("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Formik
        initialValues={{ ...initialValues }}
        // validationSchema={validationSchemaFacilityDetails}
        onSubmit={handleSubmit}
      >
        <Form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            <Box
              sx={{
                cursor: "default",
                borderRadius: "2rem",
                background: "#EBEBEB",
                border: "1px solid #D0D0D0",
                textWrap: "nowrap",
                padding: "0.375rem 1rem",
              }}
            >
              <Typography variant="small">Characterstics</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: isSmallScreen && "1.5rem",
              }}
            >
              <Box
                sx={{
                  cursor: "default",
                  borderRadius: "2rem",
                  background: "#D8FFDC",
                  textWrap: "nowrap",
                  padding: "0.375rem 1rem",
                }}
              >
                <Typography variant="small">
                  status:{" "}
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Draft
                  </Typography>
                </Typography>
              </Box>
              <ButtonWrapper
                type="submit"
                color="neutral"
                width="165px"
                height="48px"
                onClick={handleSubmit}
                style={{ marginLeft: "2rem" }}
              >
                save
              </ButtonWrapper>
            </Box>
          </Box>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="operational_hours"
                  label="Operational Hours"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="year_of_construction"
                  label="Year of construction"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="gross_floor_area"
                  label="Gross Floor Area"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="number_of_storeys"
                  label="Number of Storeys"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="conditioned_gross_floor_area_including_common_area"
                  label="Conditioned gross floor area including common area"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="unonditioned_gross_floor_area"
                  label="Unconditioned gross floor area such as parking lots"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="unique_features_that_impact_energy_usage">
                  Are there unique features of your facility that may impact
                  energy usage?*
                </InputLabel>
                <FormControl>
                  <Field name="unique_features_that_impact_energy_usage">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="unique_features_that_impact_energy_usage"
                        {...field}
                      >
                        <ToggleButton value="yes" sx={{ fontSize: "0.875rem" }}>
                          Yes
                        </ToggleButton>
                        <ToggleButton value="no" sx={{ fontSize: "0.875rem" }}>
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputField
                  name="unique_features_of_facility"
                  label="Describe unique features of your facility that may impact energy usage"
                  type="text"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} mt={1}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_cooling_fuel_source"
                  label="Space Cooling Fuel Source *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <InputField
                name="ifOther1"
                label="If other, describe *"
                type="text"
              />
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_cooling_technology"
                  label="Space Cooling Technology *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther1"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_heating_fuel_source"
                  label="Space Heating Fuel Source *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther3"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_heating_technology"
                  label="Space Heating Technology *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther5"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="water_heating_fuel_source"
                  label="Water Heating Fuel Source *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther4"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="water_heating_technology"
                  label="Water Heating Technology *"
                  options={NUMBER_OF_ARRAY}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther5"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} mt={1}>
              <Grid item xs={12}>
                <InputLabel>
                  Does Facility have energy-using equipment that is not standard
                  HVAC?
                </InputLabel>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="industrial/Process"
                  label="Industrial/Process"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="refrigeration"
                  label="Refrigeration"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="compressedAir"
                  label="Compressed Air"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="commercialKitchen"
                  label="Commercial Kitchen"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="swimmingPool"
                  label="Swimming Pool"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="other"
                  label="Other"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="none"
                  label="None"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_cooling_technology_description"
                  label="Space Cooling Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_cooling_technology_age"
                  label="Space Cooling Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_cooling_technology_capacity"
                  label="Space Cooling Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_cooling_efficiency"
                  label="Space Cooling Efficiency"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_heating_technology_description"
                  label="Space Heating Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="space_heating_technology_age"
                  label="Space Heating Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_heating_technology_capacity"
                  label="Space Heating Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="space_heating_efficiency"
                  label="Space Heating Efficiency"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="water_heating_technology_description"
                  label="Water Heating Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="water_heating_technology_age"
                  label="Water Heating Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="water_heating_technology_capacity"
                  label="Water Heating Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="water_heating_efficiency"
                  label="Water Heating Efficiency"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Typography
                my={4}
                variant="small"
                sx={{
                  textAlign: "center",
                  alignContent: "center",
                  backgroundColor: "#EBEBEB",
                  width: "7.25rem",
                  borderRadius: "2rem",
                  height: "37px",
                }}
              >
                Characteristics
              </Typography>
            </Grid>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <SelectBox
                  name="maximum_number_of_occupants"
                  label="Maximum Number of Occupants"
                />
              </Grid>
              <Grid item sm={4}>
                <SelectBox
                  name="average_number_of_occupants"
                  label="Average Number of Occupants"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <SelectBox
                  name="year_round_or_seasonal"
                  label="Year Round or Seasonal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="jan"
                  label="Jan"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="feb"
                  label="Feb"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="march"
                  label="March"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="april"
                  label="April"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="may"
                  label="May"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="june"
                  label="June"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="july"
                  label="July"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="aug"
                  label="Aug"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="sep"
                  label="Sep"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="oct"
                  label="Oct"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="nov"
                  label="Nov"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ color: "text.secondary2" }}
                  name="dec"
                  label="Dec"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="is_lighting_controlled_for_occupancy">
                  Is Space Heating Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="is_lighting_controlled_for_occupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="is_lighting_controlled_for_occupancy"
                        {...field}
                      >
                        <ToggleButton value="yes" sx={{ fontSize: "0.875rem" }}>
                          Yes
                        </ToggleButton>
                        <ToggleButton value="no" sx={{ fontSize: "0.875rem" }}>
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="is_space_heating_controlled_for_occupancy">
                  Is Space Heating Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="is_space_heating_controlled_for_occupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="is_space_heating_controlled_for_occupancy"
                        {...field}
                      >
                        <ToggleButton value="yes" sx={{ fontSize: "0.875rem" }}>
                          Yes
                        </ToggleButton>
                        <ToggleButton value="no" sx={{ fontSize: "0.875rem" }}>
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="is_space_cooling_controlled_for_occupancy">
                  Is Space Cooling Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="is_space_cooling_controlled_for_occupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="is_space_cooling_controlled_for_occupancy"
                        {...field}
                      >
                        <ToggleButton value="yes" sx={{ fontSize: "0.875rem" }}>
                          Yes
                        </ToggleButton>
                        <ToggleButton value="no" sx={{ fontSize: "0.875rem" }}>
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={4}>
                <InputLabel>Facility Site Layout</InputLabel>
                {!selectedFacilityFile ? (
                  <>
                    <Typography
                      my={1}
                      sx={{
                        color: "#696969",
                        fontWeight: "500",
                        fontSize: "18px",
                        border: "1px solid #D0D0D0",
                        backgroundColor: "#D1FFDA",
                        padding: "6px 34px",
                        borderRadius: "8px",
                        width: "140px",
                        height: "40px",
                      }}
                      onClick={handleFacilityButtonClick}
                    >
                      Upload
                    </Typography>
                    <input
                      type="file"
                      ref={fileFacilityInputRef}
                      style={{ display: "none" }}
                      onChange={handleFacilityFileChange}
                    />
                  </>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div>
                      <img
                        src={selectedFacilityFile}
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
                        onClick={handleFacilityButtonClick}
                      >
                        Change Picture
                      </Typography>
                      <input
                        type="file"
                        ref={fileFacilityInputRef}
                        style={{ display: "none" }}
                        onChange={handleFacilityFileChange}
                      />
                      <Typography
                        my={1}
                        sx={{
                          color: "#FF5858",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={deleteFacilityPicture}
                      >
                        Delete Picture
                      </Typography>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={5}>
                <InputLabel>
                  Facility Wall Assembly and Ceiling Assembly
                </InputLabel>
                {!selectedAssemblyFile ? (
                  <>
                    <Typography
                      my={1}
                      sx={{
                        color: "#696969",
                        fontWeight: "500",
                        fontSize: "18px",
                        border: "1px solid #D0D0D0",
                        backgroundColor: "#D1FFDA",
                        padding: "6px 34px",
                        borderRadius: "8px",
                        width: "140px",
                        height: "40px",
                      }}
                      onClick={handleAssemblyButtonClick}
                    >
                      Upload
                    </Typography>
                    <input
                      type="file"
                      ref={fileAssemblyInputRef}
                      style={{ display: "none" }}
                      onChange={handleAssemblyFileChange}
                    />
                  </>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div>
                      <img
                        src={selectedAssemblyFile}
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
                        onClick={handleAssemblyButtonClick}
                      >
                        Change Picture
                      </Typography>
                      <input
                        type="file"
                        ref={fileAssemblyInputRef}
                        style={{ display: "none" }}
                        onChange={handleAssemblyFileChange}
                      />
                      <Typography
                        my={1}
                        sx={{
                          color: "#FF5858",
                          fontWeight: "500",
                          fontSize: "16px !important",
                        }}
                        onClick={deleteAssemblyPicture}
                      >
                        Delete Picture
                      </Typography>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={4}>
                <ButtonWrapper
                  type="submit"
                  color="neutral"
                  width="165px"
                  height="48px"
                  onClick={handleSubmit}
                >
                  save
                </ButtonWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default Details;
