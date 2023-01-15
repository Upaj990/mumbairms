import { Alert, Backdrop, Box, Button, Card, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { margin, width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import NumberFormat from 'react-number-format';
import { IoMdAddCircleOutline } from 'react-icons/io';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from '../../config';
import user from '../../functions/user';
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../api';
import { AddUserDetails } from '../../redux/reducers/UserDetails';

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

const ProfileView = ()=>{
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
    const dispatch = useDispatch()
    const {userDetails} = useSelector((state:RootState) => state);
    const [loading, setloading] = useState(false)
    const [name, setname] = useState('')
    const [phone, setphone] = useState('')
    const [email, setemail] = useState('')
    const [profileURI, setprofileURI] = useState<any>(null)

    const _editData = (item:any)=>{
        setname(item?.name)
        setphone(item?.phone)
        setemail(item?.email)
        setprofileURI({uri:FILE_URL+FILE_PATH.PROFILE_IMAGE+item.profile,name:item.profile,from:'EDIT'})
    }

    useEffect(() => {
        user((item:any) => {
          setloading(false)
          dispatch(AddUserDetails(item));
          _editData(item)
        })
    }, [])

    const _profileHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setprofileURI({uri:e.target?.result,file:event.target.files[0]})
        }
    }

    const _updateProfile = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id', userDetails?.user?._id);
        data.append('profile',profileURI.file);
        var config = {
        method: 'post',
        url: BASE_URL+PATH.PROFILE_UPDATE,
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Update profile successful !',type:'success' });
                user((item:any) => {
                    setloading(false)
                    dispatch(AddUserDetails(item));
                    _editData(item)
                })
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

   const  _updateAdmin = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'id': userDetails?.user?._id,
            'name': name.trim(),
            'email':email.trim(),
            'phone':phone,
            'restaurant':userDetails?.user?.restaurant?._id?userDetails?.user.restaurant._id:null
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_ADMINS_DETAILS,
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
                if(profileURI?.from === 'EDIT'){
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'Update profile successful !',type:'success' });
                    user((item:any) => {
                        setloading(false)
                        dispatch(AddUserDetails(item));
                        _editData(item)
                    })
                }else{
                    _updateProfile()
                }
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });  
    }

    const _submitOnClick = ()=>{
        if(name.length === 0 || phone.length === 0 || email.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(profileURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'User profile is required.',type:'error' }); 
        }else if(phone.length < 10){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Please enter valid mobile number !',type:'error' }); 
        }else{
            _updateAdmin()
        }
    }
    return(
        <Box sx={{width:'100%',display:'flex',flexDirection:'column',}}>
        {/* <Box sx={{width:'100%',backgroundColor:_.colors.colorOrange}}>
            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorWhite,marginRight:0.6,padding:1}} component="div">My Profile</Typography>
        </Box> */}
        <Box sx={{marginTop:3}}>
           {/* Select Restaurant */}
           <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                    <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Full Name</Typography>
                    <FaStarOfLife color={_.colors.colorRed} size={8}/>
                </Box>
                <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                    <TextField value={name} onChange={(prop)=>setname(prop.target.value)} color='secondary' size='small' label="Enter full name" variant="outlined" sx={{width:'100%'}} />
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
                    disabled={userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'}
                    inputProps={{ maxLength: 10 }}
                    sx={{width:'100%'}} />
                </Box>
            </Box>
            {/* Select Restaurant */}
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                    <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Email address</Typography>
                    <FaStarOfLife color={_.colors.colorRed} size={8}/>
                </Box>
                <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                    <TextField value={email} onChange={(prop)=>setemail(prop.target.value)} color='secondary' size='small' label="Enter email address" variant="outlined" disabled={userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'}
                    sx={{width:'100%'}} />
                </Box>
            </Box>
            {/* Select Restaurant */}
            {userDetails?.user.admin_type !== 'SUPER'&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                    <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                    <FaStarOfLife color={_.colors.colorRed} size={8}/>
                </Box>
                <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                    <TextField value={userDetails?.user?.restaurant?.restaurant_name} color='secondary' size='small' variant="outlined" disabled={userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'}
                    sx={{width:'100%'}} />
                </Box>
            </Box>}
            {/* Select Food items */}
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                    <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">User Image</Typography>
                    <FaStarOfLife color={_.colors.colorRed} size={8}/>
                </Box>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                    <Box sx={{width:'40%',display:'flex',flexDirection:'column',marginLeft:28,}}>
                        <Box sx={{display:'flex',flexDirection:'row'}}>
                            <TextField sx={{width:'100%'}} size='small' value={profileURI?profileURI?.file?.name?profileURI?.file?.name:profileURI?.name:'Choose file'} 
                                disabled />
                            <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_profileHandler} hidden/></Button>
                        </Box>
                        <Box sx={{height:'180px',width:'180px',marginTop:2,position:'relative'}}>
                            {profileURI&&
                            <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                <IconButton onClick={()=>setprofileURI(null)} size="small">
                                    <IoMdClose color={_.colors.colorTitle} size={16}/>
                                </IconButton>
                            </Box>
                            }
                            <img src={profileURI?profileURI.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/400x400/img2.jpg'}
                            style={{height:'100%',width:'100%',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                <Button onClick={_submitOnClick} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                <Button sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
            </Box>
        </Box>
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
    )
}

const ChangePasswordView = ()=>{
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
    const dispatch = useDispatch()
    const {userDetails} = useSelector((state:RootState) => state);
    const [loading, setloading] = useState(false)
    const [old_password, setold_password] = useState('')
    const [new_password, setnew_password] = useState('')
    const [confirm_new_password, setconfirm_new_password] = useState('')

    useEffect(() => {
        user((item:any) => {
            setloading(false)
            dispatch(AddUserDetails(item));
        })
    }, [])

    const _updatePassword =()=>{
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'id': userDetails?.user?._id,
        'old_password': old_password,
        'new_password': confirm_new_password
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_ADMINS_PASSWORD_WITH_OLD_PASSWORD,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };
        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                setold_password('')
                setnew_password('')
                setconfirm_new_password('')
                setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'success'}); 
            }else{
                setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'error'}); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
        });
    }

    const _submitOnClick = ()=>{
        if(old_password.length === 0 || new_password.length === 0 || confirm_new_password.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(new_password !== confirm_new_password){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'New passwords do not match !',type:'error' }); 
        }else{
            _updatePassword()
        }
    }

    return(
        <Box sx={{width:'100%',display:'flex',flexDirection:'column',}}>
        {/* Select Restaurant */}
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Old Password</Typography>
                <FaStarOfLife color={_.colors.colorRed} size={8}/>
            </Box>
            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                <TextField value={old_password} onChange={(prop)=>setold_password(prop.target.value)} 
                color='secondary' size='small' label="Enter old password" variant="outlined" sx={{width:'100%'}} />
            </Box>
        </Box>
        {/* Select Restaurant */}
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">New Password</Typography>
                <FaStarOfLife color={_.colors.colorRed} size={8}/>
            </Box>
            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                <TextField value={new_password} onChange={(prop)=>setnew_password(prop.target.value)} 
                color='secondary' size='small' label="Enter new password" variant="outlined" sx={{width:'100%'}} />
            </Box>
        </Box>
       {/* Select Restaurant */}
       <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Confirm new Password</Typography>
                <FaStarOfLife color={_.colors.colorRed} size={8}/>
            </Box>
            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                <TextField value={confirm_new_password} onChange={(prop)=>setconfirm_new_password(prop.target.value)} 
                color='secondary' size='small' label="Enter confirm new password" variant="outlined" sx={{width:'100%'}} />
            </Box>
        </Box>
        <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:6,marginBottom:3,}}>
            <Button onClick={_submitOnClick} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
            <Button sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
        </Box>
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
    )
}

function Profile() {
    const navigation = useNavigate()
    const [btnToggle, setbtnToggle] = useState(true)
    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex'}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:16,color:_.colors.colorTitle}} component="div">profile</Typography>
                </Grid>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{marginTop:3}}>
                    <Box sx={{display:'flex',marginBottom:2,}}>
                        <Button disableElevation onClick={()=>setbtnToggle(!btnToggle)} sx={{fontSize:btnToggle?16:15,minWidth:'10%',textAlign:'left',backgroundColor:btnToggle?_.colors.colorOrange:_.colors.colorWhite,color:btnToggle?_.colors.colorWhite:_.colors.colorTitle,":hover":{backgroundColor:btnToggle?'#E16512':_.colors.colorExtraLightGray},textTransform:'none',borderRadius:1}} size='small' variant="contained">Edit Profile</Button>
                        <Button disableElevation onClick={()=>setbtnToggle(!btnToggle)} sx={{fontSize:btnToggle?16:15,minWidth:'10%',textAlign:'left',backgroundColor:btnToggle?_.colors.colorWhite:_.colors.colorOrange,color:btnToggle?_.colors.colorTitle:_.colors.colorWhite,":hover":{backgroundColor:btnToggle?_.colors.colorExtraLightGray:'#E16512'},textTransform:'none',borderRadius:1,marginLeft:2}} size='small' variant="contained">Change Password</Button>
                    </Box>
                    <Box sx={{width:'100%',display:'flex'}}>
                        {btnToggle?<ProfileView/>:<ChangePasswordView/>}
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </ThemeProvider>
    );
}

export default Profile;