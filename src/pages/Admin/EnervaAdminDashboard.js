import {
  Box,
  Container,
  FormControl,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { dateFilterTypes } from "constants/allDefault";
import { USER_MANAGEMENT, dashboardEndPoints } from "constants/apiEndPoints";
import { useEffect, useState } from "react";
import { GET_REQUEST } from "utils/HTTPRequests";

export const DashboardCard = ({ heading, count }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.12rem",
        borderRadius: "0.75rem",
        padding: "1.25rem 2.5rem",
        flexDirection: { xs: "row", sm: "column" },
        width: { xs: "100%", sm: "auto" },
        alignItems: { xs: "center", sm: "flex-start" },
        justifyContent: { xs: "space-between", sm: "center" },
        background: "#FEFFE6",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#242424",
          fontWeight: "400",
          fontSize: "0.75rem !important",
          lineHeight: "normal",
        }}
      >
        {heading}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "#242424",
          fontWeight: "600",
          fontSize: "1.125rem !important",
          fontStyle: "normal",
          lineHeight: "normal",
        }}
      >
        {count}
      </Typography>
    </Box>
  );
};

const EnervaAdminDashboard = (props) => {
  const totalsByList = [
    { id: 1, value: "All" },
    { id: 2, value: "Customer 1" },
    { id: 3, value: "Customer 2" },
  ];
  const [totalsByListFilter, setTotalsByListFilter] = useState('');
  const [dateFilter, setDateFilter] = useState("1");
  const [dashboardData, setDashboardData] = useState();
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    getDashboardData('');
    getCompanyListData();
  }, []);

  const getDashboardData = (companyId) => {
    GET_REQUEST(dashboardEndPoints.ADMIN_DASHBOARD_STATS + '?company_id=' + companyId)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setDashboardData(response.data.data);
          ;
        }
      })
      .catch((error) => { });
  }

  const getCompanyListData = () => {
    GET_REQUEST(USER_MANAGEMENT.GET_DROPDOWN_COMPANY_LIST)
      .then((response) => {
        if (response.data.status == 204) {
          setCompanyData(response.data.data);
          ;
        }
      })
      .catch((error) => { });
  }

  return (
    <>
      <Container>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Grid item display="flex" flexDirection="column">
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "400",
                fontSize: "0.75rem",
                fontStyle: "italic",
                lineHeight: "normal",
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Typography>
          </Grid>
          <Grid item display={"flex"} sx={{ flexWrap: "wrap", gap: { xs: "1rem", sm: "2.5rem" }, }}>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                color: "#242424",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Totals By:
              <FormGroup className="theme-form-group theme-select-form-group">
                <FormControl sx={{ minWidth: "6rem" }}>
                  <Select
                    displayEmpty={true}
                    className="transparent-border"
                    value={totalsByListFilter}
                    onChange={(e) => { setTotalsByListFilter(e.target.value); getDashboardData(e.target.value) }}
                  >
                    <MenuItem key='' value=''>
                      All
                    </MenuItem>
                    {companyData?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.company_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                color: "#242424",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Show:
              <FormGroup className="theme-form-group theme-select-form-group">
                <FormControl sx={{ minWidth: "6rem" }}>
                  <Select
                    displayEmpty={true}
                    className="transparent-border"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    {dateFilterTypes?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.dateFilterType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          marginBlock: "1.39rem",
          padding: "1.5rem 0",
          background:
            "linear-gradient(115deg, #F9FBF9 28.32%, #CBDDCD 172.58%)",
        }}
      >
        <Container>
          <Grid container gap={"0.31rem"}>
            <DashboardCard heading="Number of customers" count={dashboardData?.all_company} />
            <DashboardCard heading="Total number of users" count={dashboardData?.all_user} />
          </Grid>
        </Container>
      </Box>

      <Box>
        <Container>
          {/* no result found container */}
          <Grid container sx={{ justifyContent: "center" }}>
            <img src="/images/no-results-found.svg" alt="no-results" />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default EnervaAdminDashboard;
