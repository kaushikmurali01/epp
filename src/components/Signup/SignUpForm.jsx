import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Tabs from "@mui/material/Tabs";
import {
  AggregatorSchema,
  CustomerSchema,
} from "../../utils/validations/formValidation";
import SignUpFormFields from "./SignUpFormFields";
import CustomTab from "../FormBuilder/CustomTab";

function getSteps() {
  return ["Contact Information", "Company Detail", "Verify Email"];
}

export default function SignUpForm() {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [customerFormData, setCustomerFormData] = useState({
    firstName: "",
    lastName: "",
    businessLandline: "",
    businessMobile: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    howDidYouHear: "",
    companyType: "",
    companyName: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    country: "",
    facilities: "",
    capitalProject: "",
    termsAgreement: false,
    agree: false,
  });

  const [aggregatorFormData, setAggregatorFormData] = useState({
    firstName: "",
    lastName: "",
    businessLandline: "",
    businessMobile: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    howDidYouHear: "",
    companyType: "",
    companyName: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    country: "",
    facilities: "",
    capitalProject: "",
    termsAgreement: false,
    agree: false,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (tabValue === 0) {
      setCustomerFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      setAggregatorFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const steps = getSteps();
  const validationSchema = tabValue === 0 ? CustomerSchema : AggregatorSchema;
  const initialValues = tabValue === 0 ? customerFormData : aggregatorFormData;

  const handleSubmit = (values) => {
    console.log(values);
  };
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "700", color: "text.secondary2" }}
          gutterBottom
        >
          Sign Up
        </Typography>
        <Typography variant="p" component="p" sx={{ color: "text.secondary2" }}>
          Company/Main Administrator Account
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
          sx={{ mt: 4 }}
          TabIndicatorProps={{
            style: { display: "none" },
          }}
        >
          <CustomTab
            label="Customer"
            sx={{
              borderRadius: "10px 0 0 10px",
            }}
          />
          <CustomTab
            label="Aggregator"
            sx={{
              borderRadius: "0 10px 10px 0",
            }}
          />
        </Tabs>

        <Stepper activeStep={activeStep} sx={{ mt: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <SignUpFormFields
              validationSchema={validationSchema}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              activeStep={activeStep}
              steps={steps}
              handlePrev={handlePrev}
              handleNext={handleNext}
              userType={"Customer"}
            />
          )}
          {tabValue === 1 && (
            <SignUpFormFields
              validationSchema={validationSchema}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              activeStep={activeStep}
              steps={steps}
              handlePrev={handlePrev}
              handleNext={handleNext}
              userType={"Aggregator"}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}
