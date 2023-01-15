import { Alert, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { CgFormatSlash } from 'react-icons/cg';
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

  function AddStockType() {
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
    const [name, setname] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _addStockType = ()=>{
        if(name.length === 0 ){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else{
            setloading(true)
            var axios = require('axios');
            var qs = require('qs');
            var data = qs.stringify({
                'name': name
            });
            var config = {
            method: 'post',
            url: BASE_URL+PATH.ADD_STOCK_TYPE,
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
                    setname('')
                    setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'success' });
                    navigation('/admin/stock-type/list-of-stock-type') 
                }else{
                    
                }
            })
            .catch(function (error:any) {
                console.log(error);
                setloading(false)
            });
        }
    }

    const _stockTypeUpdate = ()=>{
        if(name.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else{
            setloading(true)
            var axios = require('axios');
            var qs = require('qs');
            var data = qs.stringify({
              'id': state?.data?._id,
              'name': name
            });
            var config = {
              method: 'post',
              url: BASE_URL+PATH.UPDATE_STOCK_TYPE,
              headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
            
            axios(config)
            .then(function (response:any) {
                setloading(false)
                if(response.data.status){
                    setname('')
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'update Stock types successful !',type:'success' });
                    navigation('/admin/stock-type/list-of-stock-type') 
                }else{
                    setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
                }
            })
            .catch(function (error:any) {
                setloading(false)
              console.log(error);
            }); 
        }
    }
    const _editData =()=>{
        setname(state?.data?.name)
    }
    useEffect(() => {
       state&&_editData() 
    }, [])

    const _clickSave=()=>{
        state?_stockTypeUpdate():_addStockType()
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>stock-type</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'edit-stock-type':'add-stock-type'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit StockType':'Add StockType'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Stock Type name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={name} onChange={(prop)=>setname(prop.target.value)} color='secondary' size='small' label="Enter Stock Type" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSave} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/stock-type/list-of-stock-type')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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

export default AddStockType;    