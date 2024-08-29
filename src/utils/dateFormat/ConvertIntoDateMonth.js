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

export const parseUTCDateToLocalDateTime = (utcdate) => {
  const localDate = new Date(utcdate.toLocaleString('en-US', {}));

  // Format the local time in the desired format (YYYY-MM-DD HH:MM)
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');

  const formattedLocalTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedLocalTime
}

export const parseUTCDateToLocalDate = (utcdate) => {
  const localDate = new Date(utcdate.toLocaleString('en-US', {}));

  // Format the local time in the desired format (YYYY-MM-DD HH:MM)
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(localDate.getDate()).padStart(2, '0');

  const formattedLocalDate = `${year}-${month}-${day}`;
  return formattedLocalDate
}
