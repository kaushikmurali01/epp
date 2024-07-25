import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getEmailArchiveList } from '../../../../redux/admin/actions/adminPerformanceActions';
import { Button, FormControl, FormGroup, Grid, TextField, Typography } from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { StyledButtonGroup } from '../AdminBaselineModel/styles';

 const buttonStyle = {
   padding: "0.44rem 1.5rem",
   lineHeight: "1",
   height: "max-content",
   borderRadius: "50px",

   ".MuiButtonGroup-firstButton": {
     BorderRight: "10px",
   },
 };

 const activeButtonStyle = {
   ...buttonStyle,
   backgroundColor: "#2E813E",
   color: "#F7F7F5",
   "&:hover": {
     backgroundColor: "#2E813E",
   },
 };

 const inactiveButtonStyle = {
   ...buttonStyle,
   backgroundColor: "#EBEBEB",
   color: "#696969",
 };

 const emailArchiveBoxStyle = {
   display: "block",
   backgroundColor: "#EBFFEF",
   padding: "10px",
   borderRadius: "5px",
 };

const ArchivedEmailListsModal = ({facility_id}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchString, setSearchString] = useState("");

  const { archivedEmailList, loading } = useSelector(
    (state) => state.adminPerformanceReducer
  );
  const [activeButtonEmailArchive, setActiveButtonEmailArchive] = useState(0);
  const [filteredEmails, setFilteredEmails] = useState([]);

  useEffect(() => {
    dispatch(getEmailArchiveList(facility_id));
  }, [dispatch, facility_id]);

  useEffect(() => {
    filterEmails(activeButtonEmailArchive);
  }, [archivedEmailList, searchString, activeButtonEmailArchive]);

  const applySearchFilter = (emails, search) => {
    if (!search) return emails;
    const searchLower = search.toLowerCase();
    return emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(searchLower) ||
        email.to.toLowerCase().includes(searchLower) ||
        new Date(email.created_at)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)
    );
  };

  const filterEmails = (index) => {
    let filtered = archivedEmailList;

    switch (index) {
      case 1: // User sent
        filtered = filtered.filter((email) => !email.is_system_generated);
        break;
      case 2: // System generated
        filtered = filtered.filter((email) => email.is_system_generated);
        break;
      default:
        break;
    }

    setFilteredEmails(applySearchFilter(filtered, searchString));
  };

  const handleEmailArchiveButtonClick = (index) => {
    setActiveButtonEmailArchive(index);
  };

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <Grid container sx={{ flexDirection: "column" }}>
        <FormGroup>
          <label htmlFor="email-search">Search</label>
          <FormControl
            fullWidth
            sx={{
              position: "relative",
              bgcolor: "#fff",
              borderRadius: "8px",
              color: "dark.main",
              marginBlockStart: "4px",
            }}
          >
            <TextField
              id="email-search"
              inputRef={inputRef}
              value={searchString}
              inputProps={{
                style: {
                  color: "#242424",
                  fontSize: "1rem",
                  paddingRight: "2rem",
                },
              }}
              onChange={(e) => setSearchString(e.target.value)}
            />
            {searchString?.length > 0 ? (
              <ClearIcon
                onClick={() => {
                  setSearchString("");
                  filterEmails(activeButtonEmailArchive);
                }}
                sx={{
                  color: "#333",
                  fontSize: "1.25rem",
                  position: "absolute",
                  right: "0.75rem",
                  top: "0",
                  bottom: "0",
                  margin: "auto",
                  zIndex: "1",
                  cursor: "pointer",
                }}
              />
            ) : (
              <SearchIcon
                onClick={handleSearchIconClick}
                sx={{
                  color: "#333",
                  fontSize: "1.25rem",
                  position: "absolute",
                  right: "0.75rem",
                  top: "0",
                  bottom: "0",
                  margin: "auto",
                  zIndex: "1",
                  cursor: "pointer",
                }}
              />
            )}
          </FormControl>
        </FormGroup>

        <StyledButtonGroup
          disableElevation
          variant="contained"
          color="primary"
          sx={{ marginBlock: "1.5rem" }}
        >
          <Button
            sx={
              activeButtonEmailArchive === 0
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleEmailArchiveButtonClick(0)}
          >
            All
          </Button>
          <Button
            sx={
              activeButtonEmailArchive === 1
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleEmailArchiveButtonClick(1)}
          >
            User send
          </Button>
          <Button
            sx={
              activeButtonEmailArchive === 2
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleEmailArchiveButtonClick(2)}
          >
            System generated
          </Button>
        </StyledButtonGroup>

        <Grid container sx={{ flexDirection: "column", gap: "1rem" }}>
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <Grid item sx={emailArchiveBoxStyle} key={email.id}>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                    lineHeight: "1 !important",
                  }}
                >
                  {email.subject}
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "18px !important",
                    fontWeight: "600",
                  }}
                >
                  {email.to}
                </Typography>
                <Typography
                  sx={{
                    color: "#54585A",
                    fontSize: "12px !important",
                    fontWeight: "400",
                    lineHeight: "1 !important",
                    marginBlockStart: "0.75rem",
                  }}
                >
                  Date sent
                </Typography>
                <Typography
                  sx={{
                    color: "#242424",
                    fontSize: "14px !important",
                    fontWeight: "500",
                  }}
                >
                  {new Date(email.created_at).toLocaleDateString()}
                </Typography>
              </Grid>
            ))
          ) : (
            <Grid container sx={emailArchiveBoxStyle}>
              <Typography
                sx={{
                  color: "#54585A",
                  fontSize: "16px !important",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                No data found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default ArchivedEmailListsModal