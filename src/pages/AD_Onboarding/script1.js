function showForm(userRole) {
  if (userRole === "super_administrator") {
    resetForm();
    // Target the label element and reset its text content
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
    document.getElementById("country").value = "";

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
    resetForm();
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

// Add an event listener for the "input" event
postalCodeInput.addEventListener('input', function(event) {
    // Convert the value to uppercase
    event.target.value = event.target.value.toUpperCase();
});

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

// Restriction on input fields
restrictToDigits(businessLandlineInput);
restrictToDigits(businessMobileInput);
restrictToDigits(streetNoInput);
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
existingLabel.innerHTML = labelText.replace(agreementWord, linkElement.outerHTML);


// Show Super Administrator Form by default
showForm("super_administrator");
document.querySelector(".extension_UserType_li").classList.add("hidden");
document.getElementById("cancel").classList.add("grey-btn");