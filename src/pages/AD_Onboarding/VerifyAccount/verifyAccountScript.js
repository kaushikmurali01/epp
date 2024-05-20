document.getElementById("cancel").classList.add("grey-btn");

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

const verificationCodeInput = document.getElementById("emailVerificationCode");

if (verificationCodeInput) {
  restrictToDigits(verificationCodeInput);
}