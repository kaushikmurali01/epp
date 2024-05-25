import React, { useEffect, useMemo, useState } from 'react';
import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, IconButton, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { GET_REQUEST } from 'utils/HTTPRequests';
import { ROLES_PERMISSIONS_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';

import RolePermissionsUserInvite from './RolePermissionsUserInvite';
import EvModal from 'utils/modal/EvModal';

import RolesPermissionManagementColumn from 'utils/tableColumn/rolesPermissions/rolesPermissionsColumn';
import debounce from "lodash.debounce";
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';


const RolePermissionsUserManagement = () => {

    const { ROLES_PERMISSIONS_MANAGEMENT_COLUMN } = RolesPermissionManagementColumn();

    // tabs table data
    const [getRolesPermissions, setRolesPermissions] = useState([]);

    const [searchString, setSearchString] = useState("");
    const [getUserRole, setUserRole] = useState([]);
    const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);

    const [selectRoleType, setSelectRoleType] = useState('0');
    const [invitePageInfo, setInvitePageInfo] = useState({});
    const [selectTableRow, setSelectTableRow] = useState({});
    const [inviteAPIURL, setInviteAPIURL] = useState('');

    // need to call this function before USER_MANAGEMENT_ADMIN_COLUMN
    const handleAPISuccessCallBack = () => {
        // Call the API to get all user data
        getRolesPermissionsData(searchString,selectRoleType);
    };
    const [modalConfig, setModalConfig] = useState({
        modalVisible: false,
        modalUI: {
            showHeader: true,
            crossIcon: true,
            modalClass: "",
            headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
            headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' }, },
            fotterActionStyle: { justifyContent: "center", gap: '1rem' },
            modalBodyContentStyle: ''
        },
        buttonsUI: {
            saveButton: true,
            cancelButton: true,
            saveButtonClass: "",
            cancelButtonClass: "",
            successButtonStyle: { backgroundColor: 'danger.scarlet', "&:hover": { backgroundColor: 'danger.colorCrimson' }, color: '#fff' },
            cancelButtonStyle: { backgroundColor: 'dark.colorSmoke', "&:hover": { backgroundColor: 'dark.colorSilver' }, color: '#fff' },
            saveButtonName: "Yes,Delete!",
            cancelButtonName: "No,Cancel",

        },
        headerText: "",
        headerSubText: "",
        modalBodyContent: "",
    });
    const rolesPermissionsUsersColumns = useMemo(() => ROLES_PERMISSIONS_MANAGEMENT_COLUMN(getUserRole, handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig, setInvitePageInfo, setInviteAPIURL), [getUserRole]);

    // for pagination
    const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
    const [pageCount, setPageCount] = useState('');

    const userData = useSelector((state) => state?.facilityReducer?.userDetails || {});

    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };

    const getRolesPermissionsData = (search,role) => {
        // const apiURL = `${ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS}`;
        console.log(role, search, "role");
        const apiURL = `${ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS}/?search=${search}&userType=${role ==="0" ? "" : role}`;

        GET_REQUEST(apiURL)
            .then((res) => {
                if (res.data instanceof Array) {
                    setRolesPermissions(res.data)

                }

            }).catch((error) => {
                console.log(error)
            });
    }


    const handelInviteUserAdmin = () => {
        const apiURL = ROLES_PERMISSIONS_MANAGEMENT.ROLES_PERMISSIONS
        setVisibleInvitePage(true);
        setSelectTableRow({});
        setInviteAPIURL(apiURL)
        setInvitePageInfo({ title: 'Add Role', type: 'add' })
        setSelectTableRow({});
    }

    const getUserRoleData = () => {
        const apiURL = ROLES_PERMISSIONS_MANAGEMENT.USER_TYPES;
        GET_REQUEST(apiURL)
            .then((res) => {
                if (res.data instanceof Array) {
                    setUserRole(res.data)
                }

            }).catch((error) => {
                console.log(error)
            });
    }


    useEffect(() => {
        getUserRoleData()
    }, [])

    // useEffect(() => {
    //     // load all default function on page load
    //     getRolesPermissionsData();
    // }, [])

    const debouncedSearch = debounce((searchString,selectRoleType) => {
        getRolesPermissionsData(searchString,selectRoleType);
    }, 300);

    useEffect(() => {
        debouncedSearch(searchString,selectRoleType);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchString, selectRoleType]);


    return (
        <React.Fragment>
            {isVisibleInvitePage ?
                <RolePermissionsUserInvite
                    getUserRole={getUserRole}
                    setVisibleInvitePage={setVisibleInvitePage}
                    invitePageInfo={invitePageInfo}
                    handleAPISuccessCallBack={handleAPISuccessCallBack}
                    selectTableRow={selectTableRow}
                    inviteAPIURL={inviteAPIURL}
                /> :

                <Box component="section">
                    <Container maxWidth="lg">
                        <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between', flexWrap: 'wrap' }} >
                            <Grid item xs={12} md={5} >
                                <Typography variant='h4' sx={{ marginBottom: '0.5rem' }}>Roles and Permissions Management </Typography>
                                {/* <Typography variant='small'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography> */}
                            </Grid>
                            <Grid item xs={12} md={7} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: {md: 'flex-end'}, alignItems: 'center', marginTop: {xs: '1rem', md: '0'}, gap: {xs: '0.5rem', md:'1.5rem'} }}>
                                <FormGroup sx={{ minWidth: {xs: '100%', md:'14rem'} }}>
                                    <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                                        <TextField
                                             value={searchString}
                                            placeholder="Search by Role"
                                            inputProps={{ style: { color: '#242424', fontSize: '1rem' } }}
                                            onChange={(e) => setSearchString(e.target.value)}
                                        />
                                        {searchString?.length > 0 &&
                                            <ClearIcon
                                                onClick={() => setSearchString("")}
                                                sx={{
                                                    color: "#333",
                                                    fontSize: "1.25rem",
                                                    position: "absolute",
                                                    right: "0.75rem",
                                                    top: '0', bottom: '0', margin: 'auto',
                                                    zIndex: "1",
                                                    cursor: "pointer"
                                                }}
                                            />
                                        }
                                    </FormControl>
                                </FormGroup>

                                <FormGroup className="theme-form-group theme-select-form-group">
                                    <FormControl sx={{ minWidth: '6rem' }}>
                                        <Select
                                            value={selectRoleType}
                                            onChange={(e) => handleSelectChange(e)}
                                            displayEmpty={true}
                                            className="transparent-border"
                                        >
                                            <MenuItem value="0" >
                                                <em> User Type </em>
                                            </MenuItem>
                                            {getUserRole?.map((item) => (
                                                <MenuItem key={`${item.id}-${item.user_type}`} value={item?.id}>
                                                    {item?.user_type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </FormGroup>
                                <Typography variant='small' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => handelInviteUserAdmin()} >
                                    Add Role
                                    <IconButton>

                                        <AddCircleIcon
                                            sx={{
                                                color: "text.primary",
                                                fontSize: "1.875rem",
                                            }}
                                        />
                                    </IconButton>
                                </Typography>
                            </Grid>

                        </Grid>

                        <Grid container sx={{ marginTop: '2rem' }}>
                            <Grid item xs={12}>
                                <Table 
                                    columns={rolesPermissionsUsersColumns} data={getRolesPermissions}
                                    headbgColor="rgba(217, 217, 217, 0.2)"
                                    // count={pageCount}
                                    // pageInfo={pageInfo}
                                    // setPageInfo={setPageInfo}
                                />
                            </Grid>
                        </Grid>


                    </Container>
                </Box >
            }

            <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
        </React.Fragment>
    )
}

export default RolePermissionsUserManagement;
