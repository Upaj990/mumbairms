import {useMediaQuery, Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, Link, MenuItem, OutlinedInput, Radio, RadioGroup, Snackbar, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import NumberFormat from 'react-number-format';
import { BsCalendarEvent, BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../api';
import _ from '../../config';
import { IoMdClose } from 'react-icons/io';

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
          //thousandSeparator
          isNumericString
          //prefix="₹"
        />
      );
    },
  );

function AddChef() {
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
    const [restaurantsList, setrestaurantsList] = useState([])
    const [name, setname] = useState('')
    const [phone, setphone] = useState('')
    const [email, setemail] = useState('')
    const [restaurant, setrestaurant] = useState<any>(null)
    const [profileURI, setprofileURI] = useState<any>(null)
    const [proofURi, setproofURi] = useState<any>(null)
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    const {userDetails} = useSelector((state:RootState) => state);

    const [passwordToggle, setpasswordToggle] = useState<any>(false);
    const handleClickShowPassword = () => {
        setpasswordToggle(!passwordToggle);
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [confirmPasswordToggle, setconfirmPasswordToggle] = useState<any>(false);
    const handleClickShowConfirmPassword = () => {
        setconfirmPasswordToggle(!confirmPasswordToggle);
    };
    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _editData =()=>{
        setname(state?.data?.name)
        setphone(state?.data?.phone)
        setemail(state?.data?.email)
        setrestaurant(state?.data?.restaurant)
        setprofileURI({uri:FILE_URL+FILE_PATH.PROFILE_IMAGE+state?.data?.profile,file:{name:state?.data?.profile},from:'EDIT'})
        setproofURi({uri:FILE_URL+FILE_PATH.IDENTITY_PROOF_IMAGE+state?.data?.identity_proof,file:{name:state?.data?.identity_proof},from:'EDIT'})
        setpassword('')
        setconfirmPassword('')
    }
    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            setrestaurant(userDetails?.user.restaurant)
            state&&_editData()
        }else{
            state&&_editData()
        }
    }, [])
    
    const _profileHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setprofileURI({uri:e.target?.result,file:event.target.files[0]})
        }
    }
    const _proofHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setproofURi({uri:e.target?.result,file:event.target.files[0]})
        }
    }

    const _listOfRestaurantsList = ()=>{
        setloading(true)
        var axios = require('axios');
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_RESTAURANT,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        };
        
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          setloading(false)
          if(response.data.status){
            setrestaurantsList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
          }else{
    
          }
        })
        .catch(function (error:any) {
          console.log(error);
          setloading(false)
        });
      }
    
    useEffect(() => {
        _listOfRestaurantsList()
    }, [])

    const _updateMangerDetils =()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'id': state?.data?._id,
            'name': name.trim(),
            'email':email.trim(),
            'phone':phone.trim(),
            'restaurant':restaurant._id
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update chef successful !',type:'success' }); 
                navigation('/admin/chef/list-of-chef')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });  
    }

    const _updateIdentityProof = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id',state?.data?._id);
        data.append('identity_proof', proofURi.file);
        var config = {
        method: 'post',
        url: BASE_URL+PATH.IDENTITY_PROOF_UPDATE,
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
                _updateMangerDetils()
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        })
    }

    const _updateProfile = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id', state?.data?._id);
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
                _updateMangerDetils()
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    const _updatePassword = ()=>{
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'id': state?.data?._id,
        'password': confirmPassword
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_ADMINS_PASSWORD,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                profileURI.from === 'EDIT'&&proofURi.from === 'EDIT'&&_updateMangerDetils()
                profileURI.from !== 'EDIT'&&_updateProfile()
                proofURi.from !== 'EDIT'&&_updateIdentityProof()
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
        });
    }

    const _updateChef =()=>{
        if(name.length === 0 || phone.length === 0 || email.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!restaurant){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else if(profileURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Chef profile is required.',type:'error' });
        }else if(proofURi === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Identity proof is required.',type:'error' }); 
        }else if(phone.length < 10){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Please enter valid mobile number !',type:'error' }); 
        }else{
            if(password.length === 0 && confirmPassword.length === 0){
                profileURI.from === 'EDIT'&&proofURi.from === 'EDIT'&&_updateMangerDetils()
                profileURI.from !== 'EDIT'&&_updateProfile()
                proofURi.from !== 'EDIT'&&_updateIdentityProof()
            }else{
                if(password !== confirmPassword){
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'Passwords do not match !',type:'error' }); 
                }else{
                    _updatePassword()
                }
            }
        }
    }

    const _addIdentityProof = (item:any)=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id', item._id);
        data.append('identity_proof', proofURi.file);
        var config = {
        method: 'post',
        url: BASE_URL+PATH.IDENTITY_PROOF_UPDATE,
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
                setname('')
                setphone('')
                setemail('')
                setprofileURI(null)
                setproofURi(null)
                setpassword('')
                setconfirmPassword('')
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Add chef successful !',type:'success' });
                navigation('/admin/chef/list-of-chef')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' });
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(true)
        });
    }

    const _addChef =()=>{
        if(name.length === 0 || phone.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!restaurant){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else if(profileURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Chef profile is required.',type:'error' });
        }else if(proofURi === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Identity proof is required.',type:'error' }); 
        }else if(phone.length < 10){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Please enter valid mobile number !',type:'error' }); 
        }else if(password !== confirmPassword){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Passwords do not match !',type:'error' }); 
        }else{
            setloading(true)
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            data.append('name', name.trim());
            data.append('profile',profileURI.file);
            data.append('email', email.trim());
            data.append('phone', phone.trim());
            data.append('restaurant',restaurant._id);
            data.append('password', confirmPassword.trim());
            data.append('admin_type', 'CHEF');
    
            var config = {
            method: 'post',
            url: BASE_URL+PATH.REGISTER,
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
                    _addIdentityProof(response.data.data)
                }else{
                    setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' });
                }
            })
            .catch(function (error:any) {
                setloading(false)
                console.log(error);
            });
        }
    }

    const _onClickSubmit = ()=>{
        state?_updateChef():_addChef()
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>chef</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'Edit-chef':'Add-chef'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit Chef':'Add Chef'}</Typography>
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
                            <TextField value={phone}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            inputProps={{ maxLength: 10 }} 
                            onChange={(prop)=>setphone(prop.target.value)} color='secondary' size='small' label="Enter phone number" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Email addres</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={email} onChange={(prop)=>setemail(prop.target.value)} color='secondary' size='small' label="Enter email addres" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select user */}
                    {userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'?
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                options={restaurantsList}
                                defaultValue={userDetails?.user.restaurant}
                                disabled={true}
                                getOptionLabel={(option:any) => option.restaurant_name}
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setrestaurant(values)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small' color='secondary'
                                        hiddenLabel
                                    />
                                )}/>
                            </Box>
                        </Box>
                    </Box>:
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                options={restaurantsList}
                                defaultValue={state?.data?.restaurant}
                                getOptionLabel={(option:any) => option.restaurant_name}
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setrestaurant(values)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small' color='secondary'
                                        hiddenLabel
                                    />
                                )}/>
                            </Box>
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
                                    <TextField sx={{width:'100%'}} size='small' value={profileURI?profileURI?.file?.name:'Choose file'}  disabled />
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_profileHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'160px',width:{xs: '140px', sm: '160px'},marginTop:2,position:'relative'}}>
                                    {profileURI&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setprofileURI(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={profileURI?profileURI.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/400x400/img2.jpg'}
                                    style={{height:'100%',width:mediaQuery?'100%':'140px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Identity proof</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'column',marginLeft:28}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                    <TextField sx={{width:'100%'}} size={'small'} value={proofURi?profileURI?.file?.name:'Choose file'} variant='outlined'  defaultValue='Choose file'  disabled/>
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_proofHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'200px',width:{xs: '140px', sm: '340px'},marginTop:2,position:'relative'}}>
                                    {proofURi&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setproofURi(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={proofURi?proofURi.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                    style={{height:'100%',width:mediaQuery?'100%':'140px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select user */}
                    {<Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Password</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <FormControl color='secondary' size='small' sx={{width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Enter password</InputLabel>
                            <OutlinedInput 
                                type={passwordToggle ? 'text' : 'password'}
                                id="outlined-adornment-password"
                                value={password}
                                onChange={(prop)=>setpassword(prop.target.value)}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    aria-label="toggle password visibility"
                                    edge="end">
                                    <>
                                        {!passwordToggle?<BsFillEyeFill color={_.colors.colorSubTitle} size={18}/>:
                                        <BsFillEyeSlashFill color={_.colors.colorSubTitle} size={18}/>}
                                    </>
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Enter password"
                            />
                            </FormControl>
                        </Box>
                    </Box>}
                    {/* Select user */}
                    {<Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Confirm Password</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <FormControl color='secondary' size='small' sx={{width:'100%'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Enter confirm password</InputLabel>
                            <OutlinedInput 
                                id="outlined-adornment-password"
                                type={confirmPasswordToggle ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(prop)=>setconfirmPassword(prop.target.value)}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownConfirmPassword}
                                    aria-label="toggle password visibility"
                                    edge="end">
                                        <>
                                        {!confirmPasswordToggle?<BsFillEyeFill color={_.colors.colorSubTitle} size={18}/>:
                                        <BsFillEyeSlashFill color={_.colors.colorSubTitle} size={18}/>}
                                        </>
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Enter confirm password"
                            />
                            </FormControl>
                        </Box>
                    </Box>}
                    
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_onClickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/chef/list-of-chef')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
                </Box>
            </Grid>
        </Box>
        <Snackbar anchorOrigin={{vertical,horizontal}} open={open} autoHideDuration={3000} onClose={snackbarClose} key={vertical + horizontal}>
            <Alert onClose={snackbarClose} severity={type} sx={{ width: '100%' }}>
            {message}
            </Alert>
        </Snackbar>
        <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
      //onClick={handleClose}
      >
      <CircularProgress color='inherit' />
    </Backdrop>
        </ThemeProvider>
    );
}

export default AddChef;