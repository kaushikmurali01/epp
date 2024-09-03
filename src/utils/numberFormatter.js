// utils/numberFormatter.js

/**
 * Formats a number or numeric string with comma separation in American style and optional rounding.
 * @param {number|string} value - The number or numeric string to format.
 * @param {Object} options - Formatting options.
 * @param {string} options.roundingType - 'round' for rounded, 'original' for original, 'integer' for no decimals.
 * @param {number} options.decimals - Number of decimal places (ignored if roundingType is 'integer').
 * @returns {string} Formatted number as a string.
 */
export function formatNumber(value, options = {}) {
  const { roundingType = "original", decimals = 2 } = options;

  // Convert to number if it's a string
  let number = typeof value === "string" ? parseFloat(value) : value;

  // Check if the conversion resulted in a valid number
  if (isNaN(number)) {
    console.warn(`Invalid input: ${value}. Returning original value.`);
    return value.toString();
  }

  let formattedNumber;

  switch (roundingType) {
    case "round":
      formattedNumber = number.toFixed(decimals);
      break;
    case "integer":
      formattedNumber = Math.floor(number).toString();
      break;
    case "original":
    default:
      formattedNumber = number.toString();
  }

  const parts = formattedNumber.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}
