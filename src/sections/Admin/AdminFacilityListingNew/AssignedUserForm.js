import React, { useState, useEffect, useRef } from 'react';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, Stack, Typography } from '@mui/material';
import { POST_REQUEST } from 'utils/HTTPRequests';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import { adminFacilityEndpoints } from 'constants/apiEndPoints';
import { useDispatch } from 'react-redux';

const RotateIconButton = styled(IconButton)(({ rotate }) => ({
    transform: rotate ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'all 0.1s'
}));

const AssignedUserForm = ({ setModalConfig, userList, facilityId, setRefreshTableData }) => {
    const dispatch = useDispatch();
    const [dropdownConfig, setDropdownConfig] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(userList.filter(user => user.isassign));
    const selectedUsersPreAssigned = userList.filter(user => user.isassign)
    const dropdownRef = useRef(null);

    const handleCheckboxChange = (event, user) => {
        if (event.target.checked) {
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, user]);
        } else {
            setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        }
    };

    const isUserSelected = (user) => {
        return selectedUsers.some(selectedUser => selectedUser.id === user.id);
    };

    const formSubmit = (event) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
        event.preventDefault();
        const apiURL = adminFacilityEndpoints.ASSIGN_USER_FACILITY;
        const requestBody = {
            user_ids: selectedUsers.map(user => user.id),
            facility_id: facilityId 
        };

        // return;
        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                }));
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
                setRefreshTableData(prevState => prevState + 1);
            })
            .catch((error) => {
                console.log(error, 'error');
                dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
            });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownConfig(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    console.log(selectedUsersPreAssigned, userList, "check user list")

    return (
        <form onSubmit={formSubmit}>
            <Stack sx={{ marginBottom: '1rem' }} ref={dropdownRef}>
                <FormLabel sx={{ marginBottom: '0.5rem' }}>User name*</FormLabel>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ border: '1px solid #2E813E', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    onClick={() => setDropdownConfig(!dropdownConfig)}
                >
                    <Typography variant="body" sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedUsers && selectedUsers.length > 0 ? selectedUsers.map((user) => {
                            return (
                                <Typography key={user.id} variant="body" sx={{ border: '1px solid #2E813E', borderRadius: '5px', color: '#555', padding: '0.5rem' }}>{user.first_name+ " "+user.last_name}</Typography>
                            );
                        })
                            :
                            "Select Users"
                        }
                    </Typography>
                    <RotateIconButton size="small" rotate={dropdownConfig ? 1 : 0}>
                        <ArrowDropDownIcon />
                    </RotateIconButton>
                </Stack>
                {dropdownConfig &&
                    <FormGroup className='theme-form-group' sx={{ padding: '0.75rem', border: '1px solid #ccc', boxShadow: '0 0 10px #ccc', marginTop: '0.5rem' }}>
                        <Typography variant="h4" sx={{ marginBottom: '1rem' }}>Select Users</Typography>
                        <FormControl className='theme-form-control'>
                            {userList && userList.map((user) => (
                                <FormControlLabel
                                    key={user.id}
                                    control={<Checkbox
                                        name="userIds"
                                        value={user.id}
                                        checked={isUserSelected(user)}
                                        onChange={(event) => handleCheckboxChange(event, user)}
                                        disabled={selectedUsersPreAssigned.some(preAssignedUser => preAssignedUser.id === user.id)}
                                    />}
                                    label={`${user.first_name} ${user.last_name}`}
                                />
                            ))}
                        </FormControl>
                    </FormGroup>
                }
            </Stack>
            <Grid display="flex" sx={{ marginTop: '1.5rem' }}>
                <Button type="submit" variant="contained">Submit</Button>
            </Grid>
        </form>
    );
};

export default AssignedUserForm;
