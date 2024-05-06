import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationsTost = ({ message, type, position }) => {
 
  switch (type) {
    case "info":
      toast.info(message, {
        position: position || "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "success":
      toast.success(message, {
        position: position || "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    case "warning":
      toast.warn(message, {
        position: position || "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "error":
      toast.error(message, {
        position: position ||  "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      break;

    default:
        toast(message, {
        position: position || "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      break;
  }
};

export default NotificationsTost;
