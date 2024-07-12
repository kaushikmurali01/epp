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
  fetchAdminFacilityDetails,
  fetchAdminFacilityStatus,
  updateAdminFacilityCharacteristic,
} from "../../../redux/admin/actions/adminFacilityActions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  FLOOR_AREA_ARRAY,
  NUMBER_OF_ARRAY_2,
  SOURCE_ARRAY,
  SPACE_COOLING_ARRAY,
  SPACE_COOLING_UNIT_ARRAY,
  SPACE_HEATING_ARRAY,
  SPACE_HEATING_UNIT_ARRAY,
  WATER_HEATING_ARRAY,
  WATER_HEATING_UNIT_ARRAY,
} from "../../../utils/dropdownConstants/dropdownConstants";
import EvModal from "utils/modal/EvModal";
import CustomAccordion from "components/CustomAccordion";
import { Persist } from "formik-persist";
import { formatISO, parseISO } from "date-fns";
import Loader from "pages/Loader";

const AdminDetails = ({ setTab }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { id } = useParams();
  const [energyUsageAlignment, setEnergyUsageAlignment] = useState(false);
  const [lightingAlignment, setLightingAlignment] = useState(false);
  const [heatingAlignment, setHeatingAlignment] = useState(false);
  const [coolingAlignment, setCoolingAlignment] = useState(false);
  const facilityCharacterstics = useSelector(
    (state) => state?.adminFacilityReducer?.characteristics?.data
  );
  const loadingState = useSelector(
    (state) => state?.adminFacilityReducer?.loading
  );

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: true,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: { justifyContent: "center", gap: "1rem" },
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: true,
      saveButtonClass: "",
      cancelButtonClass: "",
      cancelButtonStyle: {
        backgroundColor: "primary.main",
        "&:hover": { backgroundColor: "primary.main" },
        color: "#fff",
      },
      cancelButtonName: "Okay",
    },
    headerText: "Facility details",
    headerSubText: "",
    modalBodyContent: "The facility details have been updated successfully.",
  });

  const [fieldInstructions, setFieldInstructions] = useState({
    space_cooling_technology_age: "",
    space_cooling_technology_capacity: "",
    space_cooling_efficiency: "",
    space_heating_technology_age: "",
    space_heating_technology_capacity: "",
    space_heating_efficiency: "",
    water_heating_technology_age: "",
    water_heating_technology_capacity: "",
    water_heating_efficiency: "",
  });

  const instructions = {
    space_cooling_technology_age:
      "Space cooling technology age must be a number",
    space_cooling_technology_capacity:
      "Space cooling technology capacity must be a number",
    space_cooling_efficiency: "Space cooling efficiency must be a number",
    space_heating_technology_age:
      "Space heating technology age must be a number",
    space_heating_technology_capacity:
      "Space heating technology capacity must be a number",
    space_heating_efficiency: "Space heating effeciency must be a number",
    water_heating_technology_age:
      "Water heating technology age must be a number",
    water_heating_technology_capacity:
      "Water heating technology capacity must be a number",
    water_heating_efficiency: "Water heating efficiency must be a number",
  };

  const handleFocus = (field) => {
    setFieldInstructions((prevInstructions) => ({
      ...prevInstructions,
      [field]: instructions[field],
    }));
  };

  const handle_blur = (field, handleBlur) => (e) => {
    handleBlur(e);
    setFieldInstructions((prevInstructions) => ({
      ...prevInstructions,
      [field]: "",
    }));
  };

  function checkAndReturnFromArray(array, value) {
    for (let item of array) {
      if (item.value === value) {
        return item.label;
      }
    }
    return value;
  }
  function checkValueNotExist(array, value) {
    const { length } = array;
    const found = length && array?.some((el) => el.value === value);
    if (found) {
      return value;
    } else {
      return "other";
    }
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminFacilityCharacteristics(id))
        .then((response) => {
          const charactersticsDetails = response?.data;
          if (charactersticsDetails !== null) {
            setInitialValues({
              ...initialValues,
              ...charactersticsDetails,
              occupants_months_detail:
                charactersticsDetails?.occupants_months_detail
                  ? JSON.parse(charactersticsDetails?.occupants_months_detail)
                  : "",
              not_standard_hvac_equipment:
                charactersticsDetails?.not_standard_hvac_equipment
                  ? JSON.parse(
                      charactersticsDetails?.not_standard_hvac_equipment
                    )
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
              space_heating_technology:
                charactersticsDetails?.space_heating_technology &&
                checkValueNotExist(
                  SPACE_HEATING_ARRAY,
                  charactersticsDetails?.space_heating_technology
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
              space_heating_technology_other:
                charactersticsDetails?.space_heating_technology &&
                checkAndReturnFromArray(
                  SPACE_HEATING_ARRAY,
                  charactersticsDetails?.space_heating_technology
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
                ? new Date(charactersticsDetails?.year_of_construction)
                : null,
            });
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
          }
        })
        .catch((error) => {
          console.error("Error fetching meter details:", error);
        });
    }
  }, [dispatch, id]);

  const [initialValues, setInitialValues] = useState({
    operational_hours: "",
    year_of_construction: "",
    gross_floor_area_size_category: "",
    gross_floor_area: "",
    number_of_storeys: "",
    conditioned_gross_floor_area_including_common_area: "",
    unonditioned_gross_floor_area: "",
    unique_features_that_impact_energy_usage: false,
    unique_features_of_facility: "",
    facility_electricity_service_size: "",
    facility_service_entrance_voltage: "",
    space_cooling_fuel_source: "",
    space_cooling_fuel_source_other: "",
    space_cooling_technology: "",
    space_cooling_technology_other: "",
    space_heating_fuel_source: "",
    space_heating_fuel_source_other: "",
    space_heating_technology: "",
    space_heating_technology_other: "",
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

  // Use effect to scroll to the top when the modal becomes visible
  useEffect(() => {
    if (!modalConfig.modalVisible) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // for smooth scrolling
      });
    }
  }, [modalConfig.modalVisible]);

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
    };
    if (facilityCharacterstics) {
      dispatch(updateAdminFacilityCharacteristic(id, newValues))
        .then(() => {
          setModalConfig((prev) => ({
            ...prev,
            modalVisible: true,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(addAdminFacilityCharacteristic(newValues))
        .then(() => {
          dispatch(fetchAdminFacilityStatus(id));
          dispatch(fetchAdminFacilityDetails(id));
          setModalConfig((prev) => ({
            ...prev,
            modalVisible: true,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
        {({ handleBlur, values, setFieldValue, errors }) => {
          const handleCheckboxChange = (field, value) => {
            if (field === "not_standard_hvac_equipment.none" && value) {
              setFieldValue(
                "not_standard_hvac_equipment.industrial_Process",
                false
              );
              setFieldValue("not_standard_hvac_equipment.refrigeration", false);
              setFieldValue(
                "not_standard_hvac_equipment.compressed_air",
                false
              );
              setFieldValue(
                "not_standard_hvac_equipment.commercial_kitchen",
                false
              );
              setFieldValue("not_standard_hvac_equipment.swimming_pool", false);
              setFieldValue("not_standard_hvac_equipment.other", false);
            } else if (field !== "not_standard_hvac_equipment.none" && value) {
              setFieldValue("not_standard_hvac_equipment.none", false);
            }
            setFieldValue(field, value);
          };

          const handleYearRoundOrSeasonalChange = (event) => {
            const value = event.target.value;
            setFieldValue("year_round_or_seasonal", value);
            if (value === 1) {
              Object.keys(values.occupants_months_detail).forEach((month) => {
                setFieldValue(`occupants_months_detail.${month}`, false);
              });
            }
          };
          return (
            <Form>
              {!facilityCharacterstics && (
                <Persist name={`aCharactersticsForm${id}`} />
              )}
              <CustomAccordion
                summary="Characteristics"
                panelId="characteristics"
                details={
                  <Grid container rowGap={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="operational_hours"
                          label="Annual operational hours *"
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
                          Year of construction{" "}
                          <span className="asterisk">*</span>
                        </InputLabel>
                        <DatePicker
                          id="year_of_construction"
                          name="year_of_construction"
                          views={["year"]}
                          sx={{ width: "100%", input: { color: "#111" } }}
                          value={
                            facilityCharacterstics === null
                              ? parseISO(values.year_of_construction)
                              : values.year_of_construction
                          }
                          onChange={(date) => {
                            setFieldValue(
                              "year_of_construction",
                              facilityCharacterstics === null
                                ? formatISO(date)
                                : date
                            );
                          }}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.year_of_construction &&
                                errors.year_of_construction,
                            },
                            actionBar: {
                              actions: ["clear", "accept"],
                              className: "my-datepicker-actionbar",
                            },
                          }}
                          disableFuture
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <SelectBox
                          name="gross_floor_area_size_category"
                          label="Gross floor area size category (Sq ft) *"
                          valueKey="value"
                          labelKey="label"
                          options={FLOOR_AREA_ARRAY}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="gross_floor_area"
                          label="Gross floor area (Sq ft) *"
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
                          name="conditioned_gross_floor_area_including_common_area"
                          label="Conditioned gross floor area including common area (Sq ft)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="unonditioned_gross_floor_area"
                          label="Unconditioned gross floor area such as parking lots (Sq ft)"
                          value={
                            values.gross_floor_area &&
                            values.gross_floor_area -
                              values.conditioned_gross_floor_area_including_common_area
                          }
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          isDisabled
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="number_of_storeys"
                          label="Number of storeys *"
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
                        <InputLabel
                          htmlFor="unique_features_that_impact_energy_usage"
                          style={{ whiteSpace: "initial" }}
                        >
                          Are there unique features of your facility that may
                          impact energy usage?
                          <span className="asterisk">*</span>
                        </InputLabel>
                        <FormControl>
                          <Field name="unique_features_that_impact_energy_usage">
                            {({ field, form }) => (
                              <ToggleButtonGroup
                                id="unique_features_that_impact_energy_usage"
                                value={
                                  values.unique_features_that_impact_energy_usage
                                }
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
                      {values.unique_features_that_impact_energy_usage && (
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
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="facility_electricity_service_size"
                          label="Facility electricity service size (Amps)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="facility_service_entrance_voltage"
                          label="Facility service entrance voltage (Voltage)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
              <CustomAccordion
                summary="Heating and cooling systems"
                panelId="heatingAndCoolingSystems"
                details={
                  <Grid container rowGap={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <SelectBox
                          name="space_cooling_fuel_source"
                          label="Space cooling energy source *"
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
                          label="Space cooling technology *"
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
                          label="Space heating energy source *"
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
                          name="space_heating_technology"
                          label="Space heating technology *"
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
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <SelectBox
                          name="water_heating_fuel_source"
                          label="Water heating energy source *"
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
                          label="Water heating technology *"
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
                        <InputLabel sx={{ textWrap: "wrap" }}>
                          Does the facility have energy-using equipment that is
                          not standard HVAC? Please check all that apply.
                        </InputLabel>
                      </Grid>
                    </Grid>
                    <Grid container spacing={-1}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Field
                              name="not_standard_hvac_equipment.industrial_Process"
                              type="checkbox"
                              as={Checkbox}
                              checked={
                                values.not_standard_hvac_equipment
                                  .industrial_Process
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.industrial_Process`,
                                  event.target.checked
                                )
                              }
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
                              checked={
                                values.not_standard_hvac_equipment.refrigeration
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.refrigeration`,
                                  event.target.checked
                                )
                              }
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
                              checked={
                                values.not_standard_hvac_equipment
                                  .compressed_air
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.compressed_air`,
                                  event.target.checked
                                )
                              }
                            />
                          }
                          sx={{ color: "text.secondary2" }}
                          name="compressed_air"
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              Compressed air
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
                              checked={
                                values.not_standard_hvac_equipment
                                  .commercial_kitchen
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.commercial_kitchen`,
                                  event.target.checked
                                )
                              }
                            />
                          }
                          sx={{ color: "text.secondary2" }}
                          name="commercial_kitchen"
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              Commercial kitchen
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
                              checked={
                                values.not_standard_hvac_equipment.swimming_pool
                              }
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.swimming_pool`,
                                  event.target.checked
                                )
                              }
                            />
                          }
                          sx={{ color: "text.secondary2" }}
                          name="swimming_pool"
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              Swimming pool
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
                              checked={values.not_standard_hvac_equipment.other}
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.other`,
                                  event.target.checked
                                )
                              }
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
                              checked={values.not_standard_hvac_equipment.none}
                              onChange={(event) =>
                                handleCheckboxChange(
                                  `not_standard_hvac_equipment.none`,
                                  event.target.checked
                                )
                              }
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
                          label="Space cooling technology description"
                          type="text"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_cooling_technology_age"
                          label="Space cooling technology age (Years)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("space_cooling_technology_age")
                          }
                          onBlur={handle_blur(
                            "space_cooling_technology_age",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_cooling_technology_age &&
                          (values.space_cooling_technology_age === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.space_cooling_technology_age}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_cooling_technology_capacity"
                          label="Space cooling technology capacity (Tons)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("space_cooling_technology_capacity")
                          }
                          onBlur={handle_blur(
                            "space_cooling_technology_capacity",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_cooling_technology_capacity &&
                          (values.space_cooling_technology_capacity === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {
                                fieldInstructions.space_cooling_technology_capacity
                              }
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_cooling_efficiency"
                          label="Space cooling efficiency (EER, SEER, COP)"
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
                          onFocus={() =>
                            handleFocus("space_cooling_efficiency")
                          }
                          onBlur={handle_blur(
                            "space_cooling_efficiency",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_cooling_efficiency &&
                          (values.space_cooling_efficiency === "" || null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.space_cooling_efficiency}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_heating_technology_description"
                          label="Space heating technology description"
                          type="text"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_heating_technology_age"
                          label="Space heating technology age (Years)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("space_heating_technology_age")
                          }
                          onBlur={handle_blur(
                            "space_heating_technology_age",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_heating_technology_age &&
                          (values.space_heating_technology_age === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.space_heating_technology_age}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_heating_technology_capacity"
                          label="Space heating technology capacity (MBH)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("space_heating_technology_capacity")
                          }
                          onBlur={handle_blur(
                            "space_heating_technology_capacity",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_heating_technology_capacity &&
                          (values.space_heating_technology_capacity === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {
                                fieldInstructions.space_heating_technology_capacity
                              }
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="space_heating_efficiency"
                          label="Space heating efficiency (%, HSPF, COP)"
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
                          onFocus={() =>
                            handleFocus("space_heating_efficiency")
                          }
                          onBlur={handle_blur(
                            "space_heating_efficiency",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.space_heating_efficiency &&
                          (values.space_heating_efficiency === "" || null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.space_heating_efficiency}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="water_heating_technology_description"
                          label="Water heating technology description"
                          type="text"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="water_heating_technology_age"
                          label="Water heating technology age (Years)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("water_heating_technology_age")
                          }
                          onBlur={handle_blur(
                            "water_heating_technology_age",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.water_heating_technology_age &&
                          (values.water_heating_technology_age === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.water_heating_technology_age}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="water_heating_technology_capacity"
                          label="Water heating technology capacity (MBH)"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onFocus={() =>
                            handleFocus("water_heating_technology_capacity")
                          }
                          onBlur={handle_blur(
                            "water_heating_technology_capacity",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.water_heating_technology_capacity &&
                          (values.water_heating_technology_capacity === "" ||
                            null) && (
                            <Typography variant="small" color="primary">
                              {
                                fieldInstructions.water_heating_technology_capacity
                              }
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="water_heating_efficiency"
                          label="Water heating efficiency (%, COP)"
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
                          onFocus={() =>
                            handleFocus("water_heating_efficiency")
                          }
                          onBlur={handle_blur(
                            "water_heating_efficiency",
                            handleBlur
                          )}
                        />
                        {fieldInstructions.water_heating_efficiency &&
                          (values.water_heating_efficiency === "" || null) && (
                            <Typography variant="small" color="primary">
                              {fieldInstructions.water_heating_efficiency}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
              <CustomAccordion
                summary="Operational details"
                panelId="operationalDetails"
                details={
                  <Grid container rowGap={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="maximum_number_of_occupants"
                          label="Maximum number of occupants"
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="average_number_of_occupants"
                          label="Average number of occupants"
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
                          name="year_round_or_seasonal"
                          label="Year round or seasonal"
                          valueKey="value"
                          labelKey="label"
                          options={NUMBER_OF_ARRAY_2}
                          onChange={handleYearRoundOrSeasonalChange}
                        />
                      </Grid>
                    </Grid>
                    {values?.year_round_or_seasonal === 2 && (
                      <Grid container spacing={2} mt={1}>
                        {[
                          "jan",
                          "feb",
                          "march",
                          "april",
                          "may",
                          "june",
                          "july",
                          "aug",
                          "sep",
                          "oct",
                          "nov",
                          "dec",
                        ].map((month) => (
                          <Grid item key={month}>
                            <FormControlLabel
                              control={
                                <Field
                                  name={`occupants_months_detail.${month}`}
                                  type="checkbox"
                                  as={Checkbox}
                                  disabled={values.year_round_or_seasonal !== 2}
                                  checked={
                                    values.occupants_months_detail[month]
                                  }
                                  onChange={(event) =>
                                    setFieldValue(
                                      `occupants_months_detail.${month}`,
                                      event.target.checked
                                    )
                                  }
                                />
                              }
                              sx={{ color: "text.secondary2" }}
                              label={
                                <Typography sx={{ fontSize: "14px!important" }}>
                                  {month.charAt(0).toUpperCase() +
                                    month.slice(1)}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={4}>
                        <InputLabel htmlFor="is_lighting_controlled_for_occupancy">
                          Is lighting controlled for occupancy?
                        </InputLabel>
                        <FormControl>
                          <Field name="is_lighting_controlled_for_occupancy">
                            {({ field, form }) => (
                              <ToggleButtonGroup
                                id="is_lighting_controlled_for_occupancy"
                                value={
                                  values.is_lighting_controlled_for_occupancy
                                }
                                exclusive
                                onChange={(event, newAlignment) => {
                                  handleLightingTypeChange(
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
                      <Grid item xs={12} sm={4}>
                        <InputLabel htmlFor="is_space_heating_controlled_for_occupancy">
                          Is space heating controlled for occupancy?
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
                                  handleHeatingTypeChange(
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
                      <Grid item xs={12} sm={4}>
                        <InputLabel htmlFor="is_space_cooling_controlled_for_occupancy">
                          Is space cooling controlled for occupancy?
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
                                  handleCoolingTypeChange(
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
                    </Grid>
                  </Grid>
                }
              />
              <Grid container>
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
            </Form>
          );
        }}
      </Formik>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </Box>
  );
};

export default AdminDetails;
