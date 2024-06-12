// Select all radio inputs within the specified list item
const radioButtons = document.querySelectorAll(
  '.RadioSingleSelect.extension_UserType_li input[type="radio"]'
);

// Iterate through each radio button and remove the 'disabled' attribute
radioButtons.forEach(function (radioButton) {
  radioButton.removeAttribute("disabled");
  radioButton.removeAttribute("aria-disabled");
});

function processCheckboxListItem(className, labelContent) {
  // Select the <li> element with the specified class
  let listItem = document.querySelector("." + className);

  // Select the <fieldset> element
  let fieldset = listItem.querySelector("fieldset");

  // Select the <legend> element
  let legend = fieldset.querySelector("legend");

  // Create a new <label> element with the same content and attributes as the <legend>
  let newLabel = document.createElement("label");
  newLabel.id = legend.id;
  newLabel.setAttribute(
    "for",
    listItem.querySelector('input[type="checkbox"]').id
  ); // Pointing to the checkbox
  newLabel.className = legend.className;
  newLabel.innerHTML = labelContent; // Set the label content

  // Replace the <legend> with the new <label>
  fieldset.replaceChild(newLabel, legend);

  // Move all children of <fieldset> (except the new <label>) out of <fieldset>
  while (fieldset.firstChild) {
    listItem
      .querySelector(".attrEntry")
      .insertBefore(fieldset.firstChild, listItem.querySelector(".helpLink"));
  }

  // Remove the now empty <fieldset>
  fieldset.remove();
}

// Call the function for each checkbox list item with appropriate content
processCheckboxListItem(
  "extension_Policy1_li",
  'I have read and agree to the provisions of the <a href="https://eppdevstorage.blob.core.windows.net/assets/epp-portal-services-agreement.pdf" id="agreement" class="agreement" target="_blank">Portal Services Agreement</a>, which includes limitations on Enerva and IESO warranties and liability.'
);
processCheckboxListItem(
  "extension_Policy2_li",
  "I agree that the information submitted in the sign up form and in other communications and forms as part of the Program consists solely of business or commercial information and is not personal information of any individual."
);
processCheckboxListItem(
  "extension_Policy3_li",
  "I consent to being contacted by IESO or Enerva (IESO Service Provider) by email, text or other electronic means for program-related matters or about energy efficiency and greenhouse gas reducing programs, technologies, products, and services that IESO or Enerva offers."
);


function showForm(userRole) {
  if (userRole === "super_administrator") {
    // resetForm();
    // Target the label element and reset its text content
    scrollToTop();
    let labelElement = document.getElementById(
      "extension_BusinessMobile_label"
    );
    if (labelElement) {
      labelElement.textContent = "Business Mobile*";
    }

    // Target the input element and reset its placeholder
    let inputElement = document.getElementById("extension_BusinessMobile");
    if (inputElement) {
      inputElement.placeholder = "Business Mobile*";
    }

    // Set default value for only the specific input fields in the form
    document.getElementById("extension_BusinessLandline").value = "";
    document.getElementById("extension_CompanyName").value = "";
    document.getElementById("extension_UnitNumber").value = "";
    document.getElementById("extension_StreetNo").value = "";
    document.getElementById("streetAddress").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("postalCode").value = "";
    // Set default value for country select
    document.getElementById("country").value = "Canada";

    document.getElementById("extension_UserType_2").click();

    document.querySelector(".steps").classList.remove("hidden");
    document.querySelector(".step2").classList.remove("complete");

    document.getElementById("super_administrator").classList.add("active");
    document.getElementById("individual").classList.remove("active");

    document
      .querySelector(".emailVerificationControl_li")
      .classList.remove("hidden");
    document.querySelector(".newPassword_li").classList.remove("hidden");
    document.querySelector(".reenterPassword_li").classList.remove("hidden");
    document
      .querySelector(".extension_BusinessLandline_li")
      .classList.remove("hidden");
    document
      .querySelector(".extension_BusinessMobile_li")
      .classList.remove("hidden");

    document
      .querySelector(".extension_FirstName_li")
      .classList.remove("hidden");
    document.querySelector(".extension_LastName_li").classList.remove("hidden");
    document
      .querySelector(".extension_CompanyName_li")
      .classList.remove("hidden");
    document.getElementById("continue").classList.remove("hidden");
    document.getElementById("cancel").classList.remove("hidden");
    document.getElementById("back_btn").classList.add("hidden");

    document
      .querySelector(".extension_BusinessLandline_li")
      .classList.remove("hidden");

    document.querySelector(".extension_WebsiteURL_li").classList.add("hidden");
    document.querySelector(".extension_UnitNumber_li").classList.add("hidden");
    document.querySelector(".streetAddress_li").classList.add("hidden");
    document.querySelector(".state_li").classList.add("hidden");
    document.querySelector(".postalCode_li").classList.add("hidden");
    document
      .querySelector(".extension_Howdoyouhearaboutus_li")
      .classList.add("hidden");
    document.querySelector(".country_li").classList.add("hidden");
    document.querySelector(".city_li").classList.add("hidden");
    document.querySelector(".extension_CompanyName_li").classList.add("hidden");
    document.querySelectorAll(".CheckboxMultiSelect").forEach((element) => {
      element.classList.add("hidden");
    });
    document.querySelector(".extension_StreetNo_li").classList.add("hidden");

    // button show-hide
    document.getElementById("continue").classList.add("hidden");
    document.getElementById("cancel").classList.add("hidden");
    document.getElementById("next").classList.remove("hidden");
  } else if (userRole === "individual") {
    // resetForm();
    scrollToTop();
    document.getElementById("extension_UserType_3").click();

    // Set default value for only the specific input fields in the form
    document.getElementById("extension_BusinessLandline").value = 123;
    document.getElementById("extension_UnitNumber").value = "default";
    document.getElementById("extension_CompanyName").value = "default";
    document.getElementById("extension_StreetNo").value = 123;
    document.getElementById("streetAddress").value = "default";
    document.getElementById("city").value = "default";
    document.getElementById("state").value = "default";
    document.getElementById("postalCode").value = "A1A1A1";
    // Set default value for country select
    document.getElementById("country").value = "Canada";

    document.querySelector(".steps").classList.add("hidden");

    document.getElementById("super_administrator").classList.remove("active");
    document.getElementById("individual").classList.add("active");

    //1st step form fields
    document
      .querySelector(".emailVerificationControl_li")
      .classList.remove("hidden");
    document.querySelector(".newPassword_li").classList.remove("hidden");
    document.querySelector(".reenterPassword_li").classList.remove("hidden");

    document
      .querySelector(".extension_BusinessMobile_li")
      .classList.remove("hidden");

    document
      .querySelector(".extension_FirstName_li")
      .classList.remove("hidden");
    document.querySelector(".extension_LastName_li").classList.remove("hidden");

    document.querySelector(".extension_StreetNo_li").classList.add("hidden");

    // Target the label element and change its text content
    let labelElement = document.getElementById(
      "extension_BusinessMobile_label"
    );
    if (labelElement) {
      labelElement.textContent = "Mobile*";
    }

    // Target the input element and change its placeholder
    let inputElement = document.getElementById("extension_BusinessMobile");
    if (inputElement) {
      inputElement.placeholder = "Mobile*";
    }

    // below fields will be hidden for Individual signup form
    document
      .querySelector(".extension_BusinessLandline_li")
      .classList.add("hidden");
    document.querySelector(".extension_WebsiteURL_li").classList.add("hidden");
    document.querySelector(".extension_UnitNumber_li").classList.add("hidden");
    document.querySelector(".streetAddress_li").classList.add("hidden");
    document.querySelector(".state_li").classList.add("hidden");
    document.querySelector(".postalCode_li").classList.add("hidden");

    document.querySelector(".extension_CompanyName_li").classList.add("hidden");
    document
      .querySelector(".extension_Howdoyouhearaboutus_li")
      .classList.add("hidden");
    document.querySelector(".country_li").classList.add("hidden");
    document.querySelector(".city_li").classList.add("hidden");

    document.querySelectorAll(".CheckboxMultiSelect").forEach((element) => {
      element.classList.remove("hidden");
    });

    // button show-hide
    document.getElementById("continue").classList.remove("hidden");
    document.getElementById("cancel").classList.remove("hidden");
    document.getElementById("next").classList.add("hidden");
    document.getElementById("back_btn").classList.add("hidden");
  }
}

function showCompanyDetailsForm() {
  scrollToTop();
  // add dull class for select tag
  const selectElements = document.querySelectorAll(".dropdown_single");

  // Add the "dull" class initially to all select elements
  selectElements.forEach((selectElement) => {
    selectElement.classList.add("dull");
    // Listen for changes in the select element
    selectElement.addEventListener("change", function () {
      if (selectElement.value === "") {
        // If the default option is selected, add the "dull" class
        selectElement.classList.add("dull");
      } else {
        // Otherwise, remove the "dull" class
        selectElement.classList.remove("dull");
      }
    });
  });

  //1st step form fields
  document.getElementById("extension_UserType_2").click();
  document
    .querySelector(".emailVerificationControl_li")
    .classList.add("hidden");
  document.querySelector(".newPassword_li").classList.add("hidden");
  document.querySelector(".reenterPassword_li").classList.add("hidden");
  document
    .querySelector(".extension_BusinessLandline_li")
    .classList.add("hidden");
  document
    .querySelector(".extension_BusinessMobile_li")
    .classList.add("hidden");

  document.querySelector(".extension_FirstName_li").classList.add("hidden");
  document.querySelector(".extension_LastName_li").classList.add("hidden");
  document.querySelector(".extension_CompanyName_li").classList.add("hidden");
  document.getElementById("continue").classList.add("hidden");
  document.getElementById("cancel").classList.add("hidden");

  //2nd step form fields
  document.querySelector(".step2").classList.add("complete");

  document.querySelector(".extension_WebsiteURL_li").classList.remove("hidden");
  document.querySelector(".extension_UnitNumber_li").classList.remove("hidden");
  document.querySelector(".streetAddress_li").classList.remove("hidden");
  document.querySelector(".state_li").classList.remove("hidden");
  document.querySelector(".postalCode_li").classList.remove("hidden");
  document
    .querySelector(".extension_Howdoyouhearaboutus_li")
    .classList.remove("hidden");
  document.querySelector(".country_li").classList.remove("hidden");
  document.querySelector(".city_li").classList.remove("hidden");
  document
    .querySelector(".extension_CompanyName_li")
    .classList.remove("hidden");
  document.querySelector(".extension_StreetNo_li").classList.remove("hidden");

  document.querySelectorAll(".CheckboxMultiSelect").forEach((element) => {
    element.classList.remove("hidden");
  });

  // style of profile image section
  document.getElementById("attributeList").classList.remove("pt-120");

  //button show-hide
  document.getElementById("continue").classList.remove("hidden");
  document.getElementById("cancel").classList.remove("hidden");
  document.getElementById("back_btn").classList.remove("hidden");
  document.getElementById("next").classList.add("hidden");
}

function backBtnAction() {
  scrollToTop();
  document.querySelector(".step2").classList.remove("complete");

  //1st step form fields
  document
    .querySelector(".emailVerificationControl_li")
    .classList.remove("hidden");
  document.querySelector(".newPassword_li").classList.remove("hidden");
  document.querySelector(".reenterPassword_li").classList.remove("hidden");
  document
    .querySelector(".extension_BusinessLandline_li")
    .classList.remove("hidden");
  document
    .querySelector(".extension_BusinessMobile_li")
    .classList.remove("hidden");

  document.querySelector(".extension_FirstName_li").classList.remove("hidden");
  document.querySelector(".extension_LastName_li").classList.remove("hidden");
  document
    .querySelector(".extension_CompanyName_li")
    .classList.remove("hidden");
  document.getElementById("continue").classList.remove("hidden");
  document.getElementById("cancel").classList.remove("hidden");

  //2nd step form fields
  document.querySelector(".extension_WebsiteURL_li").classList.add("hidden");
  document.querySelector(".extension_UnitNumber_li").classList.add("hidden");
  document.querySelector(".streetAddress_li").classList.add("hidden");
  document.querySelector(".state_li").classList.add("hidden");
  document.querySelector(".postalCode_li").classList.add("hidden");
  document
    .querySelector(".extension_Howdoyouhearaboutus_li")
    .classList.add("hidden");
  document.querySelector(".country_li").classList.add("hidden");
  document.querySelector(".city_li").classList.add("hidden");
  document.querySelector(".extension_StreetNo_li").classList.add("hidden");
  document.querySelector(".extension_CompanyName_li").classList.add("hidden");

  document.querySelectorAll(".CheckboxMultiSelect").forEach((element) => {
    element.classList.add("hidden");
  });

  //button show-hide
  document.getElementById("continue").classList.add("hidden");
  document.getElementById("cancel").classList.add("hidden");
  document.getElementById("back_btn").classList.add("hidden");
  document.getElementById("next").classList.remove("hidden");
}

// Function to set pattern and maxlength attributes for input fields
const businessLandlineInput = document.getElementById(
  "extension_BusinessLandline"
);
const businessMobileInput = document.getElementById("extension_BusinessMobile");
const postalCodeInput = document.getElementById("postalCode");
const streetNoInput = document.getElementById("extension_StreetNo");

// Regex pattern for Canadian postal code
const postalCodePattern =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/;

if (postalCodeInput) {
  // Create the error div once and append it to the parent element
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error");
  errorDiv.style.display = "none"; // Hide the error div initially

  const parentElement = document.querySelector(".postalCode_li .attrEntry");

  // parentElement.appendChild(errorDiv);

  // Insert the error div before the input element
  parentElement.insertBefore(errorDiv, postalCodeInput);

  postalCodeInput.addEventListener("input", function (event) {
    // Convert the value to uppercase
    event.target.value = event.target.value.toUpperCase();

    // Validate the postal code pattern
    const value = event.target.value;

    if (value) {
      if (!postalCodePattern.test(value)) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "Please enter a valid Canadian postal code.";
      } else {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
      }
    } else {
        errorDiv.style.display = "none";
    }
  });
}

function setInputAttributes() {
  if (businessLandlineInput) {
    businessLandlineInput.setAttribute("pattern", "^[0-9]*$");
    businessLandlineInput.setAttribute("maxlength", "10");
  }

  if (businessMobileInput) {
    businessMobileInput.setAttribute("pattern", "^[0-9]*$");
    businessMobileInput.setAttribute("maxlength", "10");
  }

  if (postalCodeInput) {
    postalCodeInput.setAttribute("maxlength", "6");
    postalCodeInput.setAttribute(
      "pattern",
      "^[ABCEGHJ-NPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ -]?\\d[ABCEGHJ-NPRSTV-Z]\\d$"
    );
  }

  // No restriction on max length for street number
  if (streetNoInput) {
    streetNoInput.setAttribute("pattern", "\\d*");
  }
}

// Call the function to set attributes when the DOM is ready
setInputAttributes();

// Function to restrict input to only digits
function restrictToDigits(inputElement) {
  inputElement.addEventListener("keypress", function (event) {
    // Get the character code of the pressed key
    let charCode = event.which || event.keyCode;

    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent the default action (typing)
    }
  });
}

// Function to restrict input to alphanumeric characters
function restrictToAlphanumerics(inputElement) {
  inputElement.addEventListener("keypress", function (event) {
    // Get the character code of the pressed key
    let charCode = event.which || event.keyCode;

    // Allow alphanumeric characters (a-z, A-Z, 0-9)
    if (
      !(charCode >= 48 && charCode <= 57) && // 0-9
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 97 && charCode <= 122)
    ) {
      // a-z
      event.preventDefault(); // Prevent the default action (typing)
    }
  });
}

function resetForm() {
  // Reset form fields here
  document.getElementById("attributeVerification").reset();
}

const verificationCodeInput = document.getElementById("emailVerificationCode");

// Restriction on input fields
restrictToDigits(businessLandlineInput);
restrictToDigits(businessMobileInput);
restrictToDigits(streetNoInput);
restrictToDigits(verificationCodeInput);
restrictToAlphanumerics(postalCodeInput);

// extract the data form the URL and Prefill the input fields function call on Load
// window.onload = function () {
//   // Extract parameters from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const email = urlParams.get("email");
//   const isIndividual = urlParams.get("isIndividual") === "true";

//   // Prefill email input field
//   document.getElementById("email").value = email || "";
//   if (email){
//     document.getElementById("email").setAttribute("disabled", true);
//   }

//   // Set radio button based on isIndividual parameter
//   if (isIndividual) {
//     document.getElementById("extension_UserType_3").click();
//     document
//       .getElementById("super_administrator")
//       .setAttribute("disabled", true);
//     document.getElementById("individual").setAttribute("disabled", true);
//     document.getElementById("super_administrator").classList.remove("active");
//     document.getElementById("individual").classList.add("active");
//   } else {
//     document.getElementById("extension_UserType_2").click();
//     document
//       .getElementById("individual")
//       .setAttribute("disabled", true);
//     document.getElementById("individual").setAttribute("disabled", true);
//     document.getElementById("super_administrator").classList.add("active");
//     document.getElementById("individual").classList.remove("active");
//   }
// };

// Assuming you have an existing label element with an ID "extension_Policy1_label"
const existingLabel = document.getElementById("extension_Policy1_label");
const labelText = existingLabel.textContent.trim();

// Extract the word "Portal Services Agreement"
const agreementWord = "Portal Services Agreement";

// Create a new <a> element
const linkElement = document.createElement("a");
linkElement.href =
  "https://eppdevstorage.blob.core.windows.net/assets/epp-portal-services-agreement.pdf";
linkElement.id = "agreement";
linkElement.className = "agreement";
linkElement.textContent = agreementWord;
linkElement.setAttribute("target", "_blank");

// Replace the exact occurrence of the word with the new <a> element
existingLabel.innerHTML = labelText.replace(
  agreementWord,
  linkElement.outerHTML
);

// Show Super Administrator Form by default
showForm("super_administrator");
document.querySelector(".extension_UserType_li").classList.add("hidden");
document.getElementById("cancel").classList.add("grey-btn");

// Get a reference to the Company Name input field
const companyNameInput = document.getElementById("extension_CompanyName");

// Add an event listener for the input event
companyNameInput.addEventListener("input", debounce(checkCompanyName, 500));

// Debounce function to limit the rate of API calls
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

// Function to check if the company name already exists
function checkCompanyName() {
  const companyName = companyNameInput.value.trim();

  // Make sure the input field is not empty
  if (companyName) {
    // Construct the API URL
    const apiUrl = `https://ams-enerva-dev.azure-api.net/public-api/v1/check/company/${companyName}`;

    // Send the API request
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Check the response status and exists property
        if (data.status === 200 && data.exists) {
          // Company name already exists, you can show an error message here
          showPopup();
          //showErrorMessage('Company name already exists');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the API call
      });
  }
  // else {
  //   // Remove any existing error message if the input field is empty
  //   removeErrorMessage();
  //   return;
  // }
}

// Function to show an error message
// function showErrorMessage(message, cls = ".extension_CompanyName_li") {
// You can display the error message in the desired way
// For example, you can use the provided error div with the class "error itemLevel"
//   const companyli = document.querySelector(cls);
//   const errorDiv = companyli.querySelector(".error.itemLevel");
//   errorDiv.textContent = message;
//   errorDiv.style.display = "block";
// }

// Function to remove any existing error message
// function removeErrorMessage(cls = ".extension_CompanyName_li") {
//   const companyli = document.querySelector(cls);
//   const errorDiv = companyli.querySelector(".error.itemLevel");
//   errorDiv.textContent = "";
//   errorDiv.style.display = "none";
// }
function showPopup() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dark background color
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const popup = document.createElement("div");
  popup.style.backgroundColor = "white";
  popup.style.padding = "20px";
  popup.style.margin = "20px";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  popup.style.borderRadius = "1rem";
  popup.style.maxWidth = "53rem";
  popup.style.textAlign = "center";

  const heading = document.createElement("h2");
  heading.textContent = "The company name you entered already exists.";
  const p2 = document.createElement("i");
  p2.textContent = `You can either create a new company with the same name or join the existing company as an individual user.`;
  popup.appendChild(heading);
  popup.appendChild(p2);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "center";
  buttonsContainer.style.marginTop = "20px";

  const yesButton = document.createElement("button");
  yesButton.textContent = "Proceed as New Company";
  yesButton.addEventListener("click", () => {
    // Enable the Create button and remove the popup
    document.body.removeChild(overlay);
  });
  buttonsContainer.appendChild(yesButton);

  const noButton = document.createElement("button");
  noButton.textContent = "Proceed as Individual User";
  noButton.addEventListener("click", () => {
    showForm("individual");
    document.body.removeChild(overlay);
  });
  buttonsContainer.appendChild(noButton);

  popup.appendChild(buttonsContainer);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Get the password input fields

// const newPasswordLi = document.querySelector(".newPassword_li");
// const reenterPasswordLi = document.querySelector(".reenterPassword_li");
// const newPasswordInput = document.getElementById('newPassword');
// const reenterPasswordInput = document.getElementById('reenterPassword');
// newPasswordLi.style.position = "relative";
// reenterPasswordLi.style.position = "relative";

// // Function to toggle password visibility
// function togglePasswordVisibility(input, eyeIcon) {
//   if (input.type === 'password') {
//     input.type = 'text';
//     eyeIcon.style.color = 'green'; // Change eye icon color when showing password
//   } else {
//     input.type = 'password';
//     eyeIcon.style.color = 'grey'; // Change eye icon color when hiding password
//   }
// }

// // Create eye icons and add event listeners
// const newPasswordEyeIcon = document.createElement('i');
// newPasswordEyeIcon.classList.add('fa', 'fa-eye');
// newPasswordInput.parentNode.appendChild(newPasswordEyeIcon);
// newPasswordEyeIcon.addEventListener('click', () => togglePasswordVisibility(newPasswordInput, newPasswordEyeIcon));

// const reenterPasswordEyeIcon = document.createElement('i');
// reenterPasswordEyeIcon.classList.add('fa', 'fa-eye');
// reenterPasswordInput.parentNode.appendChild(reenterPasswordEyeIcon);
// reenterPasswordEyeIcon.addEventListener('click', () => togglePasswordVisibility(reenterPasswordInput, reenterPasswordEyeIcon));


// Following code will not show the Checks on Password therefore not showing as of now

// Get the password input fields
const newPasswordInput = document.getElementById("newPassword");
const reenterPasswordInput = document.getElementById("reenterPassword");

// Function to toggle password visibility
function togglePasswordVisibility(input, eyeIcon) {
  if (input.type === "password") {
    input.type = "text";
    eyeIcon.style.color = "#2E813E"; // Change eye icon color when showing password
  } else {
    input.type = "password";
    eyeIcon.style.color = "grey"; // Change eye icon color when hiding password
  }
}


// Create eye icons and add event listeners
const newPasswordEyeIcon = document.createElement('i');
newPasswordEyeIcon.classList.add('fa', 'fa-eye');
newPasswordInput.parentNode.appendChild(newPasswordEyeIcon);
newPasswordEyeIcon.addEventListener('click', () => togglePasswordVisibility(newPasswordInput, newPasswordEyeIcon));

const reenterPasswordEyeIcon = document.createElement('i');
reenterPasswordEyeIcon.classList.add('fa', 'fa-eye');
reenterPasswordInput.parentNode.appendChild(reenterPasswordEyeIcon);
reenterPasswordEyeIcon.addEventListener('click', () => togglePasswordVisibility(reenterPasswordInput, reenterPasswordEyeIcon));



// Create a new div element
const field1 = document.createElement('div');
field1.classList.add('field1');


// Append the input and icon elements to the new div
field1.appendChild(newPasswordInput);
field1.appendChild(newPasswordEyeIcon);

// Find the parent element of the input and icon elements
const parentElement1 = document.querySelector('.newPassword_li .attrEntry');

// Append the new div to the parent element
parentElement1.appendChild(field1);

const field2 = document.createElement("div");
field2.classList.add("field2");

// Append the input and icon elements to the new div
field2.appendChild(reenterPasswordInput);
field2.appendChild(reenterPasswordEyeIcon);

// Find the parent element of the input and icon elements
const parentElement2 = document.querySelector(".reenterPassword_li .attrEntry");

// Append the new div to the parent element
parentElement2.appendChild(field2);


// validation for password and confirm password
// newPasswordInput.addEventListener('input', validateNewPassword);
// reenterPasswordInput.addEventListener("input", validateConfirmPassword);

// newPasswordInput.setAttribute("max", 64);
// reenterPasswordInput.setAttribute("max", 64);
  
// const newPasswordError = document.querySelector(
//   ".newPassword_li .attrEntry .error.itemLevel"
// );
// const confirmPasswordError = document.querySelector(
//   ".reenterPassword_li .attrEntry .error.itemLevel"
// );

//   function validateNewPassword() {
//     const password = newPasswordInput.value;
//     let errorMessage = '';

//     if (password) {
//       if (!/[A-Z]/.test(password)) {
//         errorMessage =
//           "The password must contain at least one uppercase letter.";
//       } else if (!/\d/.test(password)) {
//         errorMessage = "The password must contain at least one digit.";
//       } else if (!/[^a-zA-Z0-9]/.test(password)) {
//         errorMessage = "The password must contain at least one symbol.";
//       } else if (!/[a-z]/.test(password)) {
//         errorMessage =
//           "The password must contain at least one lowercase letter.";
//       } else if (password.length < 8) {
//         errorMessage = "The password must be at least 8 characters long.";
//       } else if (password.length > 64) {
//         errorMessage = "The password must be no more than 64 characters long.";
//       }
//     } else {
//       errorMessage = "";
//     }

//     newPasswordError.textContent = errorMessage;
//     // newPasswordError.classList.toggle('show', !!errorMessage);
//   }

//   function validateConfirmPassword() {
//     const password = newPasswordInput.value;
//     const confirmPassword = reenterPasswordInput.value;
//     let errorMessage = '';

//     if (password !== confirmPassword) {
//       errorMessage = 'The passwords do not match.';
//     }

//     confirmPasswordError.textContent = errorMessage;
//     // confirmPasswordError.classList.toggle('show', !!errorMessage);
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
  // const newPasswordInput = document.getElementById("newPassword");
  // const confirmPasswordInput = document.getElementById("reenterPassword");
// const confirmPasswordError = document.getElementById("reenterPassword_error");
const confirmPasswordError = document.querySelector(
  ".reenterPassword_li .attrEntry .error.itemLevel"
);

const newPasswordError = document.querySelector(
  ".newPassword_li .attrEntry .error.itemLevel"
);

// Create and append the criteria container
const newPasswordCriteria = document.createElement("div");
newPasswordCriteria.id = "newPassword_criteria";
newPasswordCriteria.classList.add("criteria");

// Criteria to check
const criteria = [
  { id: "length", regex: /^.{8,64}$/, message: "8 characters" },
  { id: "lowercase", regex: /[a-z]/, message: "1 lowercase" },
  { id: "uppercase", regex: /[A-Z]/, message: "1 uppercase" },
  { id: "digit", regex: /\d/, message: "1 digit" },
  { id: "symbol", regex: /[^a-zA-Z0-9]/, message: "1 symbol" },
];

// Create and append each criterion element
criteria.forEach((criterion) => {
  const span = document.createElement("span");
  span.id = `criteria_${criterion.id}`;
  span.classList.add("invalid");
  span.textContent = criterion.message;
  newPasswordCriteria.appendChild(span);
  newPasswordCriteria.appendChild(document.createTextNode(" - ")); // Add a dash separator
});

// Remove the last separator
newPasswordCriteria.lastChild.remove();

// Append the criteria container after the new password input field
const newPasswordContainer = newPasswordInput.parentNode;
newPasswordContainer.insertBefore(
  newPasswordCriteria,
  newPasswordInput.nextSibling
);

// Add event listeners
newPasswordInput.addEventListener("input", validateNewPassword);
reenterPasswordInput.addEventListener("input", validateConfirmPassword);

document.getElementById("newPassword_criteria").classList.add("hidden");

function validateNewPassword() {
  const password = newPasswordInput.value;
  let validCount = 0;

  if (password) {
    document.getElementById("newPassword_criteria").classList.remove("hidden");
    newPasswordError.textContent = "";

    // Check each criterion
    criteria.forEach((criterion) => {
      const element = document.getElementById(`criteria_${criterion.id}`);
      if (criterion.regex.test(password)) {
        element.classList.add("valid");
        element.classList.remove("invalid");
        if (criterion.id !== "length") validCount++;
      } else {
        element.classList.add("invalid");
        element.classList.remove("valid");
      }
    });

    // Check if length criterion is met and at least 3 other criteria are met
    const lengthElement = document.getElementById("criteria_length");
    const lengthValid = criteria[0].regex.test(password);
    lengthElement.classList.toggle("valid", lengthValid);
    lengthElement.classList.toggle("invalid", !lengthValid);

    const overallValid = lengthValid && validCount >= 3;
    newPasswordCriteria.classList.toggle("valid", overallValid);
  } else {
    document.getElementById("newPassword_criteria").classList.add("hidden");
    newPasswordError.textContent = "This field is required.";
  }
}

function validateConfirmPassword() {
  const password = newPasswordInput.value;
  const confirmPassword = reenterPasswordInput.value;
  let errorMessage = "";

  if (confirmPassword) {
    if (password !== confirmPassword) {
      errorMessage = "The passwords do not match.";
    }

    confirmPasswordError.textContent = errorMessage;
  } else {
    confirmPasswordError.textContent = "This field is required.";
  }
}
