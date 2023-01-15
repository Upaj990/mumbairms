import { Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { CgFormatSlash } from 'react-icons/cg';
import NumberFormat from 'react-number-format';
import { FaStarOfLife } from 'react-icons/fa';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { IoMdAddCircleOutline } from 'react-icons/io';
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
          //thousandSeparator
          isNumericString
          //prefix="₹"
        />
      );
    },
  );

function AddTable() {
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
    const [restaurant, setrestaurant] = useState<any>({})
    const [tableNo, settableNo] = useState('')
    const [capacityPeople, setcapacityPeople] = useState('')
    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _editData =()=>{
        setrestaurant(state?.data?.restaurant)
        settableNo(state?.data?.table_no)
        setcapacityPeople(state?.data?.capacity_people)
    }
    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            if(state){
                setrestaurant(userDetails?.user.restaurant)
                settableNo(state?.data?.table_no)
                setcapacityPeople(state?.data?.capacity_people)
            }else{
                setrestaurant(userDetails?.user.restaurant)
            }
            
        }else{
            state&&_editData() 
        }
    }, [])

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

    const _addTable = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'restaurant': restaurant._id,
        'table_no': tableNo.trim(),
        'capacity_people':capacityPeople
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.ADD_TABLE,
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'success' }); 
                navigation('/admin/table/table-list')
            }else{
                response.data.code === 403&&setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' });
                response.data.code === 404&&setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' });
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    const _updateTable = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'id': state?.data?._id,
        'restaurant': restaurant._id,
        'table_no': tableNo,
        'capacity_people':capacityPeople
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_TABLE,
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update table successful !',type:'success' });
                navigation('/admin/table/table-list')
            }else{
                response.data.code === 403&&setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' });
                response.data.code === 404&&setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' });
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _onClickSubmit = ()=>{
        if(tableNo.trim().length === 0 || capacityPeople.trim().length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!restaurant._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else {
            state?_updateTable():_addTable()
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>table</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'edit-table':'add-table'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit Table':'Add Table'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        {userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'?
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <Autocomplete
                            sx={{width:'100%'}}
                            options={restaurantsList}
                            disabled={true}
                            defaultValue={userDetails?.user.restaurant}
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
                        </Box>:
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <Autocomplete
                            sx={{width:'100%'}}
                            options={restaurantsList}
                            disabled={state}
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
                        }
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Table no.</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField
                            sx={{width:'100%'}}
                            color='secondary' size='small'
                            label="Enter table no."
                            disabled={state}
                            value={tableNo}
                            onChange={(prop)=>settableNo(prop.target.value)}
                
                            variant="outlined"
                            />
                        </Box>
                    </Box>
                    {/* Select Table */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Capacity (people)</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField
                            sx={{width:'100%'}}
                            color='secondary' size='small'
                            label="Enter capacity (people)"
                            value={capacityPeople}
                            onChange={(prop)=>setcapacityPeople(prop.target.value)}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            variant="outlined"
                            />
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_onClickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/table/table-list')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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

export default AddTable;