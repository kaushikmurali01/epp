import * as Yup from "yup";
import { emailRegExp } from "../../config/regex";

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
  facilityConstructionStatus: Yup.string().required("Facility Construction Status is required"),
  facility_name: Yup.string().required("Facility Name is required"),
  // isBuildinTarriffClass: Yup.string().required("Build in Tarriff Class is required"),
  naicCode: Yup.string().required("NAIC Code is required"),
  facilityCategory: Yup.string().required("Facility Category is required"),
  facility_type: Yup.string().required("Facility Type is required"),
  energySavingForFacility: Yup.string().required("Energy Saving For Facility is required"),
  // streetNumber: Yup.string().required("Street Number is required"),
  // streetName: Yup.string().required("Street Name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province/State is required"),
  country: Yup.string().required("Country is required"),
  postalcode: Yup.string().required("Postal Code is required"),
});
