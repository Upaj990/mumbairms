import { Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography, Modal, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState, useMemo } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import NumberFormat from 'react-number-format';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { IoMdClose } from 'react-icons/io';
import _ from '../../config';
import { BASE_URL, FILE_URL, PATH } from '../../api';
import 'reactjs-popup/dist/index.css';
import MapComponent from './MapComponent';
import './style.css';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import './style.css';


// import Modal from 'react-modal';

const theme = createTheme({
    palette: {
        secondary: {
            main: _.colors.colorDarkGray,
            contrastText: _.colors.colorWhite
        },
        primary: {
            main: _.colors.colorOrange,
            contrastText: _.colors.colorWhite
        }
    }
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
const NumberFormatCustom = React.forwardRef<NumberFormat<any>, CustomProps>(
    function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                //thousandSeparator
                isNumericString
            //prefix="₹"
            />
        );
    },
);

function AddNewRestaurant() {
    const mediaQuery = useMediaQuery('(min-width:600px)');
    const { pathname } = useLocation();
    const navigation = useNavigate()
    const { state }: any = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState<any>({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message: null,
        type: 'error'
    });
    const { vertical, horizontal, open, message, type } = openSnackbar;
    const snackbarClick = () => {
        setOpenSnackbar({ ...openSnackbar, open: true });
    };

    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpenSnackbar({ ...openSnackbar, open: false });
    };
    const [loading, setloading] = useState(false)
    const [managersList, setmanagersList] = useState([])
    const [weeksList, setweeksList] = useState([])
    const [cuisinesList, setcuisinesList] = useState([])
    const [manager, setmanager] = useState<any>([])
    const [restaurantName, setrestaurantName] = useState('')
    const [restaurantContactNumber, setrestaurantContactNumber] = useState('')
    const [restaurantEmail, setrestaurantEmail] = useState('')
    const [foodType, setfoodType] = useState('veg')
    const [billWidth, setbillWidth] = useState('58')
    const [restaurantAddress, setrestaurantAddress] = useState('')
    const [city, setcity] = useState('')
    const [state_, setstate_] = useState('')
    const [latitude, setlatitude] = useState('')
    const [longitude, setlongitude] = useState('')
    const [cuisines, setcuisines] = useState<any>([])
    const [GSTIN_number, setGSTIN_number] = useState('')
    const [GST_state, setGST_state] = useState('')
    const [FSSAI_number, setFSSAI_number] = useState('')
    const [aadharCopyURI, setaadharCopyURI] = useState<any>(null)
    const [panCopyURI, setpanCopyURI] = useState<any>(null)
    const [restaurantLogoURI, setrestaurantLogoURI] = useState<any>(null)
    const [restaurantCoverURI, setrestaurantCoverURI] = useState<any>(null)
    const [IGST_toggle, setIGST_toggle] = useState('yes')
    const [IGST_amount, setIGST_amount] = useState('')
    const [IGST_type, setIGST_type] = useState('percentage')
    const [SGST_toggle, setSGST_toggle] = useState('yes')
    const [SGST_amount, setSGST_amount] = useState('')
    const [SGST_type, setSGST_type] = useState('percentage')
    const [CGST_toggle, setCGST_toggle] = useState('yes')
    const [CGST_amount, setCGST_amount] = useState('')
    const [CGST_type, setCGST_type] = useState('percentage')
    const [serviceTax_toggle, setserviceTax_toggle] = useState('yes')
    const [serviceTax_amount, setserviceTax_amount] = useState('')
    const [serviceTax_type, setserviceTax_type] = useState('percentage')
    const [assignMonday, setassignMonday] = useState(false);
    const [lat, setlat] = useState(0);
    const [lon, setlon] = useState(0);

    {/*{ Restaurant timings }*/ }
    const [mondayOpening, setmondayOpening] = useState<Date | null>(null);
    const [mondayClosing, setmondayClosing] = useState<Date | null>(null);
    const [tuesdayOpening, settuesdayOpening] = useState<Date | null>(null);
    const [tuesdayClosing, settuesdayClosing] = useState<Date | null>(null);
    const [WednesdayOpening, setWednesdayOpening] = useState<Date | null>(null);
    const [WednesdayClosing, setWednesdayClosing] = useState<Date | null>(null);
    const [thursdayOpening, setthursdayOpening] = useState<Date | null>(null);
    const [thursdayClosing, setthursdayClosing] = useState<Date | null>(null);
    const [fridayOpening, setfridayOpening] = useState<Date | null>(null);
    const [fridayClosing, setfridayClosing] = useState<Date | null>(null);
    const [saturdayOpening, setsaturdayOpening] = useState<Date | null>(null);
    const [saturdayClosing, setsaturdayClosing] = useState<Date | null>(null);
    const [sundayOpening, setsundayOpening] = useState<Date | null>(null);
    const [SundayClosing, setSundayClosing] = useState<Date | null>(null);
    {/*{ Closed on }*/ }
    const [closedOn, setclosedOn] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        IGST_toggle === 'no' && setIGST_amount('')
        SGST_toggle === 'no' && setSGST_amount('')
        CGST_toggle === 'no' && setCGST_amount('')
        serviceTax_toggle === 'no' && setserviceTax_amount('')
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     console.log("Latitude is :", position.coords.latitude);
        //     console.log("Longitude is :", position.coords.longitude);
        //   });
    }, [IGST_toggle, SGST_toggle, CGST_toggle, serviceTax_toggle])

    const _aadharCopyHandler = (event: any) => {
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setaadharCopyURI({ uri: e.target?.result, file: event.target.files[0] })
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3
    };

    const handleOpen = () => {
        navigation('/admin/map-component')
    };
    const handleClose = () => {
        // window.location.reload(1);
        // setLoading(true)
        setOpenModal(false);
        // setloading(false);
    };

    const _panCopyHandler = (event: any) => {
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setpanCopyURI({ uri: e.target?.result, file: event.target.files[0] })
        }
    }
    const _restaurantLogoHandler = (event: any) => {
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setrestaurantLogoURI({ uri: e.target?.result, file: event.target.files[0] })
        }
    }
    const _restaurantCoverHandler = (event: any) => {
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setrestaurantCoverURI({ uri: e.target?.result, file: event.target.files[0] })
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _list_of_weeks = () => {
        setloading(true)
        var axios = require('axios');
        var config = {
            method: 'post',
            url: BASE_URL + PATH.LIST_OF_WEEKS,
            headers: {}
        };

        axios(config)
            .then(function (response: any) {
                console.log(JSON.stringify(response.data));
                setloading(false)
                if (response.data.status) {
                    setweeksList(response.data.data)
                } else {

                }
            })
            .catch(function (error: any) {
                console.log(error);
                setloading(false)
            });
    }

    useEffect(() => {
        _list_of_weeks()
    }, [])


    const _listOfManagers = () => {
        setloading(true)
        var axios = require('axios');
        var config = {
            method: 'post',
            url: BASE_URL + PATH.LIST_OF_MANAGERS,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };

        axios(config)
            .then(function (response: any) {
                console.log(JSON.stringify(response.data));
                setloading(false)
                if (response.data.status) {
                    setmanagersList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
                } else {

                }
            })
            .catch(function (error: any) {
                console.log(error);
                setloading(false)
            });
    }

    useEffect(() => {
        _listOfManagers()
    }, [])

    const _addRestaurant = () => {
        if (restaurantName.trim().length === 0 || restaurantContactNumber.trim().length === 0 || restaurantEmail.trim().length === 0 || restaurantAddress.trim().length === 0 || city.trim().length === 0 || state_.trim().length === 0 || latitude.trim().length === 0 || longitude.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'All fields are required.', type: 'error' });
        } else if (cuisines.length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Cuisines are required.', type: 'error' });
        } else if (aadharCopyURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Aadhar copy are required.', type: 'error' });
        } else if (panCopyURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Pan copy are required.', type: 'error' });
        } else if (restaurantLogoURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant logo are required.', type: 'error' });
        } else if (restaurantCoverURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant cover are required.', type: 'error' });
        } else if (IGST_toggle === 'yes' && IGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'IGST amount is required.', type: 'error' });
        } else if (SGST_toggle === 'yes' && SGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'SGST amount is required.', type: 'error' });
        } else if (CGST_toggle === 'yes' && CGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'CGST amount is required.', type: 'error' });
        } else if (serviceTax_toggle === 'yes' && serviceTax_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Service Charge amount is required.', type: 'error' });
        } else if (restaurantContactNumber.trim().length < 10) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter valid mobile number.', type: 'error' });
        } else if (GSTIN_number.trim().length > 0 && GSTIN_number.trim().length < 15) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter 15 characters GSTIN number.', type: 'error' });
        } else if (FSSAI_number.trim().length > 0 && FSSAI_number.trim().length < 14) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter 14 digit FSSAI number.', type: 'error' });
        } else if (billWidth.trim().length ===0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please select enter bill width', type: 'error' });      
        } else if (mondayOpening === null || mondayClosing === null || tuesdayOpening === null || tuesdayClosing === null || WednesdayOpening === null || WednesdayClosing === null || thursdayOpening === null || thursdayClosing === null || fridayOpening === null || fridayClosing === null || saturdayOpening === null || saturdayClosing === null || sundayOpening === null || SundayClosing === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant timings is required.', type: 'error' });
        } else {
            const latlong = { latitude: latitude.trim(), longitude: longitude.trim() }
            const address = { address: restaurantAddress.trim(), city: city.trim(), state: state_.trim() }
            const restaurantTimings = {
                monday: { open: mondayOpening, close: mondayClosing },
                tuesday: { open: tuesdayOpening, close: tuesdayClosing },
                Wednesday: { open: WednesdayOpening, close: WednesdayClosing },
                thursday: { open: thursdayOpening, close: thursdayClosing },
                friday: { open: fridayOpening, close: fridayClosing },
                saturday: { open: saturdayOpening, close: saturdayClosing },
                sunday: { open: sundayOpening, close: SundayClosing }
            }
            setloading(true)
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            manager.forEach((file: any) => {
                data.append("manager", file._id);
            });
            data.append('restaurant_name', restaurantName.trim());
            data.append('restaurant_contact_number', restaurantContactNumber.trim());
            data.append('restaurant_email', restaurantEmail.trim());
            data.append('food_type', foodType);
            data.append('restaurant_address', JSON.stringify(address));
            data.append('latLong', JSON.stringify(latlong));
            cuisines.forEach((file: any) => {
                data.append("cuisines", file._id);
            });
            data.append('GSTIN_number', GSTIN_number.trim());
            data.append('GST_state', GST_state.trim());
            data.append('FSSAI_number', FSSAI_number.trim());
            data.append('aadhar_copy', aadharCopyURI.file);
            data.append('pan_copy', panCopyURI.file);
            data.append('IGST_toggle', IGST_toggle);
            data.append('IGST_amount', IGST_amount.trim());
            data.append('IGST_type', IGST_type);
            data.append('SGST_toggle', SGST_toggle);
            data.append('SGST_amount', SGST_amount.trim());
            data.append('SGST_type', SGST_type);
            data.append('CGST_toggle', CGST_toggle);
            data.append('CGST_amount', CGST_amount.trim());
            data.append('CGST_type', CGST_type.trim());
            data.append('service_tax_toggle', serviceTax_toggle);
            data.append('service_tax_amount', serviceTax_amount.trim());
            data.append('service_tax_type', serviceTax_type.trim());
            data.append('restaurant_timings', JSON.stringify(restaurantTimings));
            closedOn.forEach((file: any) => {
                data.append("closed_on", file._id);
            });
            data.append('bill_width', billWidth.trim());
            data.append('restaurant_logo', restaurantLogoURI.file);
            data.append('restaurant_cover_photo', restaurantCoverURI.file);
            data.append('active_inactive', true);

            var config = {
                method: 'post',
                url: BASE_URL + PATH.ADD_RESTAURANT,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                data: data
            };

            axios(config)
                .then(function (response: any) {
                    console.log(JSON.stringify(response.data));
                    setloading(false)
                    if (response.data.status) {
                        setOpenSnackbar({ ...openSnackbar, open: true, message: response.data.message, type: 'success' });
                        navigation('/admin/restaurant/restaurants-list')
                    } else {
                        setOpenSnackbar({ ...openSnackbar, open: true, message: response.data.message, type: 'error' });
                    }
                })
                .catch(function (error: any) {
                    console.log(error);
                    setloading(false)
                });
        }
    }

    const _editData = () => {
        const managerFillter = managersList.filter(({ _id: id1 }: any) => state?.data?.manager.some(({ _id: id2 }: any) => id2 === id1))
        const cuisinesFillter = cuisinesList.filter(({ _id: id1 }: any) => state?.data?.cuisines.some(({ _id: id2 }: any) => id2 === id1))
        const closedOnFillter = weeksList.filter(({ _id: id1 }: any) => state?.data?.closed_on.some(({ _id: id2 }: any) => id2 === id1))
        setmanager(managerFillter)
        setrestaurantName(state?.data?.restaurant_name)
        setrestaurantContactNumber(state?.data?.restaurant_contact_number)
        setbillWidth(state?.data?.bill_width)
        setrestaurantEmail(state?.data.restaurant_email)
        setfoodType(state?.data.food_type)
        setrestaurantAddress(state?.data.restaurant_address.address)
        setcity(state?.data.restaurant_address.city)
        setstate_(state?.data.restaurant_address.state)
        setlatitude(state?.data.latLong.latitude)
        setlongitude(state?.data.latLong.longitude)
        setcuisines(cuisinesFillter)
        setGSTIN_number(state?.data?.GSTIN_number)
        setGST_state(state?.data?.GST_state)
        setFSSAI_number(state?.data?.FSSAI_number)
        setaadharCopyURI({ uri: FILE_URL + state?.data?.aadhar_copy.path, file: { name: state?.data?.aadhar_copy.filename }, from: 'EDIT' })
        setpanCopyURI({ uri: FILE_URL + state?.data?.pan_copy.path, file: { name: state?.data?.pan_copy.filename }, from: 'EDIT' })
        setrestaurantLogoURI({ uri: FILE_URL + state?.data?.restaurant_logo.path, file: { name: state?.data?.restaurant_logo.filename }, from: 'EDIT' })
        setrestaurantCoverURI({ uri: FILE_URL + state?.data?.restaurant_cover_photo.path, file: { name: state?.data?.restaurant_cover_photo.filename }, from: 'EDIT' })
        setIGST_toggle(state?.data?.IGST_toggle)
        setIGST_amount(state?.data?.IGST_amount)
        setIGST_type(state?.data?.IGST_type)
        setSGST_toggle(state?.data?.SGST_toggle)
        setSGST_amount(state?.data?.SGST_amount)
        setSGST_type(state?.data?.SGST_type)
        setCGST_toggle(state?.data?.CGST_toggle)
        setCGST_amount(state?.data?.CGST_amount)
        setCGST_type(state?.data?.CGST_type)
        setserviceTax_toggle(state?.data?.service_tax_toggle)
        setserviceTax_amount(state?.data?.service_tax_amount)
        setserviceTax_type(state?.data?.service_tax_type)
        setclosedOn(closedOnFillter)
        {/*{ Restaurant timings }*/ }
        setmondayOpening(state?.data?.restaurant_timings.monday.open)
        setmondayClosing(state?.data?.restaurant_timings.monday.close)
        settuesdayOpening(state?.data?.restaurant_timings.tuesday.open)
        settuesdayClosing(state?.data?.restaurant_timings.tuesday.close)
        setWednesdayOpening(state?.data?.restaurant_timings.Wednesday.open)
        setWednesdayClosing(state?.data?.restaurant_timings.Wednesday.close)
        setthursdayOpening(state?.data?.restaurant_timings.thursday.open)
        setthursdayClosing(state?.data?.restaurant_timings.thursday.close)
        setfridayOpening(state?.data?.restaurant_timings.friday.open)
        setfridayClosing(state?.data?.restaurant_timings.friday.close)
        setsaturdayOpening(state?.data?.restaurant_timings.saturday.open)
        setsaturdayClosing(state?.data?.restaurant_timings.saturday.close)
        setsundayOpening(state?.data?.restaurant_timings.sunday.open)
        setSundayClosing(state?.data?.restaurant_timings.sunday.close)
    }

    useEffect(() => {
        state && _editData()
    }, [cuisinesList, managersList])


    const _updateRestaurant = () => {
        if (restaurantName.trim().length === 0 || restaurantContactNumber.trim().length === 0 || restaurantEmail.trim().length === 0 || restaurantAddress.trim().length === 0 || city.trim().length === 0 || state_.trim().length === 0 || latitude.trim().length === 0 || longitude.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'All fields are required.', type: 'error' });
        } else if (cuisines.length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Cuisines are required.', type: 'error' });
        } else if (aadharCopyURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Aadhar copy are required.', type: 'error' });
        } else if (panCopyURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Pan copy are required.', type: 'error' });
        } else if (restaurantLogoURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant logo are required.', type: 'error' });
        } else if (restaurantCoverURI === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant cover are required.', type: 'error' });
        } else if (IGST_toggle === 'yes' && IGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'IGST amount is required.', type: 'error' });
        } else if (SGST_toggle === 'yes' && SGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'SGST amount is required.', type: 'error' });
        } else if (CGST_toggle === 'yes' && CGST_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'CGST amount is required.', type: 'error' });
        } else if (serviceTax_toggle === 'yes' && serviceTax_amount.trim().length === 0) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Service Charge amount is required.', type: 'error' });
        } else if (restaurantContactNumber.trim().length < 10) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter valid mobile number.', type: 'error' });
        } else if (GSTIN_number.trim().length > 0 && GSTIN_number.trim().length < 15) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter 15 characters GSTIN number.', type: 'error' });
        } else if (FSSAI_number.trim().length > 0 && FSSAI_number.trim().length < 14) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please enter 14 digit FSSAI number.', type: 'error' });
        } else if (mondayOpening === null || mondayClosing === null || tuesdayOpening === null || tuesdayClosing === null || WednesdayOpening === null || WednesdayClosing === null || thursdayOpening === null || thursdayClosing === null || fridayOpening === null || fridayClosing === null || saturdayOpening === null || saturdayClosing === null || sundayOpening === null || SundayClosing === null) {
            setOpenSnackbar({ ...openSnackbar, open: true, message: 'Restaurant timings is required.', type: 'error' });
        } else {
            const latlong = { latitude: latitude.trim(), longitude: longitude.trim() }
            const address = { address: restaurantAddress.trim(), city: city.trim(), state: state_.trim() }
            const restaurantTimings = {
                monday: { open: mondayOpening, close: mondayClosing },
                tuesday: { open: tuesdayOpening, close: tuesdayClosing },
                Wednesday: { open: WednesdayOpening, close: WednesdayClosing },
                thursday: { open: thursdayOpening, close: thursdayClosing },
                friday: { open: fridayOpening, close: fridayClosing },
                saturday: { open: saturdayOpening, close: saturdayClosing },
                sunday: { open: sundayOpening, close: SundayClosing }
            }
            setloading(true)
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            data.append('id', state?.data?._id);
            manager.forEach((file: any) => {
                data.append("manager", file._id);
            });
            data.append('restaurant_name', restaurantName.trim());
            data.append('restaurant_contact_number', restaurantContactNumber.trim());
            data.append('restaurant_email', restaurantEmail.trim());
            data.append('food_type', foodType);
            data.append('restaurant_address', JSON.stringify(address));
            data.append('latLong', JSON.stringify(latlong));
            cuisines.forEach((file: any) => {
                data.append("cuisines", file._id);
            });
            data.append('GSTIN_number', GSTIN_number.trim());
            data.append('GST_state', GST_state.trim());
            data.append('FSSAI_number', FSSAI_number.trim());
            data.append('aadhar_copy', aadharCopyURI.from === 'EDIT' ? null : aadharCopyURI.file);
            data.append('pan_copy', panCopyURI.from === 'EDIT' ? null : panCopyURI.file);
            data.append('IGST_toggle', IGST_toggle);
            data.append('IGST_amount', IGST_amount.trim());
            data.append('IGST_type', IGST_type);
            data.append('SGST_toggle', SGST_toggle);
            data.append('SGST_amount', SGST_amount.trim());
            data.append('SGST_type', SGST_type);
            data.append('CGST_toggle', CGST_toggle);
            data.append('CGST_amount', CGST_amount.trim());
            data.append('CGST_type', CGST_type.trim());
            data.append('service_tax_toggle', serviceTax_toggle);
            data.append('service_tax_amount', serviceTax_amount.trim());
            data.append('service_tax_type', serviceTax_type.trim());
            data.append('restaurant_timings', JSON.stringify(restaurantTimings));
            closedOn.forEach((file: any) => {
                data.append("closed_on", file._id);
            });
            data.append('bill_width', billWidth.trim());
            data.append('restaurant_logo', restaurantLogoURI.from === 'EDIT' ? null : restaurantLogoURI.file);
            data.append('restaurant_cover_photo', restaurantCoverURI.from === 'EDIT' ? null : restaurantCoverURI.file);

            var config = {
                method: 'post',
                url: BASE_URL + PATH.UPDATE_RESTAURANT,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                data: data
            };

            axios(config)
                .then(function (response: any) {
                    console.log(JSON.stringify(response.data));
                    setloading(false)
                    if (response.data.status) {
                        setOpenSnackbar({ ...openSnackbar, open: true, message: 'update restaurant successful !', type: 'success' });
                        navigation('/admin/restaurant/restaurants-list')
                    } else {
                        setOpenSnackbar({ ...openSnackbar, open: true, message: 'Something went wrong !', type: 'error' });
                    }
                })
                .catch(function (error: any) {
                    console.log(error);
                    setloading(false)
                });
        }
    }

    const _onClickSubmit = () => {
        state ? _updateRestaurant() : _addRestaurant();
        localStorage.removeItem('pickdata');
        localStorage.removeItem('pick');
    }

    const _listOfCuisines = () => {
        setloading(true)
        var axios = require('axios');
        var config = {
            method: 'post',
            url: BASE_URL + PATH.LIST_OF_CUISINES,
            headers: {}
        };

        axios(config)
            .then(function (response: any) {
                console.log(JSON.stringify(response.data));
                setloading(false)
                if (response.data.status) {
                    setcuisinesList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
                }
            })
            .catch(function (error: any) {
                console.log(error);
                setloading(false)
            });
    }

    // const _handleLatlong = () => {
    //     navigation('/admin/map-component')
    // }




    // const PlacesAutocomplete = ({ setSelected }: any) => {
    //     const {
    //         ready,
    //         value,
    //         setValue,
    //         suggestions: { status, data },
    //         clearSuggestions,
    //     } = usePlacesAutocomplete();

    //     const handleSelect = async (address: any) => {
    //         setValue(address, false);
    //         clearSuggestions();

    //         const results = await getGeocode({ address });
    //         const { lat, lng } = await getLatLng(results[0]);
    //         setSelected({ lat, lng });
    //     };

    //     return (
    //         <Combobox onSelect={handleSelect} style={{ zIndex: "500000000" }}>
    //             <ComboboxInput
    //                 value={value}
    //                 onChange={(e) => setValue(e.target.value)}
    //                 disabled={!ready}
    //                 className="combobox-input"
    //                 // style={{ width: 300, maxWidth: "100%", padding: "0.5rem", zIndex: "100 !important" }}
    //                 placeholder="Address"
    //             />
    //             <ComboboxPopover >
    //                 <ComboboxList>
    //                     {status === "OK" &&
    //                         data.map(({ place_id, description }: any) => (
    //                             //  { console.log(description)};
    //                             <ComboboxOption key={place_id} value={description} />
    //                         ))}
    //                 </ComboboxList>
    //             </ComboboxPopover>
    //         </Combobox>
    //     );
    // };



    // function MapComponent() {
    //     const [selected, setSelected] = useState(null);
    //     const [latitude, setlatitude] = useState(0);
    //     const [longitude, setlongitude] = useState(0);
    //     const [lati, setLatitude] = useState(0);
    //     const [long, setLongitude] = useState(0);
    //     const [loading, setloading] = useState(false)

    //     // const [lat, setlatitude] = useState(0);
    //     // const [lon, setlongitude] = useState(0);

    //     const handleClickedMap = (e: any) => {
    //         let latitude = e.latLng.lat();
    //         let longtitude = e.latLng.lng();
    //         setlat(latitude);
    //         setlon(longtitude);
    //         // localStorage.setItem('Local_lat', String(latitude));
    //         // localStorage.setItem('Local_lon', String(longitude));
    //         console.log(latitude, longtitude);
    //         setOpenModal(false);
    //     }

    //     // useEffect(() => {
    //     //     // let latitude = localStorage.getItem('Local_lat');
    //     //     // setlat(Number(latitude) ? Number(latitude) : 0);
    //     //     // let longitude = localStorage.getItem('Local_lon');
    //     //     // setlon(Number(longitude) ? Number(longitude) : 0);
    //     // })

    //     navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng} }) => {

    //         setLatitude(lat)

    //         setLongitude(lng)
    //     });
    //     const center = useMemo(() => ({ lat: lati, lng: long }), [lati, long]);
    //     const { isLoaded } = useLoadScript({
    //         googleMapsApiKey: "AIzaSyCQrZ9c3sG2VfngRvb3qWUdUD2Q0ussOhY",
    //         libraries: ["places"],
    //     });

    //     if (!isLoaded) return <div>Loading...</div>;
    //     return (<>
    //         <div className="places-container">
    //             <PlacesAutocomplete setSelected={setSelected} />
    //         </div>

    //         <GoogleMap
    //             zoom={7}
    //             center={center}
    //             mapContainerClassName="map-container"
    //             onClick={handleClickedMap}
    //         >
    //             {!selected && <Marker key="marker_1"

    //                 position={{

    //                     lat: lati,

    //                     lng: long

    //                 }}

    //             />}
    //             {selected && <Marker position={selected} />}
    //         </GoogleMap>
    //         <Backdrop
    //             sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //             open={loading}>
    //             <CircularProgress color='inherit' />
    //         </Backdrop>
    //     </>)
    // }

    useEffect(() => {
        let latitude1 = localStorage.getItem('latitude');
        setlatitude ((Number(latitude1) ? Number(latitude1) : 0).toString());
        let longitude1 = localStorage.getItem('longitude');
        setlongitude((Number(longitude1) ? Number(longitude1) : 0).toString());
        setloading(true);
        _listOfCuisines()
    }, []);




    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
                <Box sx={{margin: {xs: 2, sm: 0}, display: 'flex', zIndex: -100 }}>
                    <Grid container lg={12} sm={12} md={12} xs={12}>
                        <Grid lg={12} sm={12} md={12} xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Link underline='none' onClick={() => navigation('/admin/dashboard')} sx={{ color: _.colors.colorDarkGray, ":hover": { color: _.colors.colorOrange } }}>Home</Link>
                            <CgFormatSlash color={_.colors.colorDarkGray} size={20} />
                            <Link underline='none' onClick={() => navigation('/admin/orders/all')} sx={{ color: _.colors.colorDarkGray, ":hover": { color: _.colors.colorOrange } }}>restaurant</Link>
                            <CgFormatSlash color={_.colors.colorDarkGray} size={20} />
                            <Typography variant="h1" style={{ fontSize: 15, color: _.colors.colorTitle }} component="div">{state ? 'Edit-Restaurant' : 'Add-New-Restaurant'}</Typography>
                        </Grid>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 1.5 }}>
                            <Typography variant="h6" style={{ fontSize: 20, color: _.colors.colorTitle, }} component="div">{state ? 'Edit Restaurant' : 'Add New Restaurant'}</Typography>
                        </Box>
                        <Divider sx={{ color: _.colors.colorGray, width: '100%', marginTop: 2, marginBottom: 4 }} light />
                        <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                            {/* Select user */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Manager</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <Autocomplete
                                            sx={{ width: '100%' }}
                                            multiple
                                            options={managersList}
                                            defaultValue={state?.data?.manager}
                                            getOptionLabel={(option: any) => option.name}
                                            filterOptions={(options) =>
                                                options.filter(({ _id: id1 }: any) => !state?.data?.manager.some(({ _id: id2 }: any) => id2 === id1))
                                            }
                                            filterSelectedOptions
                                            onChange={(event: any, values: any) => {
                                                setmanager(values)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size='small' color='secondary'
                                                    hiddenLabel
                                                />
                                            )} />
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Restaurant */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant name' : 'Name'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={restaurantName} onChange={(prop) => setrestaurantName(prop.target.value)} color='secondary' size='small' label="Enter restaurant name" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Table */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant contact number' : 'Contact'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={restaurantContactNumber}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }}
                                        inputProps={{ maxLength: 10 }}
                                        disabled={state ? true : false}
                                        onChange={(prop) => { setrestaurantContactNumber(prop.target.value) }}
                                        color='secondary' size='small' label="Enter restaurant contact number" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Category */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant email' : 'Email'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={restaurantEmail} disabled={state ? true : false} onChange={(prop) => setrestaurantEmail(prop.target.value)} color='secondary' size='small' label="Enter restaurant email" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Food Type</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="veg" onChange={(props: any) => setfoodType(props.target.value)} checked={foodType === 'veg'} control={<Radio />} label="Veg " />
                                            <FormControlLabel value="non_veg" onChange={(props: any) => setfoodType(props.target.value)} checked={foodType === 'non_veg'} control={<Radio />} label="Non-veg" />
                                            <FormControlLabel value="both" onChange={(props: any) => setfoodType(props.target.value)} checked={foodType === 'both'} control={<Radio />} label="Both" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Category */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant address' : 'Address'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={restaurantAddress} onChange={(prop) => setrestaurantAddress(prop.target.value)} color='secondary' size='small' label="Enter restaurant address" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Category */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">City</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={city} onChange={(prop) => setcity(prop.target.value)} color='secondary' size='small' label="Enter city" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Category */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">State</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={state_} onChange={(prop) => setstate_(prop.target.value)} color='secondary' size='small' label="Enter state" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Category */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Country</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField defaultValue={'India'} disabled color='secondary' size='small' hiddenLabel={true} variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Latitude</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField InputProps={{
                                        inputComponent: NumberFormatCustom as any,
                                    }} value={latitude} onChange={(prop) => setlatitude(prop.target.value)} color='secondary' size='small' label="Enter latitude" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>

                                <Button onClick={handleOpen} sx={{ backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' }, textTransform: 'none', marginBottom: 0.5, marginLeft: 2, paddingTop: 0.8, paddingBottom: 0.8 }} size='small' variant="contained">{mediaQuery ? 'Pick Latitude/Longitude' : 'Pick Lat/Long'}</Button>
                                {/* <Modal
                                    hideBackdrop
                                    open={openModal}
                                    // onClose={handleClose}
                                    aria-labelledby="child-modal-title"
                                    aria-describedby="child-modal-description"
                                >
                                    <Box sx={{ ...style, width: 750 }}>
                                        <MapComponent />
                                        <Button onClick={handleClose} sx={{ backgroundColor: _.colors.colorBlack, textTransform: 'none', marginBottom: 0.5, marginLeft: 85, marginTop: 1, paddingTop: 0.8, paddingBottom: 0.8 }} size='small' variant="contained">Close</Button>

                                    </Box>
                                </Modal> */}



                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Longitude</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField InputProps={{
                                        inputComponent: NumberFormatCustom as any,
                                    }} value={longitude} onChange={(prop) => setlongitude(prop.target.value)} color='secondary' size='small' label="Enter longitude" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Cuisines</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <Autocomplete
                                            sx={{ width: '100%' }}
                                            multiple
                                            options={cuisinesList}
                                            defaultValue={state?.data?.cuisines}
                                            getOptionLabel={(option: any) => option.name}
                                            filterOptions={(options) =>
                                                options.filter(({ _id: id1 }: any) => !state?.data?.cuisines.some(({ _id: id2 }: any) => id2 === id1))
                                            }
                                            filterSelectedOptions
                                            onChange={(event: any, values: any) => {
                                                setcuisines(values)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size='small' color='secondary'
                                                />
                                            )} />
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">GSTIN number</Typography>
                                    <FaStarOfLife color={_.colors.colorWhite} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={GSTIN_number} onChange={(prop) => setGSTIN_number(prop.target.value)} inputProps={{ maxLength: 15 }} color='secondary' size='small' label="Enter GSTIN number" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">GST state</Typography>
                                    <FaStarOfLife color={_.colors.colorWhite} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={GST_state} onChange={(prop) => setGST_state(prop.target.value)} color='secondary' size='small' label="Enter GST state" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">FSSAI number</Typography>
                                    <FaStarOfLife color={_.colors.colorWhite} size={8} />
                                </Box>
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                    <TextField value={FSSAI_number}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }}
                                        inputProps={{ maxLength: 14 }}
                                        onChange={(prop) => {
                                            setFSSAI_number(prop.target.value)
                                        }}
                                        color='secondary' size='small' label="Enter FSSAI number" variant="outlined"
                                        sx={{ width: '100%' }} />
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Aadhar copy</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', marginLeft: {xs: 15, sm: 28} }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextField sx={{ width: '100%' }} size={'small'} value={aadharCopyURI ? aadharCopyURI?.file?.name : 'Choose file'} variant='outlined' defaultValue='Choose file' disabled />
                                            <Button disableElevation sx={{ width: '20%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' }, textTransform: 'none', marginLeft: 1 }} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_aadharCopyHandler} hidden /></Button>
                                        </Box>
                                        <Box sx={{ height: '160px', width: {xs: '140px', sm: '300px'}, marginTop: 2, position: 'relative' }}>
                                            {aadharCopyURI &&
                                                <Box sx={{ backgroundColor: _.colors.colorWhite, borderRadius: 100, position: 'absolute', top: 10, right: 10, boxShadow: 6 }}>
                                                    <IconButton onClick={() => setaadharCopyURI(null)} sx={{}} size="small">
                                                        <IoMdClose color={_.colors.colorTitle} size={16} />
                                                    </IconButton>
                                                </Box>
                                            }
                                            <img src={aadharCopyURI ? aadharCopyURI?.uri : 'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                                style={{ height: '160px', width: mediaQuery ? '300px' : '140px', borderRadius: 10, objectFit: 'cover', marginBottom: 10 }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">PAN copy</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', marginLeft: {xs: 15, sm: 28} }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextField sx={{ width: '100%' }} size={'small'} value={panCopyURI ? panCopyURI?.file?.name : 'Choose file'} variant='outlined' defaultValue='Choose file' disabled />
                                            <Button disableElevation sx={{ width: '20%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' }, textTransform: 'none', marginLeft: 1 }} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_panCopyHandler} hidden /></Button>
                                        </Box>
                                        <Box sx={{ height: '160px', width: {xs: '140px', sm: '300px'}, marginTop: 2, position: 'relative' }}>
                                            {panCopyURI &&
                                                <Box sx={{ backgroundColor: _.colors.colorWhite, borderRadius: 100, position: 'absolute', top: 10, right: 10, boxShadow: 6 }}>
                                                    <IconButton onClick={() => setpanCopyURI(null)} sx={{}} size="small">
                                                        <IoMdClose color={_.colors.colorTitle} size={16} />
                                                    </IconButton>
                                                </Box>
                                            }
                                            <img src={panCopyURI ? panCopyURI?.uri : 'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                                style={{ height: '100%', width: mediaQuery ? '300px' : '140px', borderRadius: 10, objectFit: 'cover', marginBottom: 10 }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">IGST</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="yes" onChange={(props: any) => setIGST_toggle(props.target.value)} checked={IGST_toggle === 'yes'} control={<Radio />} label="Yes " />
                                            <FormControlLabel value="no" onChange={(props: any) => setIGST_toggle(props.target.value)} checked={IGST_toggle === 'no'} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            {IGST_toggle === 'yes' &&
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                        <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Enter Amount</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8} />
                                    </Box>
                                    <Box sx={{ width: {xs: '50%', sm: '30%'}, display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28}, marginRight: 2 }}>
                                        <TextField InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }} value={IGST_amount} onChange={(prop) => setIGST_amount(prop.target.value)} color='secondary' size='small' label="Enter amount" variant="outlined"
                                            sx={{ width: '100%' }} />
                                    </Box>
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                        <FormControlLabel value="percentage" onChange={(props: any) => setIGST_type(props.target.value)} checked={IGST_type === 'percentage'} control={<Radio />} label="Percentage" />
                                        <FormControlLabel value="amount" onChange={(props: any) => setIGST_type(props.target.value)} checked={IGST_type === 'amount'} control={<Radio />} label="Amount" />
                                    </RadioGroup>
                                </Box>}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">SGST</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="yes" onChange={(props: any) => setSGST_toggle(props.target.value)} checked={SGST_toggle === 'yes'} control={<Radio />} label="Yes " />
                                            <FormControlLabel value="no" onChange={(props: any) => setSGST_toggle(props.target.value)} checked={SGST_toggle === 'no'} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            {SGST_toggle === 'yes' &&
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                        <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Enter Amount</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8} />
                                    </Box>
                                    <Box sx={{ width: {xs: '50%', sm: '30%'}, display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28}, marginRight: 2 }}>
                                        <TextField InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }} value={SGST_amount} onChange={(prop) => setSGST_amount(prop.target.value)} color='secondary' size='small' label="Enter amount" variant="outlined"
                                            sx={{ width: '100%' }} />
                                    </Box>
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                        <FormControlLabel value="percentage" onChange={(props: any) => setSGST_type(props.target.value)} checked={SGST_type === 'percentage'} control={<Radio />} label="Percentage" />
                                        <FormControlLabel value="amount" onChange={(props: any) => setSGST_type(props.target.value)} checked={SGST_type === 'amount'} control={<Radio />} label="Amount" />
                                    </RadioGroup>
                                </Box>}
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">CGST</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="yes" onChange={(props: any) => setCGST_toggle(props.target.value)} checked={CGST_toggle === 'yes'} control={<Radio />} label="Yes " />
                                            <FormControlLabel value="no" onChange={(props: any) => setCGST_toggle(props.target.value)} checked={CGST_toggle === 'no'} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            {CGST_toggle === 'yes' &&
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                        <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Enter Amount</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8} />
                                    </Box>
                                    <Box sx={{ width: {xs: '50%', sm: '30%'}, display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28}, marginRight: 2 }}>
                                        <TextField InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }} value={CGST_amount} onChange={(prop) => setCGST_amount(prop.target.value)} color='secondary' size='small' label="Enter amount" variant="outlined"
                                            sx={{ width: '100%' }} />
                                    </Box>
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                        <FormControlLabel value="percentage" onChange={(props: any) => setCGST_type(props.target.value)} checked={CGST_type === 'percentage'} control={<Radio />} label="Percentage" />
                                        <FormControlLabel value="amount" onChange={(props: any) => setCGST_type(props.target.value)} checked={CGST_type === 'amount'} control={<Radio />} label="Amount" />
                                    </RadioGroup>
                                </Box>}
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Service Charge</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="yes" onChange={(props: any) => setserviceTax_toggle(props.target.value)} checked={serviceTax_toggle === 'yes'} control={<Radio />} label="Yes " />
                                            <FormControlLabel value="no" onChange={(props: any) => setserviceTax_toggle(props.target.value)} checked={serviceTax_toggle === 'no'} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            {serviceTax_toggle === 'yes' &&
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2, }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                        <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Enter Amount</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8} />
                                    </Box>
                                    <Box sx={{ width: {xs: '50%', sm: '30%'}, display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28}, marginRight: 2 }}>
                                        <TextField InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }} value={serviceTax_amount} onChange={(prop) => setserviceTax_amount(prop.target.value)} color='secondary' size='small' label="Enter amount" variant="outlined"
                                            sx={{ width: '100%' }} />
                                    </Box>
                                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                        <FormControlLabel value="percentage" onChange={(props: any) => setserviceTax_type(props.target.value)} checked={serviceTax_type === 'percentage'} control={<Radio />} label="Percentage" />
                                        <FormControlLabel value="amount" onChange={(props: any) => setserviceTax_type(props.target.value)} checked={serviceTax_type === 'amount'} control={<Radio />} label="Amount" />
                                    </RadioGroup>
                                </Box>}
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'flex-start', marginTop: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant timings' : 'Timings'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', marginLeft: {xs: 0, sm: 28}, marginTop: {xs: 4, sm: 0} }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: -1.4 }}>
                                        <Checkbox color='primary'
                                            checked={assignMonday}
                                            onChange={(props: any) => {
                                                if (assignMonday) {
                                                    setassignMonday(props.target.checked)
                                                } else {
                                                    if (mondayOpening && mondayClosing) {
                                                        settuesdayOpening(mondayOpening)
                                                        settuesdayClosing(mondayClosing)
                                                        setWednesdayOpening(mondayOpening)
                                                        setWednesdayClosing(mondayClosing)
                                                        setthursdayOpening(mondayOpening)
                                                        setthursdayClosing(mondayClosing)
                                                        setfridayOpening(mondayOpening)
                                                        setfridayClosing(mondayClosing)
                                                        setsaturdayOpening(mondayOpening)
                                                        setsaturdayClosing(mondayClosing)
                                                        setsundayOpening(mondayOpening)
                                                        setSundayClosing(mondayClosing)
                                                        setassignMonday(props.target.checked)
                                                    } else {
                                                        setOpenSnackbar({ ...openSnackbar, open: true, message: 'Please add Monday timing !', type: 'error' });
                                                    }
                                                }
                                            }}
                                            {...label} defaultChecked />
                                        <Typography variant="h6" sx={{ fontSize: 14, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Assign monday timings for all days' : 'Monday timings for all days'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', paddingRight: {xs: 0 ,sm: 20} }}>
                                        {/* {Monday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Monday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'MON')}
                                                    label={"Opening"}
                                                    value={mondayOpening}
                                                    onChange={setmondayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'MON')}
                                                    label={"Closing"}
                                                    value={mondayClosing}
                                                    onChange={setmondayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Tuesday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Tuesday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'TUE')}
                                                    label={"Opening"}
                                                    value={tuesdayOpening}
                                                    onChange={settuesdayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'TUE')}
                                                    label={"Closing"}
                                                    value={tuesdayClosing}
                                                    onChange={settuesdayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Wednesday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Wednesday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'WED')}
                                                    label={"Opening"}
                                                    value={WednesdayOpening}
                                                    onChange={setWednesdayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'WED')}
                                                    label={"Closing"}
                                                    value={WednesdayClosing}
                                                    onChange={setWednesdayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Thursday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Thursday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'THU')}
                                                    label={"Opening"}
                                                    value={thursdayOpening}
                                                    onChange={setthursdayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'THU')}
                                                    label={"Closing"}
                                                    value={thursdayClosing}
                                                    onChange={setthursdayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Friday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Friday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'FRI')}
                                                    label={"Opening"}
                                                    value={fridayOpening}
                                                    onChange={setfridayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'FRI')}
                                                    label={"Closing"}
                                                    value={fridayClosing}
                                                    onChange={setfridayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Saturday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Saturday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'SAT')}
                                                    label={"Opening"}
                                                    value={saturdayOpening}
                                                    onChange={setsaturdayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'SAT')}
                                                    label={"Closing"}
                                                    value={saturdayClosing}
                                                    onChange={setsaturdayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                        {/* {Sunday} */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6, position: 'absolute' }} component="div">Sunday</Typography>
                                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'SUN')}
                                                    label={"Opening"}
                                                    value={sundayOpening}
                                                    onChange={setsundayOpening}
                                                    renderInput={(params: any) => <TextField hiddenLabel sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                                <TimePicker
                                                    disabled={closedOn.find((item: any) => item.id === 'SUN')}
                                                    label={"Closing"}
                                                    value={SundayClosing}
                                                    onChange={setSundayClosing}
                                                    renderInput={(params: any) => <TextField sx={{ width: '80%', marginLeft: 4 }}
                                                        size='small' {...params} />}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Closed on</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: {xs: 15, sm: 28} }}>
                                        <Autocomplete
                                            sx={{ width: '100%' }}
                                            multiple
                                            options={weeksList}
                                            defaultValue={state?.data?.closed_on}
                                            getOptionLabel={(option: any) => option.title}
                                            filterOptions={(options) =>
                                                options.filter(({ _id: id1 }: any) => !state?.data?.closed_on.some(({ _id: id2 }: any) => id2 === id1))
                                            }
                                            filterSelectedOptions
                                            onChange={(event: any, values: any) => {
                                                setclosedOn(values)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size='small' color='secondary'
                                                />
                                            )} />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Select Bill machine width */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">Printer Paper Width</Typography>
                                    {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', marginLeft: 28 }}>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="58" onChange={(props: any) => setbillWidth(props.target.value)} checked={billWidth === '58'} control={<Radio />} label="58" />
                                            <FormControlLabel value="80" onChange={(props: any) => setbillWidth(props.target.value)} checked={billWidth === '80'} control={<Radio />} label="80" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Restaurant Logo' : 'Logo'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', marginLeft: {xs: 15, sm: 28} }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextField sx={{ width: '100%' }} size={'small'} value={restaurantLogoURI ? restaurantLogoURI?.file?.name : 'Choose file'} variant='outlined' defaultValue='Choose file' disabled />
                                            <Button disableElevation sx={{ width: '20%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' }, textTransform: 'none', marginLeft: 1 }} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_restaurantLogoHandler} hidden /></Button>
                                        </Box>
                                        <Box sx={{ height: '200px', width: {xs: '140px', sm: '200px'}, marginTop: 2, position: 'relative' }}>
                                            {restaurantLogoURI &&
                                                <Box sx={{ backgroundColor: _.colors.colorWhite, borderRadius: 100, position: 'absolute', top: 10, right: 10, boxShadow: 6 }}>
                                                    <IconButton onClick={() => setrestaurantLogoURI(null)} sx={{}} size="small">
                                                        <IoMdClose color={_.colors.colorTitle} size={16} />
                                                    </IconButton>
                                                </Box>
                                            }
                                            <img src={restaurantLogoURI ? restaurantLogoURI?.uri : 'https://stackfood-admin.6amtech.com/public/assets/admin/img/400x400/img2.jpg'}
                                                style={{ height: '100%', width: mediaQuery ? '300px' : '140px', borderRadius: 10, objectFit: 'cover' }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Select Food items */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                                    <Typography variant="h6" sx={{ fontSize: 16, color: _.colors.colorTitle, marginRight: 0.6 }} component="div">{mediaQuery ? 'Upload cover photo' : 'Cover photo'}</Typography>
                                    <FaStarOfLife color={_.colors.colorRed} size={8} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', marginLeft: {xs: 15, sm: 28} }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextField sx={{ width: '100%' }} size={'small'} value={restaurantCoverURI ? restaurantCoverURI?.file?.name : 'Choose file'} variant='outlined' defaultValue='Choose file' disabled />
                                            <Button disableElevation sx={{ width: '20%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' }, textTransform: 'none', marginLeft: 1 }} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_restaurantCoverHandler} hidden /></Button>
                                        </Box>
                                        <Box sx={{ height: '240px', width: {xs: '140px', sm: '500px'}, marginTop: 2, position: 'relative' }}>
                                            {restaurantCoverURI &&
                                                <Box sx={{ backgroundColor: _.colors.colorWhite, borderRadius: 100, position: 'absolute', top: 10, right: 10, boxShadow: 6 }}>
                                                    <IconButton onClick={() => setrestaurantCoverURI(null)} size="small">
                                                        <IoMdClose color={_.colors.colorTitle} size={16} />
                                                    </IconButton>
                                                </Box>
                                            }
                                            <img src={restaurantCoverURI ? restaurantCoverURI?.uri : 'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                                style={{ height: '100%', width: mediaQuery ? '300px' : '140px', borderRadius: 10, objectFit: 'cover' }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                            <Button onClick={_onClickSubmit} sx={{ width: '15%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' } }} size='medium' variant="contained">Submit</Button>
                            <Button onClick={() => navigation('/admin/restaurant/restaurants-list')} sx={{ width: '15%', backgroundColor: _.colors.colorGray2, ":hover": { backgroundColor: '#A0A0A0' }, marginLeft: 2 }} size='medium' variant="contained">Cancel</Button>
                        </Box>
                    </Grid>
                    <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={3000} onClose={snackbarClose} key={vertical + horizontal}>
                        <Alert onClose={snackbarClose} severity={type} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}>
                        <CircularProgress color='inherit' />
                    </Backdrop>
                </Box>


            </ThemeProvider>

        </LocalizationProvider>
    );
}

export default AddNewRestaurant;