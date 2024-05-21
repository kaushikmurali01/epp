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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { validationSchemaFacilityDetails } from "utils/validations/formValidation";
import {
  addAdminFacilityCharacteristic,
  fetchAdminFacilityCharacteristics,
  updateAdminFacilityCharacteristic,
} from "../../../redux/admin/actions/adminFacilityActions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  FLOOR_AREA_ARRAY,
  NUMBER_OF_ARRAY_2,
  SOURCE_ARRAY,
  SPACE_COOLING_ARRAY,
  SPACE_COOLING_UNIT_ARRAY,
  SPACE_HEATING_UNIT_ARRAY,
  WATER_HEATING_ARRAY,
  WATER_HEATING_UNIT_ARRAY,
} from "../../../utils/dropdownConstants/dropdownConstants";

const AdminDetails = ({ setTab }) => {
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
    (state) => state?.adminFacilityReducer?.characteristics?.data
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
      dispatch(fetchAdminFacilityCharacteristics(id))
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
            space_cooling_fuel_source:
              charactersticsDetails?.space_cooling_fuel_source &&
              checkValueNotExist(
                SOURCE_ARRAY,
                charactersticsDetails?.space_cooling_fuel_source
              ),
            space_heating_fuel_source:
              charactersticsDetails?.space_heating_fuel_source &&
              checkValueNotExist(
                SOURCE_ARRAY,
                charactersticsDetails?.space_heating_fuel_source
              ),
            water_heating_fuel_source:
              charactersticsDetails?.water_heating_fuel_source &&
              checkValueNotExist(
                SOURCE_ARRAY,
                charactersticsDetails?.water_heating_fuel_source
              ),
            space_cooling_technology:
              charactersticsDetails?.space_cooling_technology &&
              checkValueNotExist(
                SPACE_COOLING_ARRAY,
                charactersticsDetails?.space_cooling_technology
              ),
            water_heating_technology:
              charactersticsDetails?.water_heating_technology &&
              checkValueNotExist(
                WATER_HEATING_ARRAY,
                charactersticsDetails?.water_heating_technology
              ),
            space_cooling_technology_other:
              charactersticsDetails?.space_cooling_technology &&
              checkAndReturnFromArray(
                SPACE_COOLING_ARRAY,
                charactersticsDetails?.space_cooling_technology
              ),
            water_heating_technology_other:
              charactersticsDetails?.water_heating_technology &&
              checkAndReturnFromArray(
                WATER_HEATING_ARRAY,
                charactersticsDetails?.water_heating_technology
              ),
            space_cooling_fuel_source_other:
              charactersticsDetails?.space_cooling_fuel_source &&
              checkAndReturnFromArray(
                SOURCE_ARRAY,
                charactersticsDetails?.space_cooling_fuel_source
              ),
            space_heating_fuel_source_other:
              charactersticsDetails?.space_heating_fuel_source &&
              checkAndReturnFromArray(
                SOURCE_ARRAY,
                charactersticsDetails?.space_heating_fuel_source
              ),
            water_heating_fuel_source_other:
              charactersticsDetails?.water_heating_fuel_source &&
              checkAndReturnFromArray(
                SOURCE_ARRAY,
                charactersticsDetails?.water_heating_fuel_source
              ),
            year_of_construction: charactersticsDetails?.year_of_construction
              ? new Date(charactersticsDetails.year_of_construction)
              : null,
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
    year_round_or_seasonal: 1,
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
    space_cooling_efficiency_unit: "EER",
    space_heating_efficiency_unit: "%",
    water_heating_efficiency_unit: "%",
  });

  const handleSubmit = (values) => {
    const updatedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (typeof value === "string" && value.trim() === "") {
        delete acc[key];
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    const newValues = {
      ...updatedValues,
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
      dispatch(updateAdminFacilityCharacteristic(id, newValues))
        .then(() => {
          setTab(2);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(addAdminFacilityCharacteristic(newValues))
        .then(() => {
          setTab(2);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAssemblyFileChange = (event) => {
    const acceptedTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    const selectedFile = event.target.files[0];
    if (!acceptedTypes.includes(selectedFile.type)) {
      alert(
        "Invalid file type. Please select an image file (png, gif, jpeg, jpg)."
      );
      event.target.value = "";
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(
        "File size exceeds the maximum limit of 5 MB. Please select a smaller file."
      );
      event.target.value = "";
      return;
    }
    setSelectedAssemblyFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setAssemblyImgUrl(data?.sasTokenUrl);
      })
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
    const acceptedTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    const selectedFile = event.target.files[0];
    if (!acceptedTypes.includes(selectedFile.type)) {
      alert(
        "Invalid file type. Please select an image file (png, gif, jpeg, jpg)."
      );
      event.target.value = "";
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(
        "File size exceeds the maximum limit of 5 MB. Please select a smaller file."
      );
      event.target.value = "";
      return;
    }
    setSelectedFacilityFile(URL.createObjectURL(selectedFile));
    dispatch(fileUploadAction(selectedFile))
      .then((data) => {
        setFacilityImgUrl(data?.sasTokenUrl);
      })
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
                    background:
                      facilityCharacterstics === null ? "#EBEBEB" : "#D8FFDC",
                    textWrap: "nowrap",
                    padding: "0.375rem 1rem",
                  }}
                >
                  <Typography variant="small">
                    status:{" "}
                    <Typography variant="span" sx={{ color: "text.primary" }}>
                      {facilityCharacterstics === null ? "Draft" : "Existing"}
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
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel
                    htmlFor="year_of_construction"
                    style={{ whiteSpace: "initial" }}
                  >
                    Year of construction *
                  </InputLabel>
                  <DatePicker
                    id="year_of_construction"
                    name="year_of_construction"
                    views={["year"]}
                    sx={{ width: "100%" }}
                    value={values.year_of_construction}
                    onChange={(date) => {
                      setFieldValue("year_of_construction", date);
                    }}
                    disableFuture
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="gross_floor_area"
                    label="Gross Floor Area(Sqft)"
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
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="conditioned_gross_floor_area_including_common_area"
                    label="Conditioned gross floor area including common area(Sqft)"
                    valueKey="value"
                    labelKey="label"
                    options={FLOOR_AREA_ARRAY}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SelectBox
                    name="unonditioned_gross_floor_area"
                    label="Unconditioned gross floor area such as parking lots(Sqft)"
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Industrial/Process
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Refrigeration
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Compressed Air
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Commercial Kitchen
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Swimming Pool
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        Other
                      </Typography>
                    }
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
                    label={
                      <Typography sx={{ fontSize: "14px!important" }}>
                        None
                      </Typography>
                    }
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
                  <InputField
                    name="space_cooling_technology_age"
                    label="Space Cooling Technology Age(Years)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="space_cooling_technology_capacity"
                    label="Space Cooling Technology Capacity(Tons)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="space_cooling_efficiency"
                    label="Space Cooling Efficiency(EER, SEER, COP)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <SelectBox
                          name="space_cooling_efficiency_unit"
                          valueKey="value"
                          labelKey="label"
                          value={values.space_cooling_efficiency_unit}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fieldset: {
                                border: "none",
                              },
                            },
                          }}
                          options={SPACE_COOLING_UNIT_ARRAY}
                        />
                      ),
                    }}
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
                  <InputField
                    name="space_heating_technology_age"
                    label="Space Heating Technology Age(Years)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="space_heating_technology_capacity"
                    label="Space Heating Technology Capacity(MBH)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="space_heating_efficiency"
                    label="Space Heating Efficiency(%, HSPF)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <SelectBox
                          name="space_heating_efficiency_unit"
                          valueKey="value"
                          labelKey="label"
                          value={values.space_heating_efficiency_unit}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fieldset: {
                                border: "none",
                              },
                            },
                          }}
                          options={SPACE_HEATING_UNIT_ARRAY}
                        />
                      ),
                    }}
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
                  <InputField
                    name="water_heating_technology_age"
                    label="Water Heating Technology Age(Years)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="water_heating_technology_capacity"
                    label="Water Heating Technology Capacity(MBH)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputField
                    name="water_heating_efficiency"
                    label="Water Heating Efficiency(%, COP)"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <SelectBox
                          name="water_heating_efficiency_unit"
                          valueKey="value"
                          labelKey="label"
                          value={values.water_heating_efficiency_unit}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fieldset: {
                                border: "none",
                              },
                            },
                          }}
                          options={WATER_HEATING_UNIT_ARRAY}
                        />
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item spacing={4}>
                <Box
                  my={1}
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
              </Grid>
              <Grid container spacing={4}>
                <Grid item sm={4}>
                  <InputField
                    name="maximum_number_of_occupants"
                    label="Maximum Number of Occupants"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </Grid>
                <Grid item sm={4}>
                  <InputField
                    name="average_number_of_occupants"
                    label="Average Number of Occupants"
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
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
              {values?.year_round_or_seasonal === 2 && (
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Jan
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Feb
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          march
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          April
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          May
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          June
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          July
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Aug
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Sep
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Oct
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Nov
                        </Typography>
                      }
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
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Dec
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <InputLabel htmlFor="is_lighting_controlled_for_occupancy">
                    Is Lighting Controlled for Occupancy?
                  </InputLabel>
                  <FormControl>
                    <Field name="is_lighting_controlled_for_occupancy">
                      {({ field, form }) => (
                        <ToggleButtonGroup
                          id="is_lighting_controlled_for_occupancy"
                          value={values.is_lighting_controlled_for_occupancy}
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
                          value={
                            values.is_space_heating_controlled_for_occupancy
                          }
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
                          value={
                            values.is_space_cooling_controlled_for_occupancy
                          }
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
                          cursor: "pointer",
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
                        accept="image/png, image/gif, image/jpeg, image/jpg"
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
                          accept="image/png, image/gif, image/jpeg, image/jpg"
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
                          cursor: "pointer",
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
                        accept="image/png, image/gif, image/jpeg, image/jpg"
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
                          accept="image/png, image/gif, image/jpeg, image/jpg"
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
