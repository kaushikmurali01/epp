export const stringFilter = (str,range) => {
    // Split the string into an array
    const arrayData = str.split(',');
    const showItem = arrayData.slice(0, range).join(', ');
    const restArray = arrayData.slice(range).join(', ');
  
    return { showItem, restArray };
  };