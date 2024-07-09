export const stringFilter = (str, range) => {
  // Split the string into an array
  const arrayData = str.split(",");
  const showItem = arrayData.slice(0, range).join(", ");
  const restArray = arrayData.slice(range).join(", ");

  return { showItem, restArray };
};

export const capitalizeFirstChar = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const downloadFileFromUrl = async (imgUrl, fileName) => {
  try {
    const response = await fetch(imgUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    const extension = imgUrl.split("/").pop().split(".").pop().split("?")[0];
    link.download = `${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    // Clean up
    link.remove();
    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Download error:", error);
  }
};
