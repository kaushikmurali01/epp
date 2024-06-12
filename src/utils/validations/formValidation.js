import * as Yup from "yup";
import {
  emailRegExp,
  phoneUSFormatRegExp,
  postalCodeCanadaFormatRegExp,
  onlyCharactersRegExp,
} from "../../config/regex";

export const validationSchemaLogIn = Yup.object({
  email: Yup.string()
    .required("Please enter email")
    .matches(emailRegExp, "Entered email is incorrect"),
  password: Yup.string()
    .required("Please enter Password")
    .min(8, "Password length should be between 8-12 characters")
    .matches(/\d/, "Password must contain one number")
    .matches(/[A-Z]/, "Password must contain one uppercase character.")
    .matches(/[a-z]/, "Password must contain one lowercase character"),
});

export const validationSchemaSignUp = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  businessLandline: Yup.string().required("Business Landline is required"),
  businessMobile: Yup.string().required("Business Mobile is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  howDidYouHear: Yup.string().required("This field is required"),
  companyType: Yup.string().required("This field is required"),
  companyName: Yup.string().required("This field is required"),
  addressLine1: Yup.string().required("This field is required"),
  addressLine2: Yup.string().required("This field is required"),
  city: Yup.string().required("This field is required"),
  province: Yup.string().required("This field is required"),
  postalCode: Yup.string().required("This field is required"),
  zipCode: Yup.string().required("This field is required"),
  country: Yup.string().required("This field is required"),
  facilities: Yup.string().required("This field is required"),
  capitalProject: Yup.string().required("This field is required"),
  termsAgreement: Yup.boolean()
    .oneOf([true], "You must agree to the terms")
    .required("You must agree to the terms"),
  agree: Yup.boolean()
    .oneOf([true], "You must agree to the agreement")
    .required("You must agree to the agreement"),
});

export const validationSchemaAddFacility = Yup.object().shape({
  facility_construction_status: Yup.string().required(
    "Facility Construction Status is required"
  ),
  facility_name: Yup.string().required("Facility Name is required"),
  // isBuildinTarriffClass: Yup.string().required("Build in Tarriff Class is required"),
  // naic_code: Yup.string().required("NAIC's Code is required"),
  facility_category: Yup.string().required("Facility Category is required"),
  facility_type: Yup.string().required("Facility Type is required"),
  target_saving: Yup.string().required(
    "Energy Saving For Facility is required"
  ),
  // unit_number: Yup.string().required("Unit Number is required"),
  street_number: Yup.string().required("Street Number is required"),
  street_name: Yup.string()
    .required("Street Name is required")
    .max(100, "Street name should be maximum 100 characters"),
  // address: Yup.string().required("Address is required"),
  city: Yup.string()
    .required("City is required")
    .matches(onlyCharactersRegExp, "Numbers are not allowed"),
  province: Yup.string().required("Province is required"),
  country: Yup.string().required("Country is required"),
  postal_code: Yup.string()
    .required("Postal Code is required")
    .matches(postalCodeCanadaFormatRegExp, "Invalid Postal Code"),
});

export const validationSchemaLandingPageForm = Yup.object({
  name: Yup.string().required("Please enter name"),
  company: Yup.string().required("Please enter company name"),
  message: Yup.string().required("Please enter message"),
  email: Yup.string()
    .required("Please enter email")
    .matches(emailRegExp, "Entered email is incorrect"),
  phone: Yup.string()
    .required("Please enter phone number")
    .matches(phoneUSFormatRegExp, "Invalid Phone Number"),
});

export const validationSchemaAlertPopUp = Yup.object({
  comment: Yup.string().required("Please enter comment"),
});

export const validationSchemaFacilitySummary = Yup.object().shape({
  yearOfConstruction: Yup.string().required("Year of construction is required"),
  grossFloorArea: Yup.string().required("Gross floor area is required"),
  numberOfStoreys: Yup.string().required("Number of storeys is required"),
  occupancy: Yup.string().required("Occupancy is  required"),
  numberOfBuildings: Yup.string().required(
    "Physical buildings count is required"
  ),
  company: Yup.string().required("Company is  required"),
  facilityName: Yup.string().required("Facility Name is required"),
  unitNumber: Yup.string().required("Unit Number is required"),
  streetNumber: Yup.string().required("Street Number is required"),
  streetName: Yup.string().required("Street Name is required"),
  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province is required"),
  postalCode: Yup.string().required("Postal Code is required"),
  facilityCategory: Yup.string().required("Facility Category is required"),
  facilityType: Yup.string().required("Facility Type is required"),
  naicCode: Yup.string().required("NAIC Code is required"),
});

export const validationSchemaAddMeter = Yup.object().shape({
  meter_name: Yup.string().required("Meter name is required"),
  meter_type: Yup.string().required("Meter Type is required"),
  unit: Yup.string().required("Unit is required"),
  meter_id: Yup.number()
    .required("Meter Id is required and can be found on the electricity bill")
    .min(0, "Meter Id must be a positive number"),
  meter_active: Yup.date()
    .max(new Date(), "Date meter became active cannot be in the future")
    .required("Meter activation date is required"),
  meter_inactive: Yup.date().when("stil_in_use", {
    is: false,
    then: (schema) =>
      schema
        .min(
          Yup.ref("meter_active"),
          "Date meter became inactive cannot be earlier than date meter became active"
        )
        .max(new Date(), "Date meter became inactive cannot be in the future")
        .required(
          "Date meter became inactive is required when meter is not in use"
        ),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  is_rg_meter: Yup.bool().required("Revenue-grade meter is required"),
});

export const validationSchemaEntry = Yup.object().shape({
  start_date: Yup.date()
    .max(new Date(), "Start Date cannot be in the future")
    .required("Start Date is required"),
  end_date: Yup.date()
    .min(Yup.ref("start_date"), "End Date cannot be earlier than Start Date")
    .max(new Date(), "End Date cannot be in the future")
    .required("End Date is required"),
  usage: Yup.string()
    .required("Usage is required")
    .min(0, "Usage must be a positive number"),
  demand: Yup.string()
    .required("Demand is required")
    .min(0, "Demand must be a positive number"),
  total_cost: Yup.string()
    .required("Total cost is required")
    .min(0, "Total cost must be a positive number"),
});

export default validationSchemaAddMeter;

export const validationSchemaUserProfile = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  // businessLandline: Yup.string().required("Business Landline is required"),
  phonenumber: Yup.string().required("Business Mobile is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const validationSchemaPUserCompanyrofileDetails = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  // businessLandline: Yup.string().required("Business Landline is required"),
  phonenumber: Yup.string().required("Business Mobile is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  company_name: Yup.string().required("Company Name is required"),
  // website: Yup.string().required("Website URL is required"),

  // unit_number: Yup.string().required("Unit Number is required"),
  street_number: Yup.string().required("Street Number is required"),
  street_name: Yup.string().required("Street Name is required"),

  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province is required"),
  postal_code: Yup.string().required("Postal Code is required"),
  country: Yup.string().required("Country is required"),
});

export const validationSchemaFacilityDetails = Yup.object().shape({
  operational_hours: Yup.number()
    .required("Annual operational hours is required")
    .min(0, "Operational hours must be a positive number between 0 and 8760")
    .max(8760, "Operational hours cannot exceed 8760 hours per year"),
  gross_floor_area_size_category: Yup.number().required(
    "Gross floor area size category is required"
  ),
  gross_floor_area: Yup.number()
    .required("Gross floor area is required")
    .min(0, "Gross floor area must be a positive number")
    .max(3000000, "Gross floor area cannot exceed 3000000 sqft"),
  conditioned_gross_floor_area_including_common_area: Yup.number()
    .nullable()
    .min(
      0,
      "Conditioned gross floor area including common area must be a positive number"
    )
    .max(
      Yup.ref("gross_floor_area"),
      "Conditioned gross floor area including common area cannot be more than gross floor area"
    ),
  unonditioned_gross_floor_area: Yup.number()
    .nullable()
    .min(0, "Unconditioned gross floor area  must be a positive number")
    .max(3000000, "Unconditioned gross floor area cannot exceed 3000000 sqft"),

  year_of_construction: Yup.date().required("Year of construction is required"),
  number_of_storeys: Yup.number()
    .required("Number of storeys is required")
    .min(0, "Number of Storeys must be a positive number")
    .max(200, "Number of Storeys must between 0 to 200"),
  unique_features_that_impact_energy_usage: Yup.boolean().required(
    "Unique features that impact energy usage is required"
  ),
  facility_electricity_service_size: Yup.number()
    .nullable()
    .min(0, "Facility electricity service size must be a positive number"),
  facility_service_entrance_voltage: Yup.number()
    .nullable()
    .min(0, "Facility service entrance voltage must be a positive number"),
  space_cooling_fuel_source: Yup.string().required(
    "Space cooling energy source is required"
  ),
  space_cooling_technology: Yup.string().required(
    "Space cooling technology is required"
  ),
  space_heating_technology: Yup.string().required(
    "Space heating technology is required"
  ),
  space_heating_fuel_source: Yup.string().required(
    "Space heating energy source is required"
  ),
  water_heating_fuel_source: Yup.string().required(
    "Water heating energy source is required"
  ),
  water_heating_technology: Yup.string().required(
    "Water heating technology is required"
  ),
  space_cooling_fuel_source_other: Yup.string().when(
    "space_cooling_fuel_source",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the Space cooling energy source"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  space_heating_fuel_source_other: Yup.string().when(
    "space_heating_fuel_source",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the space heating energy source"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  water_heating_fuel_source_other: Yup.string().when(
    "water_heating_fuel_source",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the water heating energy source"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  space_cooling_technology_other: Yup.string().when(
    "space_cooling_technology",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the space cooling technology"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  space_heating_technology_other: Yup.string().when(
    "space_heating_technology",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the space heating technology"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  water_heating_technology_other: Yup.string().when(
    "water_heating_technology",
    {
      is: "other",
      then: (schema) =>
        schema.required("Please mention the water heating technology"),
      otherwise: (schema) => schema.optional(),
    }
  ),
  is_lighting_controlled_for_occupancy: Yup.boolean().required(
    "Is lighting controlled for occupancy is required"
  ),
  is_space_heating_controlled_for_occupancy: Yup.boolean().required(
    "Is space Heating controlled for occupancy is required"
  ),
  is_space_cooling_controlled_for_occupancy: Yup.boolean().required(
    "Is space Cooling controlled for occupancy is required"
  ),
  space_cooling_technology_capacity: Yup.number()
    .nullable()
    .min(0, "Space cooling technology capacity must be a positive number"),
  space_heating_technology_capacity: Yup.number()
    .nullable()
    .min(0, "Space heating technology capacity must be a positive number"),
  water_heating_technology_capacity: Yup.number()
    .nullable()
    .min(0, "Water heating technology capacity must be a positive number"),
  space_cooling_technology_age: Yup.number()
    .nullable()
    .min(0, "Space cooling technology age must be a positive number"),
  space_heating_technology_age: Yup.number()
    .nullable()
    .min(0, "Space heating technology age must be a positive number"),
  water_heating_technology_age: Yup.number()
    .nullable()
    .min(0, "Water heating technology age must be a positive number"),
  maximum_number_of_occupants: Yup.number()
    .nullable()
    .min(0, "Maximum number of occupants must be a positive number"),
  average_number_of_occupants: Yup.number()
    .nullable()
    .min(0, "Average number of occupants must be a positive number"),
  space_cooling_efficiency: Yup.number()
    .nullable()
    .min(0, "Space cooling efficiency must be a positive number"),
  space_heating_efficiency: Yup.number()
    .nullable()
    .min(0, "Space heating efficiency must be a positive number"),
  water_heating_efficiency: Yup.number()
    .nullable()
    .min(0, "Water Heating efficiency must be a positive number"),
});

export const validationSchemaAssignFacility = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}(,[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7})*$/,
      "Invalid email"
    )
    .test("At least one email is required", (value) => {
      return value.split(",").some((email) => email.trim() !== "");
    }),
  facilityId: Yup.array()
    .of(Yup.number())
    .required("Facility is required")
    .min(1, "At least one facility is required"),
});

// Change Password Validation schema
export const changePasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Please enter Password")
    .min(8, "Password length should be between 8-12 characters")
    .matches(/\d/, "Password must contain one number")
    .matches(/[A-Z]/, "Password must contain one uppercase character.")
    .matches(/[a-z]/, "Password must contain one lowercase character"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const requestToJoinCompanyFormValidationSchema = Yup.object().shape({
  company: Yup.object({
    id: Yup.string().required("Company is required"),
  }).required("Company is required"),
  // company: Yup.object({
  //   label: Yup.string().required("Company is required"),
  // }).required("Company is required"),
  role: Yup.string().required("Role is required"),
});

export const updateProfilePageRoleSchema = Yup.object().shape({  
  selectUser: Yup.string().required("Role is required"),
});

export const validationSchemaIndependentVariable = Yup.object().shape({
  independentVariableName: Yup.string().required(
    "Independent Variable Name is required"
  ),
  independentVariableDescription: Yup.string().required(
    "Independent Variable Description is required"
  ),
});

export const validationSchemaFacilityPermissions = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  bussiness_email: Yup.string()
    .email("Invalid email")
    .required("Business email is required"),
  role_type: Yup.string().required("Role type is required"),
});
