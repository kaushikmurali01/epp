import React, { useEffect, useMemo, useState } from 'react';
import Table from 'components/Table';
import { Box, Button, Container, FormControl, FormGroup, IconButton, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { GET_REQUEST } from 'utils/HTTPRequests';
import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from 'constants/apiEndPoints';

import RolePermissionsUserInvite from './RolePermissionsUserInvite';
import EvModal from 'utils/modal/EvModal';

import RolesPermissionManagementColumn from 'utils/tableColumn/rolesPermissions/rolesPermissionsColumn';

const RolePermissionsUserManagement = () => {

    const { ROLES_PERMISSIONS_MANAGEMENT_COLUMN } = RolesPermissionManagementColumn();

    // tabs table data
    const [getEnervaUser, setEnervaUser] = useState([]);

    const [getUserRole, setUserRole] = useState([]);
    const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);

    const [selectRoleType, setSelectRoleType] = useState('');
    const [invitePageInfo, setInvitePageInfo] = useState({});
    const [selectTableRow, setSelectTableRow] = useState({});
    const [inviteAPIURL, setInviteAPIURL] = useState('');

    // need to call this function before USER_MANAGEMENT_ADMIN_COLUMN
    const handleAPISuccessCallBack = () => {
        // Call the API to get all user data
        getEnervaUserManagementData();
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


    const rolesPermissionsUsersColumns = useMemo(() => ROLES_PERMISSIONS_MANAGEMENT_COLUMN(handleAPISuccessCallBack, setVisibleInvitePage, setSelectTableRow, setModalConfig, setInvitePageInfo, setInviteAPIURL), []);
   
    // for pagination
    const defaultPagination = { page: 1, pageSize: 10 }
    const [enervaPageInfo, setEnervaPageInfo] = useState({ ...defaultPagination });
  
    const [pageCount, setPageCount] = useState('');


    const handleSelectChange = (event) => {
        setSelectRoleType(event.target.value);
    };




    const getEnervaUserManagementData = () => {
        const apiURL = `${ENERVA_USER_MANAGEMENT.GET_ENERVA_USER_LIST}/${(enervaPageInfo.page - 1) * enervaPageInfo.pageSize
            }/${enervaPageInfo.pageSize}`;
        // const apiURL = ENERVA_USER_MANAGEMENT.GET_ENERVA_USER_LIST+'/0/100';
        GET_REQUEST(apiURL)
            .then((res) => {
                if (res.data?.body?.rows instanceof Array) {
                    setEnervaUser(res.data?.body?.rows)
                    setPageCount((prevState) => ({
                        ...prevState,
                        enerva: res.data?.body?.count
                    }));
                }

            }).catch((error) => {
                console.log(error)
            });
    }
 

    const handelInviteUserAdmin = () => {
        const apiURL = ENERVA_USER_MANAGEMENT.SEND_EV_INVITATION_BY_ADMIN
        setVisibleInvitePage(true);
        setSelectTableRow({});
        setInviteAPIURL(apiURL)
        setInvitePageInfo({ title: 'Add Role', type: 'add' })
        setSelectTableRow({});
    }

    const getUserRoleData = () => {
        const apiURL = USER_MANAGEMENT.GET_USER_ROLE
        GET_REQUEST(apiURL)
            .then((res) => {
                setUserRole(res.data?.body)
            }).catch((error) => {
                console.log(error)
            });
    }


    useEffect(() => {
        getUserRoleData()
    }, [])

    useEffect(() => {
        // load all default function on page load
        getEnervaUserManagementData();
    }, [enervaPageInfo])




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
                        <Grid container sx={{ paddingTop: '1.5rem', justifyContent: 'space-between', }} >
                            <Grid item xs={12} md={6} >
                                <Typography variant='h4' sx={{ marginBottom: '0.5rem' }}>Roles and Permissions Management </Typography>
                                <Typography variant='small'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Typography>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
                                <FormGroup sx={{ flexGrow: '1', maxWidth: '14rem' }}>
                                    <FormControl fullWidth sx={{ bgcolor: '#fff', borderRadius: '8px', padding: '0.5rem 0', color: 'dark.main' }}>
                                        <TextField
                                            placeholder="Search by Username & ID"
                                            inputProps={{ style: { color: '#242424', fontSize: '1rem' } }}
                                        />
                                    </FormControl>
                                </FormGroup>

                                <FormGroup className='theme-form-group theme-select-form-group'>

                                    <FormControl sx={{ minWidth: '6rem' }} >
                                        <Select
                                            value={selectRoleType}
                                            onChange={(e) => handleSelectChange(e)}
                                            displayEmpty={true}
                                            className='transparent-border'
                                        >
                                            <MenuItem value="">
                                                User Type
                                            </MenuItem>
                                            {getUserRole && (getUserRole).map((item) => {
                                                return (
                                                    <MenuItem key={item.id} value={item?.id}>{item?.rolename}</MenuItem>
                                                )
                                            })}

                                        </Select>

                                    </FormControl>

                                </FormGroup>
                                <Typography variant='small' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => handelInviteUserAdmin()} >
                                    Add User
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

                        <Grid container sx={{marginTop: '2rem'}}>
                            <Grid item xs={12}>
                                <Table columns={rolesPermissionsUsersColumns} data={getEnervaUser} headbgColor="rgba(217, 217, 217, 0.2)"
                                    count={pageCount.enerva}
                                    pageInfo={enervaPageInfo}
                                    setPageInfo={setEnervaPageInfo}
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
