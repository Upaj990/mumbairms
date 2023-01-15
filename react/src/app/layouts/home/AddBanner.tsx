import {useMediaQuery, Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
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

function AddBanner() {
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
    const snackbarClick = () => {
        setOpenSnackbar({ ...openSnackbar, open: true });
    };

    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpenSnackbar({ ...openSnackbar, open: false });
    };
    const [loading, setloading] = useState(false)
    const [imageURI, setimageURI] = useState<any>(null)
    const [restaurantsList, setrestaurantsList] = useState([])
    const [restaurant, setrestaurant] = useState<any>(null)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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

    const _profileHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setimageURI({uri:e.target?.result,file:event.target.files[0]})
        }
    }

    const _editData =()=>{
        setrestaurant(state?.data?.restaurant)
        setimageURI({uri:FILE_URL+FILE_PATH.BANNER_IMAGE+state?.data?.image,file:{name:state?.data?.image},from:'EDIT'})
    }
    useEffect(() => {
       state&&_editData() 
    }, [])

    const _addBanner =()=>{
        if(imageURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Banner image are required.',type:'error' }); 
        }else{
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            data.append('image',imageURI.file);
            data.append('restaurant',restaurant?._id);
            var config = {
            method: 'post',
            url: BASE_URL+PATH.ADD_BANNER,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            data : data
            };
            axios(config)
            .then(function (response:any) {
                console.log(JSON.stringify(response.data));
                if(response.data.status){
                    setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'success' });
                    navigation('/admin/banner/list-of-banner') 
                }else{
                    setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
                }
            })
            .catch(function (error:any) {
                console.log(error);
            });
        }
    }

    const _updateBannerRestaurant =()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'id':state?.data?._id ,
            'restaurant':restaurant?._id
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_BANNER,
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update banner successful !',type:'success' });
                navigation('/admin/banner/list-of-banner') 
            }else{
              setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });  
      }

    const _updateImage = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id', state?.data?._id);
        data.append('image',imageURI.file);
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_BANNER_IMAGE,
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
                _updateBannerRestaurant()
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    const _updateBanner=()=>{
        if(imageURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Please choose a file !',type:'error' }); 
        }else{
            imageURI.from === 'EDIT'&& _updateBannerRestaurant()
            imageURI.from !== 'EDIT'&&_updateImage()
        }
    }

    const _onClickSubmit = ()=>{
        state?_updateBanner():_addBanner()
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>banner</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'edit-banner':'add-banner'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit Banner':'Add Banner'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
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
                    </Box>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Image Upload</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'column',marginLeft:28}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <TextField sx={{width:'100%'}} size='small' value={imageURI?imageURI?.file?.name:'Choose file'}  disabled />
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_profileHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'200px',width:{xs: '140px', sm: '360px'},marginTop:2,position:'relative'}}>
                                    {imageURI&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setimageURI(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={imageURI?imageURI.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                    style={{height:'100%',width:mediaQuery?'100%':'140px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_onClickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/banner/list-of-banner')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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
        open={loading}>
            <CircularProgress color='inherit' />
        </Backdrop>
        </ThemeProvider>
    );
}

export default AddBanner;