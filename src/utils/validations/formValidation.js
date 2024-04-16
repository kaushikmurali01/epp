import * as Yup from 'yup';
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
    .matches(/[a-z]/, "Password must contain one lowercase character")

});

export const validationSchemaSignUp = Yup.object({
  firstName: Yup.string()
    .required("Please enter first name"),
    lastName: Yup.string()
    .required("Please enter last name"),
    message: Yup.string()
    .required("Please enter message")

 

});