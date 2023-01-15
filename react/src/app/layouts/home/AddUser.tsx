import { Alert, Backdrop, Box, Button, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link,Radio, RadioGroup, Snackbar, TextField, Typography, useMediaQuery } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { CgFormatSlash } from 'react-icons/cg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FaStarOfLife } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from '../../config';
import { IoMdClose } from 'react-icons/io';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../api';
import moment from 'moment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const theme = createTheme({
    palette: { 
      secondary: {
        main: _.colors.colorDarkGray,
        contrastText:_.colors.colorWhite
      },
      primary: {
        main: _.colors.colorOrange,
        contrastText:_.colors.colorWhite
      }
    }
});

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
          isNumericString
        />
      );
    },
  );

function AddUser() {
    const {userDetails} = useSelector((state:any) => state);
    const mediaQuery = useMediaQuery('(min-width:600px)');
    const {pathname} = useLocation();
    const navigation = useNavigate()
    const {state}:any = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState<any>({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message:null,
        type:'error'
    });
    const { vertical, horizontal, open,message,type } = openSnackbar;
    
    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpenSnackbar({ ...openSnackbar, open: false });
    };
    const [loading, setloading] = useState(false)
    const [name, setname] = useState('')
    const [phone, setphone] = useState('')
    const [email, setemail] = useState('')
    const [gender, setgender] = useState('male')
    const [preference, setpreference] = useState('vegetarian')
    const [dateOfBirth, setdateOfBirth] = useState ('');
    const [profileURI, setprofileURI] = useState<any>(null)
    const [restaurantsSelected, setRestaurantsSelected] = React.useState([]);
    const [resturantList, setresturantList] = useState([])

    const handleChange = (event: any) => {
        const {
        target: { value },
        } = event;
        setRestaurantsSelected(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    const _list_of_resturants = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          search:''
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_RESTAURANT,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          setloading(false)
          if(response.data.status){
            if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
              setresturantList(response.data.data.filter((a:any)=>a._id === userDetails?.user.restaurant._id).reverse())
            }else{
              setresturantList(response.data.data.reverse())
            }
          }
        })
        .catch(function (error:any) {
          console.log(error);
          setloading(false)
        });
      }

      useEffect(() => {
        _list_of_resturants();
      }, [])

    const _profileHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setprofileURI({uri:e.target?.result,file:event.target.files[0]})
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _updateData=()=>{
        if (userDetails?.user?.restaurant)
            setRestaurantsSelected([userDetails?.user?.restaurant?.restaurant_name] as never[])
        else
            setRestaurantsSelected(resturantList.filter((r:any) => state?.data?.restaurants.includes(r._id as never)).map((r:any) => r.restaurant_name) as never[])
    }

    useEffect(() => {
        _updateData();
    }, [resturantList, userDetails])

    const _editData =()=>{
        setname(state?.data?.name)
        setphone(state?.data?.phone)
        setemail(state?.data?.email)
        setgender(state?.data?.gender)
        console.log(userDetails)
        if (userDetails?.user?.restaurant)
            setRestaurantsSelected([...restaurantsSelected, userDetails?.user?.restaurant?.restaurant_name] as never[])
        else
            setRestaurantsSelected(resturantList.filter((r:any) => state?.data?.restaurants.includes(r._id as never)).map((r:any) => r.restaurant_name) as never[])
        setpreference(state?.data?.preference)
        setdateOfBirth(state?.data?.date_of_birth)
        setprofileURI({uri:state?.data?.profile?state?.data?.profile.includes("https")?state?.data?.profile:FILE_URL+FILE_PATH.PROFILE_IMAGE+state?.data?.profile:_.images.user,file:{name:state?.data?.profile},from:'EDIT'})
    }
    useEffect(() => {
       state?.TAG === 'EDIT'&&_editData() 
    }, [resturantList])

    const _updateProfile = (item:any)=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id',item._id );
        data.append('profile',profileURI.file);
        var config = {
        method: 'post',
        url: BASE_URL+PATH.USER_PROFILE_UPDATE,
        headers: { 
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        data : data
        };

        axios(config)
        .then(function (response:any) {
            setloading(false)
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Register Successful',type:'success' }); 
                navigation('/admin/user/list-of-user')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    const _userSignup = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          name:name.trim(),
          phone:phone.trim(),
          email:email.trim(),
          gender:gender,
          date_of_birth:dateOfBirth,
          preference:preference,
          login_source:'phone',
          restaurants: resturantList.filter((r:any) =>  restaurantsSelected.includes(r.restaurant_name as never)).map((r:any) => r._id),
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.USER_REGISTER,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        axios(config)
        .then(function (response:any) {
          setloading(false)
          console.log(JSON.stringify(response.data));
          if(response.data.status){
            _updateProfile(response.data.data)
          }else{
            setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'error' });
          }
        })
        .catch(function (error:any) {
          setloading(false)
          console.log(error);
        });
    }

    const _validateEmail = () => {
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'email': email.trim()
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.VALIDATE_EMAIL,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };
        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data)); 
            setloading(false)
            if(response.data.status){
                _userSignup()
            }else{
                setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'error' });  
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _validatePhoneEmail = () => {
        var qs = require('qs');
        const addOrderData = {
            name:name.trim(),
            phone:phone.trim(),
            email:email.trim(),
            profile:profileURI,
            gender:gender,
            date_of_birth:dateOfBirth,
            preference:preference,
            login_source:'phone',
            restaurants: resturantList.filter((r:any) =>  restaurantsSelected.includes(r.restaurant_name as never)).map((r:any) => r._id),
          };
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'phone':phone.trim(),
            'email': email.trim(),
            'restaurants': resturantList.filter((r:any) =>  restaurantsSelected.includes(r.restaurant_name as never)).map((r:any) => r._id),
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.VALIDATE_PHONE_EMAIL,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };
        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data)); 
            setloading(false)
            if(response.data.status){
                navigation('/admin/orders/add-new-order',{ state: {TAG:'ADD_USER',data:addOrderData} })
            }else{
                setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'error' });  
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _updateUser = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            id: state?.data?._id,
            name:name.trim(),
            phone:phone.trim(),
            email:email.trim(),
            gender:gender,
            date_of_birth:dateOfBirth,
            preference:preference,
            restaurants: resturantList.filter((r:any) =>  restaurantsSelected.includes(r.restaurant_name as never)).map((r:any) => r._id),
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.UPDATE_USER_DETAILS,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : data
        };
        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            setloading(false)
            if(response.data.status){
                if(profileURI.from !== 'EDIT'){
                    _updateProfile(state?.data)
                }else{
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'update user successful !',type:'success' });
                    navigation('/admin/user/list-of-user')
                }
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });    
    }

    const _addOrder = ()=>{
        _validatePhoneEmail()
    }

    const _clickSubmit = ()=>{
        if(state?.TAG === 'ORDER'){
            if(name.length === 0 || phone.length === 0){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
            }else if(phone.length < 10){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Please enter valid mobile number !',type:'error' }); 
            }else{
                _addOrder()
            }
        }else{
            if(name.length === 0 || phone.length === 0){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
            }else if(profileURI === null){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'User profile is required.',type:'error' }); 
            }else if(phone.length < 10){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Please enter valid mobile number !',type:'error' }); 
            }else{
                state?.TAG === 'EDIT'?_updateUser():_validateEmail()
            }
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>user</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?.TAG === 'EDIT'?'edit-user':'add-user'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?.TAG === 'EDIT'?'Edit User':'Add User'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Full Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={name} onChange={(prop)=>setname(prop.target.value)} color='secondary' size='small' label="Enter full name" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Phone number</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField  color='secondary' size='small' label="Enter phone number" variant="outlined"
                           onChange={(prop)=>setphone(prop.target.value)}
                           value={phone}
                           InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            inputProps={{ maxLength: 10 }}
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Email address</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={email} onChange={(prop)=>setemail(prop.target.value)} color='secondary' size='small' label="Enter email address" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurants</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <FormControl sx={{ m: 1, width: 300 }} disabled={userDetails?.user?.admin_type === 'MANAGER'}>
                                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                                <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={restaurantsSelected}
                                onChange={handleChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                >
                                {resturantList.map((restaurant:any) => (
                                    <MenuItem key={restaurant._id} value={restaurant.restaurant_name}>
                                    <Checkbox checked={restaurantsSelected.indexOf(restaurant.restaurant_name as never) > -1} />
                                    <ListItemText primary={restaurant.restaurant_name} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Gender</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="male" onChange={(props:any)=>setgender(props.target.value)} checked={gender === 'male'}  control={<Radio />} label="Male " />
                                    <FormControlLabel value="female" onChange={(props:any)=>setgender(props.target.value)} checked={gender === 'female'} control={<Radio />} label="Female" />
                                    <FormControlLabel value="other" onChange={(props:any)=>setgender(props.target.value)} checked={gender === 'other'} control={<Radio />} label="Other" />
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Age</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <TextField  color='secondary' size='small' label="Enter age" variant="outlined"
                           onChange={(prop)=>setdateOfBirth(prop.target.value)}
                           value={dateOfBirth}
                           InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            inputProps={{ maxLength: 3 }}
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Preference</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="vegetarian" onChange={(props:any)=>setpreference(props.target.value)} checked={preference === 'vegetarian'}  control={<Radio />} label="Vegetarian " />
                                    <FormControlLabel value="non_vegetarian" onChange={(props:any)=>setpreference(props.target.value)} checked={preference === 'non_vegetarian'} control={<Radio />} label="Non-vegetarian" />
                                    <FormControlLabel value="vegan" onChange={(props:any)=>setpreference(props.target.value)} checked={preference === 'vegan'} control={<Radio />} label="Vegan" />
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">User Image</Typography>
                            {state?.TAG !== 'ORDER'&&<FaStarOfLife color={_.colors.colorRed} size={8}/>}
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'column',marginLeft:28,}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                    <TextField sx={{width:'100%'}} size='small' value={profileURI?profileURI?.file?.name:'Choose file'}  disabled />
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_profileHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'200px',width:'200px',marginTop:2,position:'relative'}}>
                                    {profileURI&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setprofileURI(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={profileURI?profileURI.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/400x400/img2.jpg'}
                                    style={{height:'100%',width: mediaQuery ? '100%' : '140px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>{state?.TAG === 'ORDER'?navigation('/admin/orders/add-new-order'):navigation('/admin/user/list-of-user')}} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
                </Box>
            </Grid>
            <Snackbar anchorOrigin={{vertical,horizontal}} open={open} autoHideDuration={3000} onClose={snackbarClose} key={vertical + horizontal}>
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

export default AddUser;