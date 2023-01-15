import { Alert, Autocomplete, Backdrop, Box, Button, Card, CircularProgress, Divider, Grid, Link, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { padding } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AiOutlineMobile } from 'react-icons/ai';
import { GiKnifeFork,GiRoundTable } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import { BiFoodTag ,BiCheck} from 'react-icons/bi';
import { MdDeliveryDining,MdClose } from 'react-icons/md';
import { BsCalendarWeek,BsCheckLg } from 'react-icons/bs';
import { CgFormatSlash } from 'react-icons/cg';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { SiHomeassistantcommunitystore,SiAirtable } from 'react-icons/si';
import { v4 as uuid } from 'uuid';
import { GoPencil, GoPrimitiveDot } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from '../../config';
import moment from 'moment';
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../api';

const theme = createTheme({
    palette: {
      secondary: {
        main: _.colors.colorOrange,
        contrastText:_.colors.colorWhite
      },
      primary: {
        main: _.colors.colorSubTitle,
      }
    }
  });

  const AddonsTextView = (props:any)=>{
    const {item,index,setloading,selectAddonsValues} = props;
    const [addonName, setaddonName] = useState<any>('')
    
    const _addonsItem = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            '_id':item.parent
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.SEARCH_ADDONS,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };
        axios(config)
        .then(function (response:any) {
            setloading(false)
            console.log(JSON.stringify(response.data));
            response.data.status&& setaddonName(response.data.data)
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }
    useEffect(() => {
        _addonsItem()
    }, [])

    return(
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'start'}}>
            <Typography variant="subtitle1" sx={{width:'100%',minWidth:60,fontSize:14,fontWeight:'bold',textAlign:'start',lineHeight:1.6,color:_.colors.colorTitle}} component="div">{addonName.name}</Typography>
            <Typography variant='subtitle1' sx={{width:'200%',fontSize:13,color:_.colors.colorOrange,textAlign:'start',lineHeight:1.6,fontWeight:'bold',marginLeft:1}} component="div">{selectAddonsValues.filter((a:any)=>a.parent === item.parent).map((b:any)=>b.name).join(', ')}</Typography>
        </Box>
    )
  }

  const AddonsPrices = (props:any)=>{
    const {item,index,setloading,selectAddonsValues} = props;
    return(
        <Typography variant="h6" style={{fontSize:13,color:_.colors.colorTitle,lineHeight:1.6}} component="div">₹{selectAddonsValues.filter((a:any)=>a.parent === item.parent).map((b:any)=>Number(b.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue})}</Typography>
    )
  }

  const SelectWaiterView = (props:any)=>{
    const {item,setselectWaiterBackDrop,setloading,setopenSnackbar,openSnackbar,_orderDetails} = props;
    const [waitersList, setwaitersList] = useState([])
    const [waiter, setwaiter] = useState<any>(null)

    const {userDetails} = useSelector((state:RootState) => state);

    const _listOfWaiters = ()=>{
      setloading(true)
      var axios = require('axios');
      var config = {
        method: 'post',
        url: BASE_URL+PATH.LIST_OF_WAITERS,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      };
      
      axios(config)
      .then(function (response:any) {
        setloading(false)
        console.log(JSON.stringify(response.data));
        if(response.data.status){
          setwaitersList(response.data.data.filter((a:any)=>a.restaurant._id === item?.restaurant?._id))
        }else{
  
        }
      })
      .catch(function (error:any) {
        setloading(false)
        console.log(error);
      });
    }
  
    useEffect(() => {
      _listOfWaiters()
    }, [item])

    const _acceptOrder = ()=>{
      if(!waiter){
        setopenSnackbar({ ...openSnackbar, open: true,message:'Please select waiter !!',type:'error' }); 
      }else{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': item._id,
          'order_status': {id:'ACC',title:'Accepted'},
          'order_history':{id:uuid(),user:userDetails?.user,order_status:{id:'ACC',title:'Accepted'},activity:'Update'},
          'waiter': waiter._id
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.UPDATE_ORDER,
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
              _orderDetails()
              setselectWaiterBackDrop(false)
              setwaiter(null)
            }else{
              setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
      }
    }

    return(
      <Box sx={{width:'30%',backgroundColor:_.colors.colorWhite,display:'flex',flexDirection:'column',alignItems:'center',borderRadius:1,padding:2}}>
        <Typography variant='body1' sx={{fontSize:20,color:_.colors.colorTitle,fontWeight:'normal',marginTop:.5,marginBottom:2}} component="div">Select Waiter</Typography>
        <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{width:'90%'}}
        options={waitersList}
        value={waiter}
        getOptionLabel={(option:any) => option.name}
        filterSelectedOptions
        onChange={(event:any, values:any)=>{
          setwaiter(values)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size='small' color='secondary'
            label='Select'
          />
        )}/>
        <Box sx={{width:'92%',display:'flex',alignItems:'center',justifyContent:'end',marginTop:4,marginBottom:.5}}>
          <Button onClick={()=>{
              setselectWaiterBackDrop(false)
              setwaiter(null)
            }} size='small'>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Cancel</Typography>
          </Button>
          <Button onClick={_acceptOrder} size='small' sx={{marginLeft:2}}>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Submit</Typography>
          </Button>
        </Box>
      </Box>
    )
  }

function OrderDetails() {
    const navigation = useNavigate()
    const {pathname} = useLocation();
    const {state}:any = useLocation()
    const [openSnackbar, setopenSnackbar] = useState<any>({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message:null,
        type:'error'
    });
    const { vertical, horizontal, open,message,type } = openSnackbar;
    
    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setopenSnackbar({ ...openSnackbar, open: false });
    };;
    const [orderDetails, setorderDetails] = useState<any>(null)
    const [loading, setloading] = useState(false)
    const [selectWaiterBackDrop, setselectWaiterBackDrop] = useState(false)

    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _orderDetails = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        '_id': state?.data?._id
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.ORDER_DETAILS,
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
                setorderDetails(response.data.data)
            }else{
                console.log('else')
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }

    useEffect(() => {
        state&&_orderDetails()
    }, [])

    const _rejectOrder = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': orderDetails?._id,
          'order_status': {id:'CAN',title:'Cancelled' },
          'order_history':{id:uuid(),user:userDetails?.user,order_status:{id:'CAN',title:'Cancelled' },activity:'Update'},
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.UPDATE_ORDER,
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
                _orderDetails()
            }else{
              setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
      }

      const _acceptOrder = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'id': orderDetails._id,
        'order_status': {id:'ACC',title:'Accepted'},
        'order_history':{id:uuid(),user:userDetails?.user,order_status:{id:'ACC',title:'Accepted'},activity:'Update'},
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.UPDATE_ORDER,
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
                _orderDetails()
            }else{
                setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        }); 
      }

    return (
        <ThemeProvider theme={theme}>
        {orderDetails&&<Box sx={{display:'flex',paddingBottom:10}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Orders</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Order Details</Typography>
                </Grid>
                <Grid container lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:1}}>
                    <Grid lg={2} md={6} sm={12} xs={12}>
                        <Typography variant="h1" sx={{fontSize:24,color:_.colors.colorTitle,fontWeight:'bold'}} component="div">Order #{orderDetails?.order_id}</Typography>
                    </Grid>
                    <Grid lg={10} md={6} sm={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <Box style={{display:'flex',backgroundColor:_.colors.colorLightGray,alignItems:'center',justifyContent:'center',borderRadius:4,padding:'2px 12px'}}>
                                {orderDetails?.order_type === 'dine_in'?<GiKnifeFork color={_.colors.colorBlack} size={16}/>:<MdDeliveryDining color={_.colors.colorBlack} size={16}/>}
                                <Typography noWrap variant="h6" sx={{fontSize:12,fontWeight:'bold',color:_.colors.colorBlack,marginLeft:0.8}} component="div">{orderDetails?.order_type === 'dine_in'?'Dine In':'Parcel'}</Typography>
                            </Box>
                            <Box style={{display:'flex',backgroundColor:orderDetails?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 0.07)' : 'rgba(0, 200, 100, 0.07)',alignItems:'center',justifyContent:'center',borderRadius:4,padding:'2px 8px',marginLeft:10}}>
                                <GoPrimitiveDot color={orderDetails?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 1)' : 'rgba(0, 200, 100, 1)'} size={12}/>
                                <Typography variant="h6" sx={{fontSize:12,fontWeight:'bold',color:orderDetails?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 1)':'rgba(0, 200, 100, 1)',marginLeft:0.6}} component="div">{orderDetails?.payment_status?.title}</Typography>
                            </Box>
                            <Box style={{display:'flex',backgroundColor:_.statusColor.find((a:any)=>a.status === orderDetails?.order_status.title)?.light,alignItems:'center',justifyContent:'center',borderRadius:4,padding:'2px 8px',marginLeft:10}}>
                                <GoPrimitiveDot color={_.statusColor.find((a:any)=>a.status === orderDetails?.order_status.title)?.dark} size={12}/>
                                <Typography variant="h6" sx={{fontSize:12,fontWeight:'bold',color:_.statusColor.find((a:any)=>a.status === orderDetails?.order_status.title)?.dark,marginLeft:0.6}} component="div">{orderDetails?.order_status?.title}</Typography>
                            </Box>
                            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',paddingLeft:2}}>
                                <BsCalendarWeek color={_.colors.colorSubTitle} size={18}/>
                                <Typography noWrap variant="h6" sx={{fontSize:14,color:_.colors.colorSubTitle,marginLeft:1}} component="div">{moment(orderDetails?.order_date_and_time).format('D MMMM YYYY, h:mma')}</Typography>
                            </Box>
                        </Box>
                        {orderDetails?.order_status?.title === 'Placed' && <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Button onClick={()=>{
                                if(orderDetails.waiter){
                                    _acceptOrder()
                                }else{
                                    setselectWaiterBackDrop(true)
                                }
                            }} style={{display:'flex',backgroundColor:_.colors.colorAccept,alignItems:'center',justifyContent:'center',borderRadius:3,padding:'4px 20px'}}>
                                <BsCheckLg color={_.colors.colorWhite} size={12}/>
                                <Typography variant='button' sx={{fontSize:14,fontWeight:'bold',textTransform:'capitalize',color:_.colors.colorWhite,marginLeft:1}} component="div">Accept</Typography>
                            </Button>
                            <Button onClick={_rejectOrder} style={{display:'flex',backgroundColor:_.colors.colorReject,alignItems:'center',justifyContent:'center',borderRadius:3,padding:'4px 20px',marginLeft:20}}>
                                <IoCloseSharp color={_.colors.colorWhite} size={18}/>
                                <Typography variant='button' sx={{fontSize:14,fontWeight:'bold',textTransform:'capitalize',color:_.colors.colorWhite,marginLeft:1}} component="div">Reject</Typography>
                            </Button>
                        </Box>}
                    </Grid>
                </Grid>
                <Grid container lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'column',marginTop:1}}>
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:1}}>
                        <SiHomeassistantcommunitystore color={_.colors.colorTitle} size={18}/>
                        <Typography variant="h1" sx={{fontSize:16,color:_.colors.colorTitle,fontWeight:'bold',marginLeft:1}} component="div">Restaurant :</Typography>
                        <Typography variant="h1" sx={{fontSize:18,color:_.colors.colorOrange,fontWeight:'bold',marginLeft:1,textDecorationLine:'underline'}} component="div">{orderDetails?.restaurant?.restaurant_name}</Typography>
                    </Box>
                    <Box sx={{marginTop:1.4,display:'flex'}}>
                        <SiAirtable color={_.colors.colorTitle} size={18}/>
                        <Typography variant="h1" sx={{fontSize:16,color:_.colors.colorTitle,fontWeight:'bold',marginLeft:1}} component="div">Table no. :</Typography>
                        <Typography variant="h1" sx={{fontSize:18,color:_.colors.colorOrange,fontWeight:'bold',marginLeft:1}} component="div">{orderDetails?.table?.table_no}</Typography>
                    </Box>
                </Grid>
                <Grid container lg={12} sm={12} md={12} xs={12}>
                    <Grid lg={7} sm={12} md={12} xs={12} spacing={4} sx={{marginTop:2,paddingRight:1.5}}>
                        <Card sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:2}}>
                            <Box sx={{width:'100%',display:'flex',flexDirection:'column',}}>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Typography variant="h6" style={{fontSize:18,color:_.colors.colorTitle,marginLeft:4}} component="div">Order Details</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:3}} light />
                            <Grid container lg={12} sm={12} md={12} xs={12} sx={{marginBottom:1}}>
                                {orderDetails?.food_items&&orderDetails?.food_items.map((item:any,index:any)=>{
                                    const selectAddonsValues = item?.selectAddonsValues
                                    const _menuTotalPrice = item?.selectAddonsValues&&item?.selectAddonsValues.length === 0 ||item?.selectAddonsValues === undefined?undefined:selectAddonsValues.map((a:any)=>Number(a.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue})+Number(item.price)
                                    return(
                                        <>
                                        {/* non customizable menu added item */}
                                        {item?.selectAddonsValues&&item?.selectAddonsValues.length === 0 ||item?.selectAddonsValues === undefined?
                                        <>
                                        <Grid lg={8} md={8} sm={12} xs={12} sx={{display:"flex",flexDirection:'row',paddingRight:5,marginBottom:3}}>
                                            <img src={FILE_URL+item.image.path}
                                            style={{height:'100px',width:'100px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                            <Box sx={{marginLeft:2}}>
                                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'start'}}>
                                                    <BiFoodTag color={item.food_type === 'veg'?'#08A117':_.colors.colorRed} size={24} style={{marginTop:-3,marginRight:4}}/>
                                                    <Typography variant="h6" sx={{maxWidth:'100%',fontSize:17,lineHeight:1.15,color:_.colors.colorTitle,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.menu_name}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid lg={4} md={4} sm={12} xs={12}>
                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{item.price}</Typography>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">{item.quantity}</Typography>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{item.price*item.quantity}</Typography>
                                            </Box>
                                        </Grid>
                                        </>:
                                        <>
                                        {/* customizable menu added item */}
                                        {/* {console.log(selectAddonsValues.map((a:any)=>Number(a.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue}),'=====>>><<<')} */}
                                        <Grid lg={8} md={8} sm={12} xs={12} sx={{display:"flex",flexDirection:'row',paddingRight:5,marginBottom:3}}>
                                        <img src={FILE_URL+item.image.path}
                                            style={{height:'100px',width:'100px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                            <Box sx={{marginLeft:2}}>
                                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'start'}}>
                                                    <BiFoodTag color={item.food_type === 'veg'?'#08A117':_.colors.colorRed} size={24} style={{marginTop:-3,marginRight:4}}/>
                                                    <Typography variant="h6" sx={{maxWidth:'100%',fontSize:17,lineHeight:1.15,color:_.colors.colorTitle,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.menu_name}</Typography>
                                                </Box>
                                                <Box sx={{marginTop:2}}>
                                                    {item?.selectAddons.map((item:any,index:any)=>{
                                                        return(
                                                            <AddonsTextView key={index} item={item} index={index} setloading={setloading} selectAddonsValues={selectAddonsValues}/>
                                                        )
                                                    })}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid lg={4} md={4} sm={12} xs={12}>
                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{item.price}</Typography>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">{item.quantity}</Typography>
                                                <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{_menuTotalPrice*item.quantity}</Typography>
                                            </Box>
                                            <Box sx={{display:'flex',flexDirection:'column',marginTop:1.4}}>
                                                {item?.selectAddons.map((item:any,index:any)=>{
                                                    return(
                                                        <AddonsPrices key={index} item={item} index={index} setloading={setloading} selectAddonsValues={selectAddonsValues}/>
                                                    )
                                                })}
                                            </Box>
                                        </Grid>
                                        </>}
                                        </>
                                    )
                                })
                            }
                            </Grid>
                            <Divider sx={{color:_.colors.colorGray,width:'100%'}} light />
                            <Grid container lg={12} sm={12} md={12} xs={12}>
                                <Grid lg={2} sm={2} md={12} xs={12}>       
                                </Grid>
                                <Grid lg={10} sm={10} md={12} xs={12} sx={{paddingTop:1}}>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:.4}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Subtotal:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.subtotal?.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:.2}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">IGST:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.IGST_amount?.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:.2}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">SGST:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.SGST_amount?.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:.2}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">CGST:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.CGST_amount?.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:.2}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Service charges:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.service_tax_amount?.toFixed(2)}</Typography>
                                    </Box>
                                    <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:1.6,marginBottom:1.6}} light />
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',paddingTop:0.6,paddingBottom:0.6}}>
                                        <Typography variant="h6" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Total:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle}} component="div">₹{orderDetails?.total?.toFixed(2)}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid lg={5} sm={12} md={12} xs={12} sx={{marginTop:2,paddingLeft:1.5}}>
                        <Card sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:2}}>
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Typography variant="h6" style={{fontSize:18,color:_.colors.colorTitle,marginLeft:4}} component="div">Customer</Typography>
                            </Box>
                            <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:1.6,marginBottom:1.6}} light />
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',}}>
                                <img src={orderDetails?.user?.profile?orderDetails?.user?.profile.includes("https")?orderDetails?.user?.profile:FILE_URL+FILE_PATH.PROFILE_IMAGE+orderDetails?.user?.profile:_.images.user} 
                                style={{height:'50px',width:'50px',borderRadius:100,objectFit:'cover'}}/>
                                <Box sx={{marginLeft:1}}>
                                    <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle,marginLeft:4}} component="div">{orderDetails?.user?.name}</Typography>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                        <AiOutlineMobile color={_.colors.colorSubTitle} size={15}/>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorSubTitle,marginLeft:4}} component="div">{'+91 '+orderDetails?.user?.phone}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                        <Card sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:2,marginTop:4}}>
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Typography variant="h6" style={{fontSize:18,color:_.colors.colorTitle,marginLeft:4}} component="div">Restaurant</Typography>
                            </Box>
                            <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:1.6,marginBottom:1.6}} light />
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'flex-start',}}>
                                <img src={FILE_URL+orderDetails?.restaurant?.restaurant_logo.path} 
                                style={{height:'50px',width:'50px',borderRadius:100,objectFit:'cover'}}/>
                                <Box sx={{marginLeft:1}}>
                                    <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle,marginLeft:4}} component="div">{orderDetails?.restaurant?.restaurant_name}</Typography>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle,marginLeft:4}} component="div">Email:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorSubTitle,marginLeft:4}} component="div">{orderDetails?.restaurant?.restaurant_email}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle,marginLeft:4}} component="div">Phone:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorSubTitle,marginLeft:4}} component="div">+91 {orderDetails?.restaurant?.restaurant_contact_number}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',}}>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorTitle,marginLeft:4}} component="div">Address:</Typography>
                                        <Typography variant="h6" style={{fontSize:14,color:_.colors.colorFacebook,marginLeft:4}} component="div">{orderDetails?.restaurant?.restaurant_address.address+','+orderDetails?.restaurant?.restaurant_address.city+','+orderDetails?.restaurant?.restaurant_address.state}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                        {orderDetails?.instructions.length !== 0&&<Card sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:2,marginTop:4}}>
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Typography variant="h6" style={{fontSize:18,color:_.colors.colorTitle,marginLeft:4}} component="div">Instructions</Typography>
                            </Box>
                            <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:1.6,marginBottom:1.6}} light />
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',}}>
                                <Typography sx={{marginRight:1}} variant="body1" gutterBottom>{orderDetails?.instructions}</Typography>
                            </Box>
                        </Card>}
                    </Grid>
                </Grid>
            </Grid>
        </Box>}
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
        {/* Select Waiter */}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
        open={selectWaiterBackDrop}>
            <SelectWaiterView item={orderDetails} setselectWaiterBackDrop={setselectWaiterBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _orderDetails={_orderDetails}/>
        </Backdrop>
        </ThemeProvider>
    );
}

export default OrderDetails;