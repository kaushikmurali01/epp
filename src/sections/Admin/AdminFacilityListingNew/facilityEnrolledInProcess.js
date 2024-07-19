import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, Button, Stack, FormGroup, FormControl, Select, MenuItem } from "@mui/material";
import Table from "../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteAdminFacility,
    downloadFacilityRowData,
    fetchAdminFacilityActiveListing,
    fetchAdminFacilityInProcessListing,
    fetchAdminFacilityListing,
} from "../../../redux/admin/actions/adminFacilityActions";
import AdminFacilityStatus from "components/AdminFacilityStatus";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EvModal from "utils/modal/EvModal";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import TextAreaField from "components/FormBuilder/TextAreaField";
import { Field, Formik, Form } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { adminCompanySendAlert } from "../../../redux/admin/actions/adminCompanyAction";
import * as Yup from "yup";
import EvThemeTable from "components/Table/EvThemeTable";

const FacilityEnrolledInProcess = ({
    searchVal,
    companyFilter,
    onDownloadBulkClick,
    onDownloadRowClick,
    pageInfo,
    setPageInfo,
}) => {
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [customizeFilter, setCustomizeColumnFilter] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [refreshTableData, setRefreshTableData] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [facilityToDelete, setFacilityToDelete] = useState("");

    const customizeColumnsDropdownData = [
        { id: 1, name: "ABC" },
        { id: 2, name: "XYZ" },
    ];

    const debouncedSearch = debounce(
        (payload) => {
            dispatch(
                fetchAdminFacilityInProcessListing(
                    payload
                )
            );
        },
        300
    );

    const commonTableStyle = {
        minWidth: '77rem',
        //   "&.enerva-customer-table thead th": {
        //   minWidth: '7rem',
        // },
        // "&.enerva-customer-table thead th:first-child": {
        //   minWidth: '7rem',
        // },
        // "&.enerva-customer-table thead th:nth-child(2n)": {
        //   minWidth: '12rem',
        // },
    }

    useEffect(() => {
        let payload = {
            "data": searchData,
            "offset": (pageInfo.page - 1) * pageInfo.pageSize,
            "limit": pageInfo.pageSize,
            "col_name": sortColumn,
            "order":sortOrder,            
          }
        debouncedSearch(payload);
        return () => {
            debouncedSearch.cancel();
        };
    }, [
        dispatch,
        pageInfo.page,
        pageInfo.pageSize,
        companyFilter,
        sortColumn,
        sortOrder,
        searchData,
        refreshTableData
    ]);

    const adminFacilityData = useSelector(
        (state) => state?.adminFacilityReducer?.facilityInProcessList?.data?.rows || []
    );
    const adminFacilityCount = useSelector(
        (state) => state?.adminFacilityReducer?.facilityInProcessList?.data?.count || []
    );
    const openDeleteFacilityModal = (facilityId) => {
        setFacilityToDelete(facilityId);
        setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            modalBodyContent: <DeleteModalContent facilityId={facilityId} />,
        }));
    };

    const DeleteModalContent = ({ facilityId }) => {
        const handleDeleteFacility = (id) => {
            if (id) {
                dispatch(deleteAdminFacility(id))
                    .then(() => {
                        setModalConfig((prevState) => ({
                            ...prevState,
                            modalVisible: false,
                        }));
                        // dispatch(fetchAdminFacilityListing(pageInfo, 0));
                        setRefreshTableData(prevState => prevState + 1);
                    })
                    .catch((error) => {
                        console.error("Error deleting facility:", error);
                    });
            }
        };
        const handleCloseButton = () => {
            setModalConfig((prevState) => ({
                ...prevState,
                modalVisible: false,
            }));
        };
        return (
            <Grid
                container
                alignItems="center"
                flexDirection="column"
                textAlign="center"
                sx={{ padding: { md: "0 5%" } }}
            >
                <Grid container sx={{ justifyContent: "center" }}>
                    <figure>
                        <img src="/images/icons/deleteIcon.svg" alt="" />
                    </figure>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }}>
                    <Typography variant="h4">
                        Are you sure you would like to delete this facility?
                    </Typography>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }} gap={2} mt={4}>
                    <Button
                        onClick={()=> handleDeleteFacility(facilityId)}
                        sx={{
                            background: "#FF5858",
                            "&:hover": {
                                background: "#FF5858",
                            },
                        }}
                        variant="contained"
                    >
                        Yes
                    </Button>
                    <Button variant="contained" onClick={handleCloseButton}>
                        No
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const [modalConfig, setModalConfig] = useState({
        modalVisible: false,
        modalUI: {
            showHeader: true,
            crossIcon: false,
            modalClass: "",
            headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
            headerSubTextStyle: {
                marginTop: "1rem",
                color: "rgba(36, 36, 36, 1)",
                fontSize: { md: "0.875rem" },
            },
            fotterActionStyle: "",
            modalBodyContentStyle: "",
        },
        buttonsUI: {
            // saveButton: true,
            // cancelButton: true,
            // saveButtonName: "Delete",
            // cancelButtonName: "Cancel",
            // saveButtonClass: "",
            // cancelButtonClass: "",
        },
        headerText: "",
        headerSubText: "",
        modalBodyContent: "",
    });

    const openAlertModal = (company_id) => {
        setAlertModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            modalBodyContent: <CommentForm companyId={company_id} />,
        }));
    };

    const [alertModalConfig, setAlertModalConfig] = useState({
        modalVisible: false,
        modalUI: {
            showHeader: true,
            crossIcon: false,
            modalClass: "",
            headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
            headerSubTextStyle: {
                marginTop: "1rem",
                color: "rgba(36, 36, 36, 1)",
                fontSize: { md: "0.875rem" },
            },
            fotterActionStyle: "",
            modalBodyContentStyle: "",
        },
        buttonsUI: {
            saveButton: false,
            cancelButton: false,
            saveButtonName: "",
            cancelButtonName: "",
            saveButtonClass: "",
            cancelButtonClass: "",
        },
        headerText: "Alert",
        headerSubText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        modalBodyContent: "",
        saveButtonAction: "",
    });

    const CommentForm = ({ companyId }) => {
        const initialValues = {
            comment: "",
        };

        const validationSchemaSendAlert = Yup.object().shape({
            comment: Yup.string().required("Comment is required"),
        });

        const formSubmit = (values) => {
            dispatch(adminCompanySendAlert(companyId, values))
                .then(() => {
                    setAlertModalConfig((prevState) => ({
                        ...prevState,
                        modalVisible: false,
                    }));
                })
                .catch(() => {
                    setAlertModalConfig((prevState) => ({
                        ...prevState,
                        modalVisible: false,
                    }));
                });
        };

        return (
            <Formik
                initialValues={{
                    ...initialValues,
                }}
                onSubmit={formSubmit}
                validationSchema={validationSchemaSendAlert}
            >
                <Form>
                    <Stack>
                        <TextAreaField
                            name="comment"
                            label="Comment"
                            rowsMin={3}
                            rowsMax={5}
                            textAreaStyle={{ fontSize: "1.125rem" }}
                        />
                    </Stack>
                    <Grid display="flex" sx={{ marginTop: "1rem" }}>
                        <ButtonWrapper type="submit" variant="contained">
                            Submit
                        </ButtonWrapper>
                    </Grid>
                </Form>
            </Formik>
        );
    };

    const columns = [
        {
            Header: "Framework",
            accessor: (item) => <> 2021-2024</>
        },
        {
            Header: "Facility UBI",
            accessor: "facility_ubi",
            accessorKey: "facility_ubi",
            isSearch: true,
        },
        {
            Header: "Company name",
            accessor: "company_name",
            accessorKey: "company_name",
            isSearch: true,
        },
        {
            Header: "User name",
            accessor: "first_name",
            accessorKey: "first_name",
            isSearch: true,
        },
        {
            Header: "Application stage",
            accessor: (item) => <>{item?.facility_id_general_status == 0 ? 'Draft' :
            item?.facility_id_general_status == 1 ? 'Create Facility' :
            item?.facility_id_general_status == 2 ? 'Enter Facility Data' :
            item?.facility_id_general_status == 3 ? 'Submit Facility' :
            item?.facility_id_general_status == 3 ? 'Accept Baseline Modal' :
            'Program Start'
            }</>,
        },
        {
            Header: "Actions",
            accessor: (item) => (
                <Box 
                display="flex"
                columnGap={1}
                sx={{
                  flexWrap: "wrap",
                  justifyItems: "flex-start",
                  textWrap: "nowrap",
                }}
                onClick={(e) => e.stopPropagation()}>
                    <Button
                        disableRipple
                        color="error"
                        style={{
                            backgroundColor: "transparent",
                            padding: 0,
                            minWidth: "unset",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => openDeleteFacilityModal(item.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        disableRipple
                        style={{
                            color: "#2C77E9",
                            backgroundColor: "transparent",
                            padding: 0,
                            minWidth: "unset",
                            marginLeft: "1rem",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => openAlertModal(item?.company_id)}
                    >
                        Alert
                    </Button>
                    <Button
                        disableRipple
                        style={{
                            color: "#F26D04",
                            backgroundColor: "transparent",
                            padding: 0,
                            minWidth: "unset",
                            marginLeft: "1rem",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => openAlertModal(item?.company_id)}
                        disabled
                    >
                        Logs
                    </Button>
                    <Button
                        disableRipple
                        style={{
                            color: "#2C77E9",
                            backgroundColor: "transparent",
                            padding: 0,
                            minWidth: "unset",
                            marginLeft: "1rem",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => navigate(`/facility-list/edit-facility/${item?.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        disableRipple
                        style={{
                            color: "#56B2AE",
                            backgroundColor: "transparent",
                            padding: 0,
                            minWidth: "unset",
                            fontSize: "0.875rem",
                        }}
                        onClick={() => handelNavigateManagePermissions(item) }
                    >
                        Manage access
                    </Button>
                </Box>
            ),
        },
    ];


    const handelNavigateManagePermissions = (item)=> {
        const data = {
            companyId: item?.company_id, 
            companyName : item?.company_name,
            facilityId: item?.id,
            facilityUBI: item?.facility_ubi
        }
    
        navigate(`/facility-list/${item?.id}/manage-access`, {state: data })
        console.log('handelNavigate',item)
    }


    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container mt={4} mb={4}>
                
                        <Grid container xs={12} gap={4} justifyContent="flex-end">
                            <Grid item alignContent="center">
                                <Button
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#007398",
                                        padding: 0,
                                        minWidth: "unset",
                                        fontSize: "0.875rem",
                                    }}
                                    disableRipple
                                    startIcon={
                                        <FileDownloadIcon
                                            style={{
                                                color: "text.primary",
                                                fontSize: "2rem",
                                            }}
                                        />
                                    }
                                    onClick={() => onDownloadBulkClick(pageInfo)}
                                >
                                    Download Bulk
                                </Button>
                            </Grid>
                            <Grid
                                item
                                sm={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <FormGroup className="theme-form-group theme-select-form-group">
                                    <FormControl sx={{ minWidth: "6rem" }}>
                                        <Select
                                            displayEmpty={true}
                                            className="transparent-border"
                                            value={customizeFilter}
                                            disabled={true}
                                        // onChange={(e) => setColumnFilter(e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Customize Columns</em>
                                            </MenuItem>
                                            {customizeColumnsDropdownData?.map((item) => (
                                                <MenuItem key={item?.id} value={item?.id}>
                                                    {item?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <EvThemeTable
                        tableClass="enerva-customer-table"
                        customTableStyles={commonTableStyle}
                        columns={columns}
                        data={adminFacilityData}
                        headbgColor="rgba(217, 217, 217, 0.2)"
                        count={adminFacilityCount}
                        pageInfo={pageInfo}
                        setPageInfo={setPageInfo}
                        searchData={searchData}
                        setSearchData={setSearchData}
                        sortColumn={sortColumn}
                        sortOrder={sortOrder}
                        setSortColumn={setSortColumn}
                        setSortOrder={setSortOrder}
                     

                    />
                    {/* <Table
                        columns={columns}
                        data={adminFacilityData}
                        count={adminFacilityCount}
                        pageInfo={pageInfo}
                        setPageInfo={setPageInfo}
                        onClick={(id) => navigate(`/facility-list/facility-details/${id}`)}
                        cursorStyle="pointer"
                        sortColumn={sortColumn}
                        sortOrder={sortOrder}
                        setSortColumn={setSortColumn}
                        setSortOrder={setSortOrder}
                    /> */}
                </Grid>
            </Grid>
            <EvModal
                modalConfig={modalConfig}
                setModalConfig={setModalConfig}
                actionButtonData={facilityToDelete}
            />
            <EvModal
                modalConfig={alertModalConfig}
                setModalConfig={setAlertModalConfig}
            />
        </Container>
    );
};

export default FacilityEnrolledInProcess;
