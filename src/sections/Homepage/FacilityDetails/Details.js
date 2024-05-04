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
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React from "react";

const Details = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const initialValues = {};

  const handleSubmit = (values) => {};

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
              <Button variant="contained" sx={{ marginLeft: "2rem" }}>
                Save
              </Button>
            </Box>
          </Box>
          <Grid container rowGap={4} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={8}>
                <InputField
                  name="uniqueFeatures"
                  label="Are there unique features of your facility that may impact energy usage? *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} mt={1}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="spaceCoolingFuelSource"
                  label="Space Cooling Fuel Source *"
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
                  name="spaceCoolingTechnology"
                  label="Space Cooling Technology *"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="ifOther2"
                  label="If other, describe *"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="spaceHeatingFuelSource"
                  label="Space Heating Fuel Source *"
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
                  name="waterHeatingFuelSource"
                  label="Water Heating Fuel Source"
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
                  name="waterHeatingTechnology"
                  label="Water Heating Technology *"
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
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={4}>
                <Typography>Facility Site Layout</Typography>
                <Button variant="contained">Upload</Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Facility Wall Assembly and Ceiling Assembly
                </Typography>
                <Button variant="contained">Upload</Button>
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
            <Grid container spacing={2} mt={1}>
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
                  name="spaceCoolingTechnologyDescription"
                  label="Space Cooling Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="spaceCoolingTechnologyAge"
                  label="Space Cooling Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="spaceCoolingTechnologyCapacity"
                  label="Space Cooling Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="spaceCoolingEfficiency"
                  label="Space Cooling Efficiency"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="spaceHeatingTechnologyDescription"
                  label="Space Heating Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="spaceHeatingTechnologyAge"
                  label="Space Heating Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="spaceHeatingTechnologyCapacity"
                  label="Space Heating Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="spaceHeatingEfficiency"
                  label="Space Heating Efficiency"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="waterHeatingTechnologyDescription"
                  label="Water Heating Technology Description"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectBox
                  name="waterHeatingTechnologyAge"
                  label="Water Heating Technology Age"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="waterHeatingTechnologyCapacity"
                  label="Water Heating Technology Capacity"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField
                  name="waterHeatingEfficiency"
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
                  name="maximumNumberOfOccupants"
                  label="Maximum Number of Occupants"
                />
              </Grid>
              <Grid item sm={4}>
                <SelectBox
                  name="averageNumberOfOccupants"
                  label="Average Number of Occupants"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <SelectBox
                  name="yearRoundorSeasonal"
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
                <InputField
                  name="operationalHours"
                  label="Operational Hours"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="isLightingControlledForOccupancy">
                  Is Space Heating Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="isLightingControlledForOccupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="isLightingControlledForOccupancy"
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
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <InputLabel htmlFor="isSpaceHeatingControlledforOccupancy">
                  Is Space Heating Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="isSpaceHeatingControlledforOccupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="isSpaceHeatingControlledforOccupancy"
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
                <InputLabel htmlFor="isSpaceCoolingControlledforOccupancy">
                  Is Space Cooling Controlled for Occupancy?
                </InputLabel>
                <FormControl>
                  <Field name="isSpaceCoolingControlledforOccupancy">
                    {({ field }) => (
                      <ToggleButtonGroup
                        id="isSpaceCoolingControlledforOccupancy"
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
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default Details;
