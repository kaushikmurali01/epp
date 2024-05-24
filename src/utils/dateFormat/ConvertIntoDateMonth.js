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

export const parseUTCDateToLocalDate = (utcdate) => {
  // Parse our locale string to [date, time]
  let date = new Date(utcdate).toLocaleString({},{hour12:false}).split(" ");

  // Now we can access our time at date[1], and monthdayyear @ date[0]
  let time = date[1];
  let mdy = date[0];

  // We then parse  the mdy into parts
  mdy = mdy.split('/');
  let month = String(+parseInt(mdy[0])).charAt(0) == parseInt(mdy[0]) ? "0"+parseInt(mdy[0]) : parseInt(mdy[0]) 
  let day = String(+parseInt(mdy[1])).charAt(0) == parseInt(mdy[1]) ? "0"+parseInt(mdy[1]) : parseInt(mdy[1])    ;
  let year = parseInt(mdy[2]);

  // Putting it all together
  let formattedDate = year + '-' + month + '-' + day + ' ' + time;
  return formattedDate
}
