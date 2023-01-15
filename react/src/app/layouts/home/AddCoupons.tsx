import { Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, Link, MenuItem, OutlinedInput, Radio, RadioGroup, Snackbar, TextField, Typography, useMediaQuery } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import NumberFormat from 'react-number-format';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { IoMdClose } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, FILE_URL, PATH } from '../../api';
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

function AddCoupons() {
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
    const [menuList, setmenuList] = useState([])
    const [title, settitle] = useState('')
    const [couponsType, setcouponsType] = useState('cart_total')
    const [restaurant, setrestaurant] = useState<any>({})
    const [menu, setmenu] = useState<any>([])
    const [code, setcode] = useState('')
    const [startDate, setstartDate] = useState <Date | null>(null);
    const [endDate, setendDate] = useState <Date | null>(null);
    const [discountType, setdiscountType] = useState('percentage')
    const [discountAmount, setdiscountAmount] = useState('')
    const [maxDiscount, setmaxDiscount] = useState('')
    const [minPurchase, setminPurchase] = useState('')
    const [imageURI, setimageURI] = useState<any>(null)

    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        couponsType === 'cart_total'&&setmenu([])
        couponsType === 'menu_item'&&setrestaurant({})
    }, [couponsType])

    const _editData =()=>{
        state?.data?.restaurant&&setrestaurant(state?.data?.restaurant)
        settitle(state?.data?.title)
        setcouponsType(state?.data?.coupon_type)
        setcode(state?.data?.code)
        setstartDate(state?.data?.start_date)
        setendDate(state?.data?.end_date)
        setdiscountType(state?.data?.discount_type)
        setdiscountAmount(state?.data?.discount)
        setmaxDiscount(state?.data?.max_discount)
        setminPurchase(state?.data?.min_purchase)
        setimageURI({uri:FILE_URL+state?.data?.image.path,file:{name:state?.data?.image.filename},from:'EDIT'})
    }
    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            setrestaurant(userDetails?.user.restaurant)
            state&&_editData()
        }else{
            state&&_editData()
        }
    }, [])

    const _imageHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setimageURI({uri:e.target?.result,file:event.target.files[0]})
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

    const _list_of_menu = ()=>{
        setloading(true)
        var axios = require('axios');
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_MENU,
          headers: { }
        };
    
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          setloading(false)
          if(response.data.status){
            if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
                setmenuList(response.data.data.filter((a:any)=>a.restaurant._id === userDetails?.user.restaurant._id).filter((b:any)=>b.active_inactive === true).reverse())
            }else{
                setmenuList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
            }
          }
        })
        .catch(function (error:any) {
          console.log(error);
          setloading(false)
        });
      }
      useEffect(() => {
         _list_of_menu()
      }, [])

      const _addCoupons = ()=>{
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('title', title.trim());
        data.append('coupon_type',couponsType);
        data.append('restaurant',restaurant?._id);
        menu.forEach((file:any)=>{
            data.append("menu",file._id);
        });
        data.append('code', code.trim());
        data.append('start_date',startDate);
        data.append('end_date', endDate);
        data.append('discount_type', discountType);
        data.append('discount',discountAmount.trim());
        data.append('max_discount',maxDiscount.trim());
        data.append('min_purchase',minPurchase.trim());
        data.append('image',imageURI.file);
        
        var config = {
          method: 'post',
          url: BASE_URL+PATH.ADD_COUPONS,
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
            navigation('/admin/coupons/list-of-coupons') 
        }else{
            response.data.code === 403&&setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            response.data.code === 404&&setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
        }
        })
        .catch(function (error:any) {
          console.log(error);
        });
      }

      const _updateCoupons = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('id',state?.data?._id);
        data.append('title', title.trim());
        data.append('coupon_type',couponsType);
        data.append('restaurant',restaurant?._id);
        menu.forEach((file:any)=>{
            data.append("menu",file._id);
        });
        data.append('code', code.trim());
        data.append('start_date',startDate);
        data.append('end_date', endDate);
        data.append('discount_type', discountType);
        data.append('discount',discountAmount.trim());
        data.append('max_discount',maxDiscount.trim());
        data.append('min_purchase',minPurchase.trim());
        data.append('image',imageURI.file);

        var config = {
        method: 'post',
        url: BASE_URL+PATH.COUPONS_UPDATE,
        headers: { 
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        data : data
        };

        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            setloading(false)
            if(response.data.status){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update restaurant successful !',type:'success' });
                navigation('/admin/coupons/list-of-coupons') 
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
      }

      const _clickSubmit = ()=>{
        if(title.trim().length === 0 || discountAmount.trim().length === 0 || code.trim().length === 0 || maxDiscount.trim().length === 0 || minPurchase.trim().length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(couponsType === 'menu_item' && menu.length === 0 ){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Menu are required.',type:'error'}); 
        }else if(startDate === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Start Date is required.',type:'error' }); 
        }else if(endDate === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'End Date is required.',type:'error' }); 
        }else if (imageURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Coupon image are required.',type:'error' }); 
        }else{
            state?_updateCoupons():_addCoupons() 
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
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>coupons</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'edit-coupons':'add-coupons'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit Coupons':'Add Coupons'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                     {/* Select Restaurant */}
                     <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Title</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={title} onChange={(prop)=>settitle(prop.target.value)} color='secondary' size='small' label="Enter coupons name" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Coupon Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="cart_total" onChange={(props:any)=>setcouponsType(props.target.value)} checked={couponsType === 'cart_total'} control={<Radio />} label="Cart total" />
                                    <FormControlLabel value="menu_item" onChange={(props:any)=>setcouponsType(props.target.value)} checked={couponsType === 'menu_item'} control={<Radio />} label="Menu item" />
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select user */}
                    {couponsType === 'cart_total'&&
                    <>
                    {
                        userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'?
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                                <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant</Typography>
                                {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
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
                    }
                    </>
                    }
                    {/* Select Table */}
                    {couponsType === 'menu_item'&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Menu</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                multiple
                                options={menuList}
                                defaultValue={state?.data?.menu}
                                getOptionLabel={(option:any) => option.menu_name}
                                filterOptions={(options) =>
                                    options.filter(({ _id: id1 }:any) => !state?.data?.menu.some(({ _id: id2 }:any) => id2 === id1))
                                }
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setmenu(values)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small' color='secondary'
                                    />
                                )}/>
                            </Box>
                        </Box>
                    </Box>}
                    {/* Select Table */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Code</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField disabled={state} value={code} onChange={(prop)=>setcode(prop.target.value.trim())} color='secondary' size='small' label="Enter code" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Start Date</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <DateTimePicker
                            //disabled={closedOn.find((item:any)=>item.id==='THU')}
                            label={"Start Date"}
                            value={startDate}
                            onChange={setstartDate}
                            minDate={new Date()}
                            renderInput={(params:any) => <TextField hiddenLabel sx={{width:'100%'}}
                            size='small' {...params} />}
                            />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">End Date</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <DateTimePicker
                            //disabled={closedOn.find((item:any)=>item.id==='THU')}
                            label={"End date"}
                            value={endDate}
                            onChange={setendDate}
                            minDate={startDate?new Date(startDate):new Date()}
                            renderInput={(params:any) => <TextField hiddenLabel sx={{width:'100%'}}
                            size='small' {...params} />}
                            />
                        </Box>
                    </Box>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Discount Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="percentage" onChange={(props:any)=>setdiscountType(props.target.value)} checked={discountType === 'percentage'} control={<Radio />} label="Percentage" />
                                    <FormControlLabel value="amount" onChange={(props:any)=>setdiscountType(props.target.value)} checked={discountType === 'amount'} control={<Radio />} label="Amount" />
                                </RadioGroup>
                            </Box> 
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Discount</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }} value={discountAmount} onChange={(prop)=>setdiscountAmount(prop.target.value)} color='secondary' size='small' label="Enter amount" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Max Discount</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }} value={maxDiscount} onChange={(prop)=>setmaxDiscount(prop.target.value)} color='secondary' size='small' label="Enter max discount" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Min Purchase</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }} value={minPurchase} onChange={(prop)=>setminPurchase(prop.target.value)} color='secondary' size='small' label="Enter min purchase" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Image</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'column',marginLeft:28}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                    <TextField sx={{width:'100%'}} size='small' value={imageURI?imageURI?.file?.name:'Choose file'}  disabled />
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_imageHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'140px',width: {xs: '140px', sm: '280px'},marginTop:2,position:'relative'}}>
                                    {imageURI&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setimageURI(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={imageURI?imageURI.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                    style={{height:'100%',width: mediaQuery ? '300px' : '140px',borderRadius:10,objectFit:'contain',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/coupons/list-of-coupons')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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

export default AddCoupons;