import { Alert, Autocomplete, Backdrop, Box, Button, Card, CircularProgress, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdOutlineEditNote, MdRestaurant } from 'react-icons/md';
import { RiEditBoxLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, PATH } from '../../api';
import { Empty } from '../../components';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import Select from '../../components/Select';
import _ from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const TableEnable = (props:any)=>{
    const navigation = useNavigate()
    const {item,index,orderListByRestaurant} = props
    const [countDown, setcountDown] = useState<any>('00.00')
    useEffect(() => {
        //console.log(orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed').find((b:any)=>b.table._id === item._id).order_date_and_time,'>>>>><<<<<<<')
        var eventTime = moment(new Date()).unix();
        var currentTime:any = moment(orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status.title !== 'Cancelled').find((b:any)=>b.table._id === item._id).order_date_and_time).unix();
        var diffTime = eventTime - currentTime;
        var duration:any = moment.duration(diffTime*1000, 'milliseconds');
        var interval = 1000;
        
        const timer = setInterval(function(){
          duration = moment.duration(duration + interval, 'milliseconds');
          const min_sec = `${duration.minutes()!==0?`${duration.minutes().toString().length === 1 ?'0'+duration.minutes()+':':duration.minutes()+':'}`:'00:'}`+`${duration.seconds()!==0? `${duration.seconds().toString().length === 1?'0'+duration.seconds():duration.seconds()}`:'00'}`
          setcountDown(`${duration.hours()!==0?duration.hours()+':'+min_sec:min_sec}`)
        }, interval);
        return()=> clearInterval(timer)
    }, [])

    function _downloadKot(item:any) {
        // const linkSource = `data:application/pdf;base64,${pdf}`;
        // const downloadLink = document.createElement("a");
        // const fileName = `KOT(${Date.now()}).pdf`;
    
        // downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        // downloadLink.click();
        const pdf = item?.kot;
        const w = parseInt(item?.restaurant?.bill_width);
        const div = document.createElement('div');
        div.innerHTML = pdf;
        var doc = new jsPDF('p', 'mm', [200, w || 58]);

        doc.html(div, {callback: (doc) => {
            doc.save(`KOT(${Date.now()}).pdf`);
        }, margin: [5, 5, 5, 5], html2canvas: {scale: w === 80 ? 0.260 : 0.185}, autoPaging: true})
    }
    
    return(
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Box sx={{height:'120px',width:'180px',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',marginTop:2,padding:2}}>
                <Card sx={{height:'60px',width:'40px',backgroundColor:_.colors.colorOrange,position:'absolute',bottom:0,top:0,left:0,marginTop:'auto',marginBottom:'auto',marginLeft:'auto'}}/>
                <Card sx={{height:'60px',width:'40px',backgroundColor:_.colors.colorOrange,position:'absolute',bottom:0,top:0,right:0,marginTop:'auto',marginBottom:'auto',marginRight:'auto'}}/>
                <Box sx={{display:'flex',width:'100%',alignItems:'start',justifyContent:'center',position:'absolute',top:0}}>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorOrange,marginRight:1}}/>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorOrange,marginLeft:1}}/>
                </Box>
                <Box sx={{display:'flex',width:'100%',alignItems:'start',justifyContent:'center',position:'absolute',bottom:0}}>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorOrange,marginRight:1}}/>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorOrange,marginLeft:1}}/>
                </Box>
                <Card sx={{height:'100%',width:'100%',position:'relative',display:'flex',alignItems:"center",justifyContent:'center',backgroundColor:_.colors.colorOrangeDisable,borderRadius:2,zIndex:999}}>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <Typography variant="h6" sx={{fontSize:18,color:_.colors.colorOrange,textAlign:'center',fontWeight:'bold',marginTop:-2}} component="div">{item.table_no}</Typography>
                        <Typography variant="h6" sx={{fontSize:10,color:_.colors.colorOrange,textAlign:'center',fontWeight:'bold'}} component="div">Capacity {item.capacity_people}</Typography>
                        <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,textAlign:'center',fontWeight:'bold',marginTop:1,marginBottom:-3}} component="div">{countDown}</Typography>
                    </Box>
                </Card>
            </Box>
            <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-evenly',paddingLeft:5,paddingRight:5,marginTop:3}}>
            <Tooltip title="Edit Order">
                <Box border={4} sx={{borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1}}>
                    <IconButton onClick={()=>navigation('/admin/orders/add-new-order',{state:{TAG:'EDIT',data:orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status.title !== 'Cancelled').find((b:any)=>b.table._id === item._id)}})}>
                        <MdOutlineEditNote color={_.colors.colorTitle} size={18} style={{margin:-3}}/>
                    </IconButton>
                </Box>
                </Tooltip>
                <Tooltip title="View Order">
                    <Box border={4} sx={{borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1}}>
                        <IconButton onClick={()=>navigation('/admin/orders/details',{state:{data:orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status.title !== 'Cancelled').find((b:any)=>b.table._id === item._id)}})}>
                            <AiOutlineFileSearch color={_.colors.colorTitle} size={18} style={{margin:-3}}/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Print KOT">
                    <Box border={4} sx={{borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1}}>
                        <IconButton onClick={()=>_downloadKot(orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status.title !== 'Cancelled').find((b:any)=>b.table._id === item._id))}>
                            <BsFileText color={_.colors.colorTitle} size={18} style={{margin:-3}}/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    )
}

const TableDisable = (props:any)=>{
    const navigation = useNavigate()
    const {item,index,restaurant} = props
    return(
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Box sx={{height:'120px',width:'180px',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',marginTop:2,padding:2}}>
                <Card sx={{height:'60px',width:'40px',backgroundColor:_.colors.colorGray2,position:'absolute',bottom:0,top:0,left:0,marginTop:'auto',marginBottom:'auto',marginLeft:'auto'}}/>
                <Card sx={{height:'60px',width:'40px',backgroundColor:_.colors.colorGray2,position:'absolute',bottom:0,top:0,right:0,marginTop:'auto',marginBottom:'auto',marginRight:'auto'}}/>
                <Box sx={{display:'flex',width:'100%',alignItems:'start',justifyContent:'center',position:'absolute',top:0}}>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorGray2,marginRight:1}}/>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorGray2,marginLeft:1}}/>
                </Box>
                <Box sx={{display:'flex',width:'100%',alignItems:'start',justifyContent:'center',position:'absolute',bottom:0}}>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorGray2,marginRight:1}}/>
                    <Card sx={{height:'40px',width:'60px',backgroundColor:_.colors.colorGray2,marginLeft:1}}/>
                </Box>
                <Card sx={{height:'100%',width:'100%',position:'relative',display:'flex',alignItems:"center",justifyContent:'center',backgroundColor:'#F0F0F0',borderRadius:2,zIndex:999}}>
                    <Box sx={{display:'block',alignItems:'center',justifyContent:'center'}}>
                        <Typography variant="h6" sx={{fontSize:18,color:_.colors.colorGray2,textAlign:'center',fontWeight:'bold',marginTop:-2}} component="div">{item.table_no}</Typography>
                        <Typography variant="h6" sx={{fontSize:10,color:_.colors.colorGray2,textAlign:'center',fontWeight:'bold'}} component="div">Capacity {item.capacity_people}</Typography>
                        {/* <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,textAlign:'center',fontWeight:'bold',position:'absolute',bottom:10}} component="div">00:30 mins</Typography> */}
                    </Box>
                </Card>
            </Box>
            <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-evenly',paddingLeft:5,paddingRight:5,marginTop:3}}>
                <Tooltip title="Add Order">
                    <Box border={4} sx={{position:'relative',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1}}>
                        <IconButton onClick={()=>navigation('/admin/orders/add-new-order',{state:{TAG:'TABLE_VIEW',data:{table:item,restaurant:restaurant}}})}>
                            <MdRestaurant color={_.colors.colorTitle} size={18} style={{margin:-3}}/>
                        </IconButton>
                        <Box sx={{height:12,width:12,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:_.colors.colorOrange,position:'absolute',right:-4,bottom:-4}}>
                            <BsPlusLg color={_.colors.colorWhite} size={6}/>
                        </Box>
                     </Box> 
                </Tooltip>
            </Box>
        </Box>
    )
}

const TableViewList = (props:any)=>{
    const {item,index,restaurant,orderListByRestaurant} = props
    return(
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',margin:4}}>
            {orderListByRestaurant.find((a:any)=>a.table._id === item._id) && orderListByRestaurant.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status?.title !== 'Cancelled').find((b:any)=>b.table._id === item._id)?
            <TableEnable item={item} index={index} orderListByRestaurant={orderListByRestaurant} />
            :<TableDisable item={item} index={index} restaurant={restaurant}/>}
        </Box>
    )
}

export default function TableView () {
    const {pathname} = useLocation();
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
    const [loading, setloading] = useState(true)
    const [restaurantsList, setrestaurantsList] = useState([])
    const [restaurant, setrestaurant] = useState<any>(null)
    const [tableList, settableList] = useState<any>(null)
    const [orderListByRestaurant, setorderListByRestaurant] = useState([])

    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setloading(true)
        if(userDetails.user.admin_type === 'MANAGER' || userDetails.user.admin_type === 'WAITER' || userDetails.user.admin_type === 'CHEF'){
            setrestaurant(userDetails.user.restaurant)
            setloading(false)
        }else{
            setloading(false)
        }
    }, [])
    
    useEffect(() => {
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
                setrestaurantsList(response.data.data)
              }else{
                console.log('else');
              }
            })
            .catch(function (error:any) {
              console.log(error);
              setloading(false)
            });
          }
        _listOfRestaurantsList()
    }, [])

    const _order_list_by_restaurant = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'restaurant':restaurant?._id
        });
        var config = {
            method: 'post',
            url: BASE_URL+PATH.RESTAURANT_BY_ORDER_LIST,
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
                setorderListByRestaurant(response.data.data)

            }else{
            console.log('else');
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    useEffect(() => {
        {/* TABLE LIST BY RESTAURANT & ORDER LIST BY RESTAURANT FIND ACTIVE TABLE */}
        const _table_list_by_restaurant = ()=>{
            if(restaurant?._id){
                setloading(true)
                var axios = require('axios');
                var qs = require('qs');
                var data = qs.stringify({
                  'restaurant':restaurant?._id
                });
                var config = {
                  method: 'post',
                  url: BASE_URL+PATH.RESTAURANT_BY_TABLE_LIST,
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
                    settableList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
                    _order_list_by_restaurant()
                  }else{
                    console.log('else');
                  }
                })
                .catch(function (error:any) {
                  console.log(error);
                  setloading(false)
                });
            }else{
                settableList(null)
            }
        }
        _table_list_by_restaurant()
    }, [restaurant])

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex',paddingBottom:10,justifyContent:'center'}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Box style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold'}} component="div">Table View</Typography>
                        {/* <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold',backgroundColor:_.colors.colorOrangeDisable,padding:10,borderRadius:10,marginLeft:10}} component="div">32</Typography> */}
                    </Box>
                    <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',paddingLeft:5,paddingRight:5}}>
                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <GoPrimitiveDot color={_.colors.colorOrange} size={25}/>
                            <Typography variant="h6" sx={{fontSize:12,color:_.colors.colorTitle,textAlign:'center',fontWeight:'bold'}} component="div">Occupied</Typography>
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',marginLeft:2}}>
                            <GoPrimitiveDot color={_.colors.colorGray} size={25}/>
                            <Typography variant="h6" sx={{fontSize:12,color:_.colors.colorTitle,textAlign:'center',fontWeight:'bold'}} component="div">Available</Typography>
                        </Box>
                    </Box>
                </Box>
                {/* Select user */}
                {userDetails.user.admin_type === 'MANAGER' || userDetails.user.admin_type === 'WAITER' || userDetails.user.admin_type === 'CHEF'?
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',margin:2}}>
                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                    <Autocomplete
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    sx={{width:'100%'}}
                    options={restaurantsList}
                    getOptionLabel={(option:any) => option.restaurant_name}
                    disabled={true}
                    filterSelectedOptions
                    defaultValue={userDetails.user.restaurant}
                    onChange={(event:any, values:any)=>{
                        setrestaurant(values)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size='small' color='secondary'
                        />
                    )}/>
                    </Box>
                </Box>
                :
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',margin:2}}>
                    <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                    <Autocomplete
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    sx={{width:'100%'}}
                    options={restaurantsList}
                    getOptionLabel={(option:any) => option.restaurant_name}
                    filterSelectedOptions
                    onChange={(event:any, values:any)=>{
                        setrestaurant(values)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size='small' color='secondary'
                            label={'Select restaurant'}
                        />
                    )}/>
                    </Box>
                </Box>}
                {/*  */}
                
                {restaurant?
                tableList&&tableList.length === 0 && !loading?
                    <Empty/>
                :
                    tableList&&tableList.map((item:any,index:any)=>{
                    return(
                        <TableViewList key={index} item={item} index={index} restaurant={restaurant} orderListByRestaurant={orderListByRestaurant}/>
                    )
                })
                :
                    <Select/>
                }
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

