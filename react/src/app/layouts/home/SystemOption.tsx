import { Alert, Backdrop, Box, Button, Card, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { CgFormatSlash } from 'react-icons/cg';
import NumberFormat from 'react-number-format';
import { FaStarOfLife } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, PATH } from '../../api';
import _ from '../../config';

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

function SystemOption() {
    const navigation = useNavigate()
    const {pathname} = useLocation();
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
    const [facebook, setfacebook] = useState('')
    const [instagram, setinstagram] = useState('')
    const [twitter, settwitter] = useState('')
    const [restaurantRange, setrestaurantRange] = useState('')
    const [tablerange, settablerange] = useState('')

    const updateState = (item:any)=>{
        setfacebook(item?.facebook)
        setinstagram(item?.instagram)
        settwitter(item?.twitter)
        setrestaurantRange(item?.restaurant_range)
        settablerange(item?.table_range)
    }

    const _system_option_details = (a:any)=>{
        setloading(true)
        var axios = require('axios');
        var config = {
            method: 'post',
            url: BASE_URL+PATH.SYSTEM_OPTION_DETAILS,
            headers: {},
            data : {}
        };

        axios(config)
        .then(function (response:any) {
            setloading(false)
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                if(a){
                    updateState(response.data.data)
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'System Option Update Successfully.',type:'success' });
                }else{
                    updateState(response.data.data)
                }
                
            }else{
                
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    useEffect(() => {
        _system_option_details(false)
    }, [])
    

    const _add_update_system_option = ()=>{
        if(restaurantRange.length === 0 ){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant Range are required.',type:'error' });
        }else if(tablerange.length === 0 ){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Table Range are required.',type:'error' });
        }else{
            setloading(true)
            var axios = require('axios');
            var qs = require('qs');
            var data = qs.stringify({
                'facebook': facebook,
                'instagram': instagram,
                'twitter': twitter,
                'restaurant_range': restaurantRange,
                'table_range': tablerange 
            });
            var config = {
                method: 'post',
                url: BASE_URL+PATH.ADD_UPDATE_SYSTEM_OPTION,
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
                    _system_option_details(true)
                }else{
                    
                }
            })
            .catch(function (error:any) {
                setloading(false)
                console.log(error);
            });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    {/* <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Table</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/> */}
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">system-option</Typography>
                </Grid>
                {/* <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">System-Option</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light /> */}
                <Grid lg={12} sm={12} md={12} xs={12} sx={{marginTop:4}}>
                    <Box sx={{width:'100%',display:'flex'}}>
                        <Card sx={{width:'90%',display:'flex',flexDirection:'column',paddingBottom:1}}>
                            <Box sx={{width:'100%',backgroundColor:_.colors.colorOrange}}>
                                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorWhite,marginRight:0.6,padding:1}} component="div">Social Media configuration</Typography>
                            </Box>
                            <Box sx={{paddingTop:3,paddingBottom:3,paddingLeft:2,paddingRight:2}}>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                        <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Facebook</Typography>
                                        {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                    </Box>
                                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:20}}>
                                        <TextField value={facebook} onChange={(prop)=>setfacebook(prop.target.value)} 
                                        color='secondary' size='small' label="Enter Facebook URL" variant="outlined" sx={{width:'100%'}} />
                                    </Box>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                        <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Instagram</Typography>
                                        {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                    </Box>
                                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:20}}>
                                        <TextField value={instagram} onChange={(prop)=>setinstagram(prop.target.value)} 
                                        color='secondary' size='small' label="Enter Instagram URL" variant="outlined" sx={{width:'100%'}} />
                                    </Box>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                        <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Twitter</Typography>
                                        {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                                    </Box>
                                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:20}}>
                                        <TextField value={twitter} onChange={(prop)=>settwitter(prop.target.value)} 
                                        color='secondary' size='small' label="Enter Twitter URL" variant="outlined" sx={{width:'100%'}} />
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Box>

                    <Box sx={{width:'100%',display:'flex',marginTop:3}}>
                        <Card sx={{width:'90%',display:'flex',flexDirection:'column',paddingBottom:1}}>
                            <Box sx={{width:'100%',backgroundColor:_.colors.colorOrange}}>
                                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorWhite,marginRight:0.6,padding:1}} component="div">Location Configuration</Typography>
                            </Box>
                            <Box sx={{paddingTop:3,paddingBottom:3,paddingLeft:2,paddingRight:2}}>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                        <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Range (KM)</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8}/>
                                    </Box>
                                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                        <TextField value={restaurantRange} onChange={(prop)=>setrestaurantRange(prop.target.value)} 
                                        InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }}
                                        color='secondary' size='small' label="Enter Restaurant Range" variant="outlined" sx={{width:'100%'}}/>
                                    </Box>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                        <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Table Range (KM)</Typography>
                                        <FaStarOfLife color={_.colors.colorRed} size={8}/>
                                    </Box>
                                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                        <TextField value={tablerange} onChange={(prop)=>settablerange(prop.target.value)} 
                                        InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }}
                                        color='secondary' size='small' label="Enter Table Range" variant="outlined" sx={{width:'100%'}}/>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                    
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:8,marginBottom:10}}>
                    <Button onClick={_add_update_system_option} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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
    );
}

export default SystemOption;