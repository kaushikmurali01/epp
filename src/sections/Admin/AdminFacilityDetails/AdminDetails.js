import {
  Box,
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
import ButtonWrapper from "components/FormBuilder/Button";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import {
  addFacilityCharacteristic,
  fetchFacilityCharacteristics,
  updateFacilityCharacteristic,
} from "../../../redux/superAdmin/actions/facilityActions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { validationSchemaFacilityDetails } from "utils/validations/formValidation";

const AdminDetails = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileAssemblyInputRef = useRef(null);
  const fileFacilityInputRef = useRef(null);
  const [selectedAssemblyFile, setSelectedAssemblyFile] = useState();
  const [assemblyImgUrl, setAssemblyImgUrl] = useState("");
  const [selectedFacilityFile, setSelectedFacilityFile] = useState();
  const [facilityImgUrl, setFacilityImgUrl] = useState("");
  const [energyUsageAlignment, setEnergyUsageAlignment] = useState(false);
  const [lightingAlignment, setLightingAlignment] = useState(false);
  const [heatingAlignment, setHeatingAlignment] = useState(false);
  const [coolingAlignment, setCoolingAlignment] = useState(false);
  const facilityCharacterstics = useSelector(
    (state) => state?.facilityReducer?.characteristics?.data
  );

  function checkAndReturnFromArray(array, value) {
    for (let item of array) {
      if (item.value === value) {
        return item.label;
      }
    }
    return value;
  }
  function checkValueNotExist(array, value) {
    for (let item of array) {
      if (item.value !== value) {
        return "other";
      } else {
        return value;
      }
    }
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchFacilityCharacteristics(id))
        .then((response) => {
          const charactersticsDetails = response?.data;
          setInitialValues({
            ...initialValues,
            ...charactersticsDetails,
            occupants_months_detail:
              charactersticsDetails?.occupants_months_detail
                ? JSON.parse(charactersticsDetails?.occupants_months_detail)
                : "",
            not_standard_hvac_equipment:
              charactersticsDetails?.not_standard_hvac_equipment
                ? JSON.parse(charactersticsDetails?.not_standard_hvac_equipment)
                : "",

            space_cooling_fuel_source: checkValueNotExist(
              SOURCE_ARRAY,
              charactersticsDetails?.space_cooling_fuel_source
            ),
            space_heating_fuel_source: checkValueNotExist(
              SOURCE_ARRAY,
              charactersticsDetails?.space_heating_fuel_source
            ),
            water_heating_fuel_source: checkValueNotExist(
              SOURCE_ARRAY,
              charactersticsDetails?.water_heating_fuel_source
            ),
            space_cooling_technology: checkValueNotExist(
              SPACE_COOLING_ARRAY,
              charactersticsDetails?.space_cooling_technology
            ),
            // space_heating_technology: checkValueNotExist(
            //   SPACE_HEATING_ARRAY,
            //   charactersticsDetails?.space_heating_technology
            // ),
            water_heating_technology: checkValueNotExist(
              WATER_HEATING_ARRAY,
              charactersticsDetails?.water_heating_technology
            ),
            space_cooling_technology_other: checkAndReturnFromArray(
              SPACE_COOLING_ARRAY,
              charactersticsDetails?.space_cooling_technology
            ),
            // space_heating_technology_other: checkAndReturnFromArray(
            //   SPACE_HEATING_ARRAY,
            //   charactersticsDetails?.space_heating_technology
            // ),
            water_heating_technology_other: checkAndReturnFromArray(
              WATER_HEATING_ARRAY,
              charactersticsDetails?.water_heating_technology
            ),
            space_cooling_fuel_source_other: checkAndReturnFromArray(
              SOURCE_ARRAY,
              charactersticsDetails?.space_cooling_fuel_source
            ),
            space_heating_fuel_source_other: checkAndReturnFromArray(
              SOURCE_ARRAY,
              charactersticsDetails?.space_heating_fuel_source
            ),
            water_heating_fuel_source_other: checkAndReturnFromArray(
              SOURCE_ARRAY,
              charactersticsDetails?.water_heating_fuel_source
            ),
          });
          setSelectedFacilityFile(
            charactersticsDetails?.facility_site_layout_media_url
          );
          setFacilityImgUrl(
            charactersticsDetails?.facility_site_layout_media_url
          );
          setAssemblyImgUrl(
            charactersticsDetails?.facility_wall_assembly_and_ceiling_assembly_media_url
          );
          setSelectedAssemblyFile(
            charactersticsDetails?.facility_wall_assembly_and_ceiling_assembly_media_url
          );
          setEnergyUsageAlignment(
            charactersticsDetails?.unique_features_that_impact_energy_usage
          );
          setLightingAlignment(
            charactersticsDetails?.is_lighting_controlled_for_occupancy
          );
          setHeatingAlignment(
            charactersticsDetails?.is_space_heating_controlled_for_occupancy
          );
          setCoolingAlignment(
            charactersticsDetails?.is_space_cooling_controlled_for_occupancy
          );
        })
        .catch((error) => {
          console.error("Error fetching meter details:", error);
        });
    }
  }, [dispatch, id]);

  const [initialValues, setInitialValues] = useState({
    operational_hours: "",
    year_of_construction: "",
    gross_floor_area: "",
    number_of_storeys: "",
    conditioned_gross_floor_area_including_common_area: "",
    unonditioned_gross_floor_area: "",
    unique_features_that_impact_energy_usage: false,
    unique_features_of_facility: "",
    space_cooling_fuel_source: "",
    space_cooling_fuel_source_other: "",
    space_cooling_technology: "",
    space_cooling_technology_other: "",
    space_heating_fuel_source: "",
    space_heating_fuel_source_other: "",
    // space_heating_technology: "",
    // space_heating_technology_other: "",
    water_heating_fuel_source: "",
    water_heating_fuel_source_other: "",
    water_heating_technology: "",
    water_heating_technology_other: "",
    space_cooling_technology_description: "",
    space_cooling_technology_age: "",
    space_cooling_technology_capacity: "",
    space_cooling_efficiency: "",
    space_heating_technology_description: "",
    space_heating_technology_age: "",
    space_heating_technology_capacity: "",
    space_heating_efficiency: "",
    water_heating_technology_description: "",
    water_heating_technology_age: "",
    water_heating_technology_capacity: "",
    water_heating_efficiency: "",
    maximum_number_of_occupants: "",
    average_number_of_occupants: "",
    year_round_or_seasonal: "",
    not_standard_hvac_equipment: {
      industrial_Process: false,
      refrigeration: false,
      compressed_air: false,
      commercial_kitchen: false,
      swimming_pool: false,
      other: false,
      none: false,
    },
    occupants_months_detail: {
      jan: false,
      feb: false,
      march: false,
      april: false,
      may: false,
      june: false,
      july: false,
      aug: false,
      sep: false,
      oct: false,
      nov: false,
      dec: false,
    },
    is_lighting_controlled_for_occupancy: false,
    is_space_heating_controlled_for_occupancy: false,
    is_space_cooling_controlled_for_occupancy: false,
  });

  const NUMBER_OF_ARRAY = [
    { value: "1", label: 1 },
    { value: "2", label: 2 },
    { value: "3", label: 3 },
    { value: "4", label: 4 },
    { value: "5", label: 5 },
    { value: "6", label: 6 },
    { value: "7", label: 7 },
    { value: "8", label: 8 },
    { value: "9", label: 9 },
    { value: "10", label: 10 },
    { value: "11", label: 11 },
    { value: "12", label: 12 },
    { value: "13", label: 13 },
    { value: "14", label: 14 },
    { value: "15", label: 15 },
    { value: "16", label: 16 },
    { value: "17", label: 17 },
    { value: "18", label: 18 },
    { value: "19", label: 19 },
    { value: "20", label: 20 },
    { value: "other", label: "other" },
  ];

  const NUMBER_OF_ARRAY_2 = [
    { value: 1, label: "Year round" },
    { value: 2, label: "Seasonal" },
  ];

  const FLOOR_AREA_ARRAY = [
    {
      label: "Less than 10000",
      value: "1",
    },
    {
      label: "10000 - 49999",
      value: "2",
    },
    {
      label: "50000 - 99999",
      value: "3",
    },
    {
      label: "100000 - 249999",
      value: "4",
    },
    {
      label: "250000 - 499999",
      value: "5",
    },
    {
      label: "500000 - 999999",
      value: "6",
    },
    {
      label: "Greater that 1000000",
      value: "7",
    },
  ];

  const SOURCE_ARRAY = [
    {
      label: "Electricty",
      value: "electricty",
    },
    {
      label: "Natural gas",
      value: "natural_gas",
    },
    { label: "Other", value: "other" },
  ];

  const SPACE_COOLING_ARRAY = [
    { value: "chiller", label: "Chiller" },
    {
      value: "rooftoop_unit",
      label: "Rooftoop unit",
    },
    {
      value: "window_air_conditioner",
      label: "Window air conditioner",
    },
    {
      value: "ground_source_heat_pump",
      label: "Ground source heat pump",
    },
    {
      value: "air_source_heat_pump_vrf",
      label: "Air source heat pump/VRF",
    },
    { value: "other", label: "Other" },
  ];

  const SPACE_HEATING_ARRAY = [
    { value: "boiler", label: "Boiler" },
    { value: "furnance", label: "Furnance" },
    {
      value: "baseboard_heating",
      label: "Baseboard heating",
    },
    {
      value: "ground_source_heat_pump",
      label: "Ground source heat pump",
    },
    {
      value: "air_source_heat_pump_VRF",
      label: "air source heat pump/VRF",
    },
    {
      value: "rooftoop_unit",
      label: "Rooftoop unit",
    },
    { value: "other", label: "Other" },
  ];

  const WATER_HEATING_ARRAY = [
    { value: "boiler", label: "Boiler" },
    {
      value: "water_heater",
      label: "Water heater",
    },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (values) => {
    console.log(values);
    const newValues = {
      ...values,
      space_cooling_fuel_source:
        values.space_cooling_fuel_source === "other"
          ? values.space_cooling_fuel_source_other
          : values.space_cooling_fuel_source,
      space_cooling_technology:
        values.space_cooling_technology === "other"
          ? values.space_cooling_technology_other
          : values.space_cooling_technology,
      space_heating_fuel_source:
        values.space_heating_fuel_source === "other"
          ? values.space_heating_fuel_source_other
          : values.space_heating_fuel_source,
      // space_heating_technology:
      //   values.space_heating_technology === "other"
      //     ? values.space_heating_technology_other
      //     : values.space_heating_technology,
      water_heating_fuel_source:
        values.water_heating_fuel_source === "other"
          ? values.water_heating_fuel_source_other
          : values.water_heating_fuel_source,
      water_heating_technology:
        values.water_heating_technology === "other"
          ? values.water_heating_technology_other
          : values.water_heating_technology,
      unique_features_of_facility:
        values.unique_features_that_impact_energy_usage
          ? values.unique_features_of_facility
          : "",
      facility_id: +id,
      not_standard_hvac_equipment: JSON.stringify(
        values.not_standard_hvac_equipment
      ),
      occupants_months_detail: JSON.stringify(values.occupants_months_detail),
      facility_wall_assembly_and_ceiling_assembly_media_url: assemblyImgUrl,
      facility_site_layout_media_url: facilityImgUrl,
    };
    if (facilityCharacterstics) {
      dispatch(updateFacilityCharacteristic(id, newValues));
    } else {
      dispatch(addFacilityCharacteristic(newValues));
    }
  };

  const handleAssemblyFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedAssemblyFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => setAssemblyImgUrl(data?.sasTokenUrl))
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
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
    dispatch(fileUploadAction(selectedFile))
      .then((data) => setFacilityImgUrl(data?.sasTokenUrl))
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleFacilityButtonClick = () => {
    fileFacilityInputRef.current.click();
  };

  const deleteFacilityPicture = () => {
    setSelectedFacilityFile("");
  };

  const handleEnergyUsageTypeChange = (event, newAlignment, form) => {
    setEnergyUsageAlignment(newAlignment);
    form.setFieldValue(
      "unique_features_that_impact_energy_usage",
      newAlignment
    );
  };

  const handleLightingTypeChange = (event, newAlignment, form) => {
    setLightingAlignment(newAlignment);
    form.setFieldValue("is_lighting_controlled_for_occupancy", newAlignment);
  };
  const handleHeatingTypeChange = (event, newAlignment, form) => {
    setHeatingAlignment(newAlignment);
    form.setFieldValue(
      "is_space_heating_controlled_for_occupancy",
      newAlignment
    );
  };
  const handleCoolingTypeChange = (event, newAlignment, form) => {
    setCoolingAlignment(newAlignment);
    form.setFieldValue(
      "is_space_cooling_controlled_for_occupancy",
      newAlignment
    );
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
        validationSchema={validationSchemaFacilityDetails}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
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
                  Save
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
                    type="number"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="gross_floor_area"
                    label="Gross Floor Area"
                    valueKey="value"
                    labelKey="label"
                    options={FLOOR_AREA_ARRAY}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="number_of_storeys"
                    label="Number of Storeys"
                    type="number"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="conditioned_gross_floor_area_including_common_area"
                    label="Conditioned gross floor area including common area"
                    valueKey="value"
                    labelKey="label"
                    options={FLOOR_AREA_ARRAY}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="unonditioned_gross_floor_area"
                    label="Unconditioned gross floor area such as parking lots"
                    valueKey="value"
                    labelKey="label"
                    options={FLOOR_AREA_ARRAY}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputLabel
                    htmlFor="unique_features_that_impact_energy_usage"
                    style={{ whiteSpace: "initial" }}
                  >
                    Are there unique features of your facility that may impact
                    energy usage?*
                  </InputLabel>
                  <FormControl>
                    <Field name="unique_features_that_impact_energy_usage">
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="unique_features_that_impact_energy_usage"
                          value={energyUsageAlignment}
                          exclusive
                          onChange={(event, newAlignment) => {
                            handleEnergyUsageTypeChange(
                              event,
                              newAlignment,
                              form
                            );
                          }}
                        >
                          <ToggleButton
                            value={true}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton
                            value={false}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            No
                          </ToggleButton>
                        </ToggleButtonGroup>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
                {energyUsageAlignment && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="unique_features_of_facility"
                      label="Describe unique features of your facility that may impact energy usage"
                      type="text"
                      style={{ textWrap: "nowrap" }}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={4} mt={1}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="space_cooling_fuel_source"
                    label="Space Cooling Fuel Source *"
                    valueKey="value"
                    labelKey="label"
                    options={SOURCE_ARRAY}
                  />
                </Grid>
                {values.space_cooling_fuel_source === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="space_cooling_fuel_source_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="space_cooling_technology"
                    label="Space Cooling Technology *"
                    valueKey="value"
                    labelKey="label"
                    options={SPACE_COOLING_ARRAY}
                  />
                </Grid>
                {values.space_cooling_technology === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="space_cooling_technology_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="space_heating_fuel_source"
                    label="Space Heating Fuel Source *"
                    valueKey="value"
                    labelKey="label"
                    options={SOURCE_ARRAY}
                  />
                </Grid>
                {values.space_heating_fuel_source === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="space_heating_fuel_source_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
              {/* <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="space_heating_technology"
                    label="Space Heating Technology *"
                    valueKey="value"
                    labelKey="label"
                    options={SPACE_HEATING_ARRAY}
                  />
                </Grid>
                {values.space_heating_technology === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="space_heating_technology_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid> */}
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="water_heating_fuel_source"
                    label="Water Heating Fuel Source *"
                    valueKey="value"
                    labelKey="label"
                    options={SOURCE_ARRAY}
                  />
                </Grid>
                {values.water_heating_fuel_source === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="water_heating_fuel_source_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="water_heating_technology"
                    label="Water Heating Technology *"
                    valueKey="value"
                    labelKey="label"
                    options={WATER_HEATING_ARRAY}
                  />
                </Grid>
                {values.water_heating_technology === "other" && (
                  <Grid item xs={12} sm={4}>
                    <InputField
                      name="water_heating_technology_other"
                      label="If other, describe *"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={4} mt={1}>
                <Grid item xs={12}>
                  <InputLabel>
                    Does Facility have energy-using equipment that is not
                    standard HVAC?
                  </InputLabel>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.industrial_Process"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="industrial_Process"
                    label="Industrial/Process"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.refrigeration"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="refrigeration"
                    label="Refrigeration"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.compressed_air"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="compressed_air"
                    label="Compressed Air"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.commercial_kitchen"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="commercial_kitchen"
                    label="Commercial Kitchen"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.swimming_pool"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="swimming_pool"
                    label="Swimming Pool"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.other"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
                    sx={{ color: "text.secondary2" }}
                    name="other"
                    label="Other"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field
                        name="not_standard_hvac_equipment.none"
                        type="checkbox"
                        as={Checkbox}
                      />
                    }
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
                    valueKey="value"
                    labelKey="label"
                    options={NUMBER_OF_ARRAY}
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
                    valueKey="value"
                    labelKey="label"
                    options={NUMBER_OF_ARRAY}
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
                    valueKey="value"
                    labelKey="label"
                    options={NUMBER_OF_ARRAY}
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
                  <InputField
                    name="maximum_number_of_occupants"
                    label="Maximum Number of Occupants"
                    type="number"
                  />
                </Grid>
                <Grid item sm={4}>
                  <InputField
                    name="average_number_of_occupants"
                    label="Average Number of Occupants"
                    type="number"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item sm={4}>
                  <SelectBox
                    name="year_round_or_seasonal"
                    label="Year Round or Seasonal"
                    valueKey="value"
                    labelKey="label"
                    options={NUMBER_OF_ARRAY_2}
                  />
                </Grid>
              </Grid>
              {values.year_round_or_seasonal === 2 && (
                <Grid container spacing={2} mt={1}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.jan"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="jan"
                      label="Jan"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.feb"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="feb"
                      label="Feb"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.march"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="march"
                      label="March"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.april"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="april"
                      label="April"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.may"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="may"
                      label="May"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.june"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="june"
                      label="June"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.july"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="july"
                      label="July"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.aug"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="aug"
                      label="Aug"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.sep"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="sep"
                      label="Sep"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.oct"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="oct"
                      label="Oct"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.nov"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="nov"
                      label="Nov"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Field
                          name="occupants_months_detail.dec"
                          type="checkbox"
                          as={Checkbox}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="dec"
                      label="Dec"
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor="is_lighting_controlled_for_occupancy">
                    Is Space Heating Controlled for Occupancy?
                  </InputLabel>
                  <FormControl>
                    <Field name="is_lighting_controlled_for_occupancy">
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="is_lighting_controlled_for_occupancy"
                          value={lightingAlignment}
                          exclusive
                          onChange={(event, newAlignment) => {
                            handleLightingTypeChange(event, newAlignment, form);
                          }}
                        >
                          <ToggleButton
                            value={true}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton
                            value={false}
                            sx={{ fontSize: "0.875rem" }}
                          >
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
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="is_space_heating_controlled_for_occupancy"
                          value={heatingAlignment}
                          exclusive
                          onChange={(event, newAlignment) => {
                            handleHeatingTypeChange(event, newAlignment, form);
                          }}
                        >
                          <ToggleButton
                            value={true}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton
                            value={false}
                            sx={{ fontSize: "0.875rem" }}
                          >
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
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="is_space_cooling_controlled_for_occupancy"
                          value={coolingAlignment}
                          exclusive
                          onChange={(event, newAlignment) => {
                            handleCoolingTypeChange(event, newAlignment, form);
                          }}
                        >
                          <ToggleButton
                            value={true}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton
                            value={false}
                            sx={{ fontSize: "0.875rem" }}
                          >
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
                    Save
                  </ButtonWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminDetails;
