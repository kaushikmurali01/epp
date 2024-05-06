export const ConvertIntoDateMonth = (givenTimeStamp) => {
    // Given date string
const dateString = givenTimeStamp;

// Create a new Date object
const date = new Date(dateString);

// Get the day and month from the date object
const day = date.getDate();
const monthIndex = date.getMonth();

// Define an array of month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get the month name using the month index
const monthName = monthNames[monthIndex];

// Construct the desired format
const formattedDate = `${day}-${monthName.substring(0, 3)}`;

    return formattedDate;

  }
