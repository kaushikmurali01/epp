import DashboardNoGraph from "./DashboardNoGraph";
import DashboardWithGraph from "./DashboardWithGraph";

const DashboardSection = (props) => {
  return <>{true ? <DashboardNoGraph /> : <DashboardWithGraph />}</>;
};

export default DashboardSection;
