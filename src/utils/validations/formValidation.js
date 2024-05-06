import * as Yup from "yup";
import { emailRegExp, phoneUSFormatRegExp } from "../../config/regex";

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
  facility_construction_status: Yup.string().required("Facility Construction Status is required"),
  facility_name: Yup.string().required("Facility Name is required"),
  // isBuildinTarriffClass: Yup.string().required("Build in Tarriff Class is required"),
  naic_code: Yup.string().required("NAIC Code is required"),
  facility_category: Yup.string().required("Facility Category is required"),
  facility_type: Yup.string().required("Facility Type is required"),
  target_saving: Yup.string().required("Energy Saving For Facility is required"),
  unit_number: Yup.string().required("Unit Number is required"),
  street_number: Yup.string().required("Street Number is required"),
  street_name: Yup.string().required("Street Name is required"),
  // address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province/State is required"),
  country: Yup.string().required("Country is required"),
  postal_code: Yup.string().required("Postal Code is required"),
});

export const validationSchemaLandingPageForm = Yup.object({
  name: Yup.string()
  .required('Please enter name'),
  company: Yup.string()
  .required('Please enter company name'),
  message: Yup.string()
  .required('Please enter message'),
  email: Yup.string()
    .required("Please enter email")
    .matches(emailRegExp, "Entered email is incorrect"),
    phone: Yup.string()
    .required("Please enter phone number")
    .matches(phoneUSFormatRegExp , "Invalid Phone Number"),
  
});

export const validationSchemaFacilitySummary = Yup.object().shape({
  yearOfConstruction: Yup.string().required("Year of construction is required"),
  grossFloorArea: Yup.string().required("Gross floor area is required"),
  numberOfStoreys: Yup.string().required("Number of storeys is required"),
  occupancy: Yup.string().required("Occupancy is  required"),
  numberOfBuildings: Yup.string().required("Physical buildings count is required"),
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
  purchased_from_the_grid: Yup.string().required(
    "Purchased from the Grid is required"
  ),
  meter_id: Yup.string(),
  meter_active: Yup.date().required("Date meter became active is required"),
  meter_inactive: Yup.date().required("Date meter became inactive is required"),
  stil_in_use: Yup.boolean(),
  is_rg_meter: Yup.string().required(
    "Is this an revenue-grade meter is required"
  ),
  // meter_specification_url: Yup.string(),
});

export const validationSchemaEntry = Yup.object().shape({
  start_date: Yup.string().required("Start Date is required"),
  end_date: Yup.string().required("End Date is required"),
  usage: Yup.string().required("Usage is required"),
  demand: Yup.string().required("Demand is required"),
  total_cost: Yup.date().required("Total cost is required"),
});

export default validationSchemaAddMeter;