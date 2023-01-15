import { Alert, Autocomplete, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, Link, Radio, RadioGroup, TextField, Typography,Snackbar,Backdrop } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { CgFormatSlash } from 'react-icons/cg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NumberFormat from 'react-number-format';
import { FaStarOfLife } from 'react-icons/fa';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoMdAddCircleOutline} from 'react-icons/io';
import { BASE_URL, FILE_URL, PATH } from '../../api';
import { v4 as uuid } from 'uuid';
import _ from '../../config';
import { IoMdClose } from 'react-icons/io';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
          isNumericString
        />
      );
    },
  );


const StockTypeView = (props:any)=>{
    const {item,selectStockType,setselectStockType,selectStockTypeHover, setselectStockTypeHover} = props;
    return(
        item.map((item:any,index:any)=>{
            return <Button
            key={index} 
            onMouseOver={()=>{
                setselectStockTypeHover({id:item._id,isHover:true}) 
            }}  
            onMouseOut={()=>{
                setselectStockTypeHover({id:item._id,isHover:false}) 
            }}
            onClick={()=>{
                setselectStockType(item.stockType)
            }}
            endIcon={selectStockType?._id === item.stockType._id&&<IoIosArrowDown color={_.colors.colorWhite} size={16}/>}
            sx={{backgroundColor:selectStockType?._id === item.stockType._id?_.colors.colorOrange:_.colors.colorOrangeDisable,borderWidth:0,":hover":{backgroundColor:selectStockTypeHover.isHover&&selectStockTypeHover.id === item.stockType._id&&selectStockType._id === item.stockType._id?_.colors.colorOrangeDisable:_.colors.colorOrange,color:selectStockTypeHover.isHover&&selectStockTypeHover.id === item.stockType._id&&selectStockType._id === item.stockType._id?_.colors.colorOrange:_.colors.colorOrangeDisable,borderWidth:0},fontWeight:'bold',textTransform:'none',borderRadius:2,paddingTop:1,paddingBottom:1,paddingLeft:selectStockType?._id === item.stockType._id?3:4,paddingRight:selectStockType?._id === item.stockType._id?3:4,marginLeft:1,color:selectStockType?._id === item.stockType._id?_.colors.colorOrangeDisable:_.colors.colorOrange}} disableElevation size='small' variant='outlined'>{item.stockType.name}</Button>
        })
    )
}


function AddInventory() {
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
    const [restaurantsList, setrestaurantsList] = useState([])
    const [stockTypeList, setstockTypeList] = useState([])
    const [restaurant, setrestaurant] = useState<any>({})
    const [stockType, setstockType] = useState<any>({})
    const [orderDateTime, setorderDateTime] = useState<Date | null>(new Date());
    const [foodType, setfoodType] = useState('veg')
    const [totalAmount, settotalAmount] = useState('')
    const [currentAmount, setcurrentAmount] = useState('0')
    const [itemName, setitemName] = useState('')
   
    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _editData =()=>{
        setrestaurant(state.data.restaurant)
        setstockType(state.data.stockType)
        setfoodType(state.data.food_type)
        setitemName(state.data.item_name)
        setcurrentAmount(state.data.current_amount)
        settotalAmount(state.data.total_amount)
        setorderDateTime(state.data.added_date_and_time)
    }
    useEffect(() => {
        if(userDetails.user.admin_type === 'MANAGER' || userDetails.user.admin_type === 'WAITER' || userDetails.user.admin_type === 'CHEF'){
            if(state){
                setrestaurant(userDetails.user.restaurant)
                setstockType(state?.data?.stockType)
                setfoodType(state?.data?.food_type)
                setitemName(state?.data?.item_name)
                setcurrentAmount(state?.data?.current_amount)
                settotalAmount(state?.data?.total_amount)
                setorderDateTime(state?.data?.added_date_and_time)
            }else{
                setrestaurant(userDetails?.user.restaurant)
            }
        }else{
            state&&_editData() 
        }
    }, [])
    useEffect(() => {
       state&&_editData() 
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


    const _stockTypeList = ()=>{
        var axios = require('axios');
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_STOCK_TYPE,
          headers: { }
        };
    
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          if(response.data.status){
            setstockTypeList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
          }else{
    
          }
        })
        .catch(function (error:any) {
          console.log(error);
        });
      }
    
      useEffect(() => {
        _stockTypeList()
      }, [])

      const _addInventory = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
       'restaurant':restaurant._id,
       'stockType':stockType._id,
       'food_type':foodType,
       'item_name': itemName.trim(),
       'current_amount': currentAmount,
       'total_amount' : totalAmount,
       'added_date_and_time': orderDateTime,
    });
    var config = {
        method: 'post',
        url: BASE_URL+PATH.ADD_INVENTORY,
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
            setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'success' }); 
            navigation('/admin/inventory/list-of-inventory')
        }else{
            setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
        }
    })
    .catch(function (error:any) {
        console.log(error);
        setloading(false)
    });
}

    const _updateInventory = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'id': state?.data?._id,
        'restaurant': restaurant._id,
        'stockType': stockType._id,
        'food_type': foodType,
        'item_name': itemName.trim(),
        'current_amount':currentAmount,
        'total_amount': totalAmount,
        'added_date_and_time':orderDateTime,
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_INVENTORY,
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
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update inventory successful !',type:'success' });
                navigation('/admin/inventory/list-of-inventory')
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

    const _clickSubmit = ()=>{
        if(itemName.trim().length === 0 || totalAmount.toString().length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!restaurant._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else if(!stockType._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Stock Type is required.',type:'error' });
        }else if(foodType.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Food type is required.',type:'error' });
        }else if(!orderDateTime){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Added Date and Time is required.',type:'error' }); 
        }else{
            state?_updateInventory():_addInventory()
        }
    }
    return(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Inventory</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Add-Inventory</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">Add Inventory</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                     {/* Select user */}
                     {userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'?
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
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
                        </Box>
                    </Box>
                    :
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
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
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Stock Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                options={stockTypeList}
                                defaultValue={state?.data?.stockType}
                                getOptionLabel={(option:any) => option.name}
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setstockType(values)
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
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Food Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="veg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'veg'} control={<Radio />} label="Veg " />
                                    <FormControlLabel value="non_veg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'non_veg'} control={<Radio />} label="Non-veg" />
                                    {/* <FormControlLabel value="egg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'egg'} control={<Radio />} label="Egg" /> */}
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Item name */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Item name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField color='secondary' value={itemName} onChange={(prop)=>setitemName(prop.target.value)} size='small' label="Enter item name" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>  
                     {/* Select order date and time */}
                     <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Order Date and Time</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <DateTimePicker
                            maxDate={new Date()}
                            label={"Order Date & Time"}
                            value={orderDateTime}
                            onChange={setorderDateTime}
                            renderInput={(params:any) => <TextField hiddenLabel sx={{width:'100%'}}
                            size='small' {...params} />}
                            />
                        </Box>
                    </Box>
                    {/* Total Amount*/}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Total Stock Amount</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={totalAmount}
                            onChange={(prop)=>settotalAmount(prop.target.value)}color='secondary' size='small' variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                        </Box>
                     {/* Current Amount*/}
                     <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                     <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Total Used Amount</Typography>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={currentAmount} 
                            onChange={(prop)=>setcurrentAmount(prop.target.value)}color='secondary' size='small' variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                        </Box>
            
                    <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/menu/menu-list')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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
        </Grid>
        </Box>
        </ThemeProvider>
        </LocalizationProvider>
    );
}

export default AddInventory;
