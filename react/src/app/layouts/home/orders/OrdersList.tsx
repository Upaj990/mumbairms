import * as React from 'react';
import { Alert, AppBar, Autocomplete, Backdrop, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Snackbar, Step, StepButton, Stepper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { TableCell } from '@mui/material';
import _ from "../../../config";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { BiDollar } from 'react-icons/bi';
import { TbFileInvoice } from 'react-icons/tb';
import { AiOutlineEdit,AiOutlineCheck } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import type { RootState } from '../../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { MdOutlineEditNote, MdHistory,MdDeleteOutline } from 'react-icons/md';
import { BsCheckLg, BsFilter, BsSearch } from 'react-icons/bs';
import { GoEye, GoPrimitiveDot, GoTriangleDown } from 'react-icons/go';
import { AiOutlineDownload } from 'react-icons/ai';
import { RiBillLine } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import { withStyles } from '@mui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, PATH } from '../../../api';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Empty } from '../../../components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

const StyledTableContainer = withStyles((theme) => ({
    root: {
      width: "100%"
    }
  }))(TableContainer);

const theme = createTheme({
  palette: {
    secondary: {
      main: _.colors.colorOrange,
      contrastText:_.colors.colorWhite
    },
    primary: {
      main: _.colors.colorSubTitle,
      //contrastText:_.colors.colorBlack
    }
  }
});

  const PaymentStatusView = (props:any)=>{
    const {item} = props;
      return(
        <Box sx={{minHeight:'80px',minWidth:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <Box style={{display:'flex',backgroundColor:item?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 0.07)' : 'rgba(0, 200, 100, 0.07)',alignItems:'center',justifyContent:'center',borderRadius:4,padding:'4px 8px'}}>
              <GoPrimitiveDot color={item?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 1)' : 'rgba(0, 200, 100, 1)'} size={14}/>
              <Typography variant="h1" sx={{fontSize:12,color:item?.payment_status?.title === 'Unpaid' ? 'rgba(255, 0, 92, 1)':'rgba(0, 200, 100, 1)',fontWeight:'bold',marginLeft:.5}} component="div">{item?.payment_status?.title === 'Unpaid'?'Unpaid':'Paid'}</Typography>
            </Box>
        </Box>
      )
  }

  const OrderStatusView = (props:any)=>{
    const {item} = props;
    
    return(
        <Box sx={{minWidth:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <Box style={{display:'flex',backgroundColor:_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.light,alignItems:'center',justifyContent:'center',borderRadius:4,padding:'4px 8px'}}>
            <GoPrimitiveDot color={_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.dark} size={14}/>
            <Typography variant="h1" sx={{fontSize:12,color:_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.dark,fontWeight:'bold',marginLeft:.5}} component="div">{item?.order_status.title}</Typography>
          </Box>
        </Box>
    )
  }

  const UserNameView = (props:any)=>{
    const {item} = props;
    return(
      <Box sx={{minWidth:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <Typography variant="caption" sx={{fontSize:16,color:_.colors.colorBlack}} component="div">{item?.user?.name}</Typography>
        <Typography variant="caption" sx={{fontSize:15,color:_.colors.colorTitle}} component="div">+91 {item?.user?.phone}</Typography>
      </Box>
    )
  }

  const AddChefView = (props:any)=>{
    const {item,setaddChefBackDrop,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [chefList, setchefList] = useState([])
    const [chef, setchef] = useState<any>(null)

    const _listOfChef = ()=>{
      setloading(true)
      var axios = require('axios');
      var config = {
        method: 'post',
        url: BASE_URL+PATH.LIST_OF_CHEFS,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      };
      axios(config)
      .then(function (response:any) {
        setloading(false)
        console.log(JSON.stringify(response.data));
        if(response.data.status){
          setchefList(response.data.data.filter((a:any)=>a.restaurant._id === item?.restaurant._id  && a.active_inactive === true))
        }else{
  
        }
      })
      .catch(function (error:any) {
        setloading(false)
        console.log(error);
      });
    }
  
    useEffect(() => {
      _listOfChef()
    }, [])

    const _addWiter = ()=>{
      if(!chef){
        setopenSnackbar({ ...openSnackbar, open: true,message:'Please select chef !!',type:'error' }); 
      }else{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': item._id,
          'chef': chef._id
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
              _order_list()
              setaddChefBackDrop(false)
              setchef(null)
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
        <Typography variant='body1' sx={{fontSize:20,color:_.colors.colorTitle,fontWeight:'normal',marginTop:.5,marginBottom:2}} component="div">Select Chef</Typography>
        <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{width:'90%'}}
        options={chefList}
        value={chef}
        getOptionLabel={(option:any) => option.name}
        filterSelectedOptions
        onChange={(event:any, values:any)=>{
          setchef(values)
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
              setaddChefBackDrop(false)
              setchef(null)
            }} size='small'>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Cancel</Typography>
          </Button>
          <Button onClick={_addWiter} size='small' sx={{marginLeft:2}}>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Submit</Typography>
          </Button>
        </Box>
      </Box>
    )
  }

  const ChefView = (props:any)=>{
    const {item,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [addChefBackDrop, setaddChefBackDrop] = useState(false)
    return(
      <Box sx={{width:'150px'}}>
      {item?.chef?
      <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">{item.chef.name}</Typography>
      :
      item.order_status.title === 'Placed' || item.order_status.title === 'Cancelled' || item.order_status.title === 'Completed' ?
      <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">N/A</Typography>
      :
      <Button variant='outlined' onClick={()=>setaddChefBackDrop(true)}>
        <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack,textTransform:'capitalize'}} component="div">Select Chef</Typography>
      </Button>}
      {/* Select chef */}
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
      open={addChefBackDrop}>
        <AddChefView item={item} setaddChefBackDrop={setaddChefBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>
      </Backdrop>
      </Box>
    )
  }

  const AddWaiterView = (props:any)=>{
    const {item,setaddWaiterBackDrop,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [waitersList, setwaitersList] = useState([])
    const [waiter, setwaiter] = useState<any>(null)

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
          setwaitersList(response.data.data.filter((a:any)=>a.restaurant._id === item?.restaurant._id && a.active_inactive === true))
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
    }, [])

    const _addWiter = ()=>{
      if(!waiter){
        setopenSnackbar({ ...openSnackbar, open: true,message:'Please select waiter !!',type:'error' }); 
      }else{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': item._id,
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
              _order_list()
              setaddWaiterBackDrop(false)
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
              setaddWaiterBackDrop(false)
              setwaiter(null)
            }} size='small'>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Cancel</Typography>
          </Button>
          <Button onClick={_addWiter} size='small' sx={{marginLeft:2}}>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Submit</Typography>
          </Button>
        </Box>
      </Box>
    )
  }

  const WaiterView = (props:any)=>{
    const {item,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [addWaiterBackDrop, setaddWaiterBackDrop] = useState(false)
    return(
      <Box sx={{width:'150px'}}>
      {item?.waiter?
      <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">{item.waiter.name}</Typography>
      :
      item.order_status.title === 'Placed' || item.order_status.title === 'Cancelled' || item.order_status.title === 'Completed'?
      <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">N/A</Typography>
      :
      <Button variant='outlined' onClick={()=>setaddWaiterBackDrop(true)}>
        <Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack,textTransform:'capitalize'}} component="div">Select Waiter</Typography>
      </Button>}
      {/* Select Waiter */}
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
      open={addWaiterBackDrop}>
        <AddWaiterView item={item} setaddWaiterBackDrop={setaddWaiterBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>
      </Backdrop>
      </Box>
    )
  }

  const SelectWaiterView = (props:any)=>{
    const {item,setselectWaiterBackDrop,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
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
          setwaitersList(response.data.data.filter((a:any)=>a.restaurant._id === item?.restaurant._id))
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
    }, [])

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
              _order_list()
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

  const ChangerStatusView = (props:any)=>{
    const {item,setchangerStatusBackDrop,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [orderStatus, setorderStatus] = useState<any>(null)
    const {userDetails} = useSelector((state:RootState) => state);

    const _changeStatus = ()=>{
      if(!orderStatus){
        setopenSnackbar({ ...openSnackbar, open: true,message:'Please select status !!',type:'error' }); 
      }else if(item?.payment_status?.title === 'Unpaid' && orderStatus?.title === 'Completed'){
        setopenSnackbar({ ...openSnackbar, open: true,message:'Please mark this order as paid, if you want to Complete it !!',type:'error' }); 
      }else{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': item._id,
          'order_status': orderStatus,
          'order_history':{id:uuid(),user:userDetails?.user,order_status:orderStatus,activity:'Update'},
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
              _order_list()
              setorderStatus(null)
              setchangerStatusBackDrop(false)
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

    const status_one = [{id:'PRE',title:'Preparing'},{id:'SER',title:'Served'},{id:'COM',title:'Completed'},{id:'CAN',title:'Cancelled'}]
    const status_two = [{id:'SER',title:'Served'},{id:'COM',title:'Completed'},{id:'CAN',title:'Cancelled'}]
    const status_three = [{id:'COM',title:'Completed'},{id:'CAN',title:'Cancelled'}]
    const status_four = [{id:'PREP',title:'Prepared'}]

    return(
      <Box sx={{width:'30%',backgroundColor:_.colors.colorWhite,display:'flex',flexDirection:'column',alignItems:'center',borderRadius:1,padding:2}}>
        <Typography variant='body1' sx={{fontSize:20,color:_.colors.colorTitle,fontWeight:'normal',marginTop:.5,marginBottom:2}} component="div">Change Status</Typography>
        <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{width:'90%'}}
        value={orderStatus}
        options={userDetails?.user.admin_type === 'CHEF'?status_four:item?.order_status.title === 'Preparing' ? status_two : item?.order_status.title === 'Preparing' || item?.order_status.title === 'Served' ? status_three : status_one}
        getOptionLabel={(option:any) => option.title}
        filterSelectedOptions
        onChange={(event:any, values:any)=>{
          setorderStatus(values)
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
              setchangerStatusBackDrop(false)
              setorderStatus(null)
            }} size='small'>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Cancel</Typography>
          </Button>
          <Button onClick={_changeStatus} size='small' sx={{marginLeft:2}}>
            <Typography sx={{color:_.colors.colorOrange,fontSize:15}}>Submit</Typography>
          </Button>
        </Box>
      </Box>
    )
  }

  const StatusHistoryView = (props:any)=>{
    const {item,setstatusHistoryBackDrop} = props;
    return(
      <Box sx={{maxHeight:'50%',width:'32%',backgroundColor:_.colors.colorWhite,display:'flex',flexDirection:'column',alignItems:'center',borderRadius:2}}>
        <Box sx={{width:'100%',display:'flex',backgroundColor:_.colors.colorOrange,alignItems:'center',justifyContent:'space-between',borderTopLeftRadius:7.8,borderTopRightRadius:7.8}}>
          <Typography noWrap variant='body1' sx={{fontSize:18,color:_.colors.colorWhite,fontWeight:'normal',margin:1.4}} component="div">Status History</Typography>
          <Box sx={{height:28,width:28,backgroundColor:_.colors.colorWhite,display:'flex',alignItems:'center',justifyContent:'center',margin:1.5,borderRadius:100,boxShadow:5}}>
            <IconButton onClick={()=>setstatusHistoryBackDrop(false)} size="small">
              <IoMdClose color={_.colors.colorTitle} size={16}/>
            </IconButton>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{paddingBottom:2}}>
          <Table sx={{ width: '100%'}} aria-label="simple table">
            <TableHead sx={{backgroundColor:_.colors.colorExtraLightGray}}>
              <TableRow>
                <TableCell align="center" sx={{color:_.colors.colorTitle,fontWeight:'bold'}}>S/N</TableCell>
                <TableCell align="center" sx={{color:_.colors.colorTitle,fontWeight:'bold'}}>History</TableCell>
                <TableCell align="center" sx={{color:_.colors.colorTitle,fontWeight:'bold'}}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.order_history.map((item:any,index:any) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{index+1}</TableCell>
                  <TableCell align="center">{
                    <Box>
                      <Typography noWrap variant="caption" sx={{fontSize:12,color:_.colors.colorDarkGray,lineHeight:1.2}} component="div">{item?.activity === 'Created'?item?.user.admin_type === 'SUPER'?'Create by':`Create by ${_.adminType.find((a:any)=>a.type === item?.user.admin_type)?.admin}`:item?.user.admin_type === 'SUPER'?'Update by':`Update by ${_.adminType.find((a:any)=>a.type === item?.user.admin_type)?.admin}`}</Typography>
                      <Typography noWrap variant="caption" sx={{fontSize:14,color:_.colors.colorTitle,lineHeight:1.2}} component="div">{item?.user.admin_type === 'SUPER'?'Admin':item?.user.name}</Typography>
                    </Box>
                  }</TableCell>
                  <TableCell align="center">
                    <Box sx={{minWidth:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <Box style={{display:'flex',backgroundColor:_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.light,alignItems:'center',justifyContent:'center',borderRadius:4,padding:'4px 8px'}}>
                        <GoPrimitiveDot color={_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.dark} size={14}/>
                        <Typography variant="h1" sx={{fontSize:12,color:_.statusColor.find((a:any)=>a.status === item?.order_status.title)?.dark,fontWeight:'bold',marginLeft:.5}} component="div">{item?.order_status.title}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  const ActionView = (props:any)=>{
    const navigation = useNavigate()
    const {item,setloading,setopenSnackbar,openSnackbar,_order_list} = props;
    const [selectWaiterBackDrop, setselectWaiterBackDrop] = useState(false)
    const [changerStatusBackDrop, setchangerStatusBackDrop] = useState(false)
    const [deleteDialog, setdeleteDialog] = useState(false)
    const [paymentStatusDialog, setpaymentStatusDialog] = useState(false)
    const [statusHistoryBackDrop, setstatusHistoryBackDrop] = useState(false)

    const {userDetails} = useSelector((state:RootState) => state);

    const _acceptOrder = ()=>{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        'id': item._id,
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
          _order_list()
        }else{
          setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
        }
      })
      .catch(function (error:any) {
          setloading(false)
          console.log(error);
      });
    }

    const _rejectOrder = ()=>{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        'id': item._id,
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
            _order_list()
          }else{
            setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
          }
      })
      .catch(function (error:any) {
          setloading(false)
          console.log(error);
      });
    }

    const _deleteOrder = ()=>{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        '_id': item._id
      });
      var config = {
        method: 'post',
        url: BASE_URL+PATH.DELETE_ORDER,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };

      axios(config)
      .then(function (response:any) {
        console.log(JSON.stringify(response.data));
        if(response.data.status){
          _order_list()
          setdeleteDialog(false)
        }else{
          setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
        }
      })
      .catch(function (error:any) {
        console.log(error);
      });
    }

    const _paymentStatusUpdate = ()=>{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        'id': item._id,
        'payment_status': {id:'PAI',title:'Paid'},
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
            _order_list()
            setpaymentStatusDialog(false)
          }else{
            setopenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
          }
      })
      .catch(function (error:any) {
          setloading(false)
          console.log(error);
      });
    }

    function _downloadBill(item: any) {
      // const linkSource = `data:application/pdf;base64,${pdf}`;
      // const downloadLink = document.createElement("a");
      // const fileName = `Bill(${Date.now()}).pdf`;
  
      // downloadLink.href = linkSource;
      // downloadLink.download = fileName;
      // downloadLink.click();
      const pdf = item?.bill;
      const w = parseInt(item?.restaurant?.bill_width);
      const div = document.createElement('div');
      div.innerHTML = pdf;
      var doc = new jsPDF('p', 'mm', [110, w || 58]);

      doc.html(div, {callback: (doc) => {
          doc.save(`Bill(${Date.now()}).pdf`);
      }, margin: [5, 5, 5, 5], html2canvas: {scale: w === 80 ? 0.275 : 0.225}, autoPaging: true})
    }
    function _downloadInvoice(pdf:any) {
      // const linkSource = `data:application/pdf;base64,${pdf}`;
      // const downloadLink = document.createElement("a");
      // const fileName = `Invoice(${Date.now()}).pdf`;
  
      // downloadLink.href = linkSource;
      // downloadLink.download = fileName;
      // downloadLink.click();
      const div = document.createElement('div');
      div.innerHTML = pdf;
      var doc = new jsPDF('p', 'mm', "a4");

      doc.html(div, {callback: (doc) => {
          doc.save(`Bill(${Date.now()}).pdf`);
      }, margin: [5, 5, 5, 5], html2canvas: {scale: 0.175}, autoPaging: true})
    }
    
    return(
      <>
        {userDetails?.user.admin_type === 'CHEF'?
        <>
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Tooltip title="View Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>navigation('/admin/orders/details',{state:{data:item}})}>
                <GoEye color={_.colors.colorDarkGray} size={16}/>
              </IconButton>
            </Box>
          </Tooltip>
          {item?.order_status?.title === 'Accepted' || item?.order_status?.title === 'Preparing'?
          <Tooltip title="Change Status">
            <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>setchangerStatusBackDrop(true)}>
                <MdOutlineEditNote color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>:null}
        </Box>
        {/* Change Status */}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
        open={changerStatusBackDrop}>
          <ChangerStatusView item={item} setchangerStatusBackDrop={setchangerStatusBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>
        </Backdrop>
        </>
        :
        <>
        {/* */}
        {item?.order_status?.title === 'Placed'&&
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Tooltip title="Accept Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',backgroundColor:_.colors.colorAccept,alignItems:'center',justifyContent:'center',borderColor:_.colors.colorGreen,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>{
                  if(item.waiter){
                    _acceptOrder()
                  }else{
                    setselectWaiterBackDrop(true)
                  }
                }}>
                  <BsCheckLg color={_.colors.colorWhite} size={14}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Reject Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',backgroundColor:_.colors.colorReject,alignItems:'center',justifyContent:'center',borderColor:_.colors.colorRed,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={_rejectOrder}>
                  <IoCloseSharp color={_.colors.colorWhite} size={18}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="View Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>navigation('/admin/orders/details',{state:{data:item}})}>
                  <GoEye color={_.colors.colorDarkGray} size={16}/>
                </IconButton>
            </Box>
          </Tooltip>
        </Box>}
        {/* */}
        {item?.order_status?.title === 'Accepted' || item?.order_status?.title === 'Preparing' || item?.order_status?.title === 'Served' || item?.order_status?.title === 'Prepared'?
        <Box style={{minWidth:'80px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Tooltip title="View Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>navigation('/admin/orders/details',{state:{data:item}})}>
                  <GoEye color={_.colors.colorDarkGray} size={16}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Edit Order">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>navigation('/admin/orders/add-new-order',{state:{TAG:'EDIT',data:item}})}>
                    <AiOutlineEdit color={_.colors.colorTitle} size={18}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Change Status">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>setchangerStatusBackDrop(true)}>
                  <MdOutlineEditNote color={_.colors.colorTitle} size={18}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Status History">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>setstatusHistoryBackDrop(true)}>
                    <MdHistory color={_.colors.colorTitle} size={18}/>
                </IconButton>
            </Box>
          </Tooltip>
          {item.payment_status.title === 'Unpaid'&&<Tooltip title="Payment Status">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>setpaymentStatusDialog(true)}>
                  <BiDollar color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>}
          <Tooltip title="Print Bill">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>_downloadBill(item)}>
                  <RiBillLine color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Delete Order">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>setdeleteDialog(true)}>
                    <MdDeleteOutline color={_.colors.colorTitle} size={18}/>
                </IconButton>
            </Box>
          </Tooltip>
        </Box>:null}
        {/* */}
        {item?.order_status?.title === 'Completed' || item?.order_status?.title === 'Cancelled'?
        <Box style={{minWidth:'80px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Tooltip title="View Order">
            <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
                <IconButton onClick={()=>navigation('/admin/orders/details',{state:{data:item}})}>
                  <GoEye color={_.colors.colorDarkGray} size={16}/>
                </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Status History">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>setstatusHistoryBackDrop(true)}>
                <MdHistory color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Print Bill">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>_downloadBill(item)}>
                  <RiBillLine color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Print Invoice">
          <Box border={4} sx={{height:30,width:30,display:'flex',alignItems:'center',justifyContent:'center',borderColor:_.colors.colorTitle,borderWidth:0.5,borderRadius:1,marginRight:2}}>
              <IconButton onClick={()=>_downloadInvoice(item.invoice)}>
                <TbFileInvoice color={_.colors.colorTitle} size={18}/>
              </IconButton>
            </Box>
          </Tooltip>
        </Box>:null}
        {/* Select Waiter */}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
        open={selectWaiterBackDrop}>
          <SelectWaiterView item={item} setselectWaiterBackDrop={setselectWaiterBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>
        </Backdrop>
        {/* Change Status */}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
        open={changerStatusBackDrop}>
          <ChangerStatusView item={item} setchangerStatusBackDrop={setchangerStatusBackDrop} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>
        </Backdrop>
        {/* Status History */}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
        open={statusHistoryBackDrop}>
          <StatusHistoryView item={item} setstatusHistoryBackDrop={setstatusHistoryBackDrop}/>
        </Backdrop>
        {/* Delete Order */}
        <Dialog
        open={deleteDialog}
        onClose={()=>setdeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Delete Order
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color={'secondary'} onClick={()=>setdeleteDialog(false)}>No</Button>
            <Button color={'secondary'} onClick={_deleteOrder} autoFocus>Yes</Button>
          </DialogActions>
        </Dialog>
        {/* Payment Status */}
        <Dialog
        open={paymentStatusDialog}
        onClose={()=>setpaymentStatusDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Payment Status
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to mark this order as paid?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color={'secondary'} onClick={()=>setpaymentStatusDialog(false)}>No</Button>
            <Button color={'secondary'} onClick={_paymentStatusUpdate} autoFocus>Yes</Button>
          </DialogActions>
        </Dialog>
        </>}
      </>
    )
}

export default function OrdersList() {
  const navigation = useNavigate()
  const {pathname} = useLocation();
  const mediaQueryMatch = useMediaQuery('(min-width:600px)');
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
  };
  const [orderList, setorderList] = useState<any>([])
  const [loading, setloading] = useState(false)
  const [searchValue, setsearchValue] = useState('')
  const [totalNumberOfOrders, settotalNumberOfOrders] = useState(0)
  const [currentPage, setcurrentPage] = useState(1)
  const {userDetails} = useSelector((state:RootState) => state);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const pageLength = 10

  // This function is not used for fetching orders.
  const _order_list = ()=>{
    setloading(true)
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      search:searchValue
    });
    var config = {
      method: 'post',
      url: BASE_URL+PATH.LIST_OF_ORDERS,
     headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };

    axios(config)
    .then(function (response:any) {
      setloading(false)
      if(response.data.status){
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER'){
          let restaurant_by_order_list = response.data.data.filter((a:any)=>a.restaurant._id === userDetails?.user.restaurant._id)
          if(pathname === '/admin/orders/all') {
            settotalNumberOfOrders(restaurant_by_order_list.length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list.reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/processing'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Preparing').reverse())
            settotalNumberOfOrders(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Preparing').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Preparing').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/Prepared'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Prepared').reverse())
            settotalNumberOfOrders(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Prepared').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Prepared').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/completed'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Completed').reverse())
            settotalNumberOfOrders(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Completed').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Completed').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/cancelled'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Cancelled').reverse())
            settotalNumberOfOrders(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Cancelled').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list.filter((a:any)=>a.order_status.title === 'Cancelled').reverse(), pageLength, currentPage))
          }
        }else if(userDetails?.user.admin_type === 'SUPER'){
          if(pathname === '/admin/orders/all') {
            settotalNumberOfOrders(response.data.data.length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(response.data.data.reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/processing'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Preparing').reverse())
            settotalNumberOfOrders(response.data.data.filter((a:any)=>a.order_status.title === 'Preparing').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(response.data.data.filter((a:any)=>a.order_status.title === 'Preparing').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/Prepared'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Prepared').reverse())
            settotalNumberOfOrders(response.data.data.filter((a:any)=>a.order_status.title === 'Prepared').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(response.data.data.filter((a:any)=>a.order_status.title === 'Prepared').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/completed'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Completed').reverse())
            settotalNumberOfOrders(response.data.data.filter((a:any)=>a.order_status.title === 'Completed').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(response.data.data.filter((a:any)=>a.order_status.title === 'Completed').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/cancelled'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Cancelled').reverse())
            settotalNumberOfOrders(response.data.data.filter((a:any)=>a.order_status.title === 'Cancelled').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(response.data.data.filter((a:any)=>a.order_status.title === 'Cancelled').reverse(), pageLength, currentPage))
          }
        }else if(userDetails?.user.admin_type === 'CHEF'){
          let restaurant_by_order_list_and_chef = response.data.data.filter((a:any)=>a.restaurant._id === userDetails?.user.restaurant._id).filter((b:any)=>b?.chef?._id === userDetails?.user._id)
          if(pathname === '/admin/orders/all') {
            settotalNumberOfOrders(restaurant_by_order_list_and_chef.length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list_and_chef.reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/processing'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Preparing').reverse())
            settotalNumberOfOrders(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Preparing').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Preparing').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/Prepared'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Prepared').reverse())
            settotalNumberOfOrders(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Prepared').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Prepared').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/completed'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Completed').reverse())
            settotalNumberOfOrders(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Completed').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Completed').reverse(), pageLength, currentPage))
          }else if(pathname === '/admin/orders/cancelled'){
            // setorderList(response.data.data.filter((a:any)=>a.order_status.title === 'Cancelled').reverse())
            settotalNumberOfOrders(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Cancelled').length)
            const paginate = (array:any,page_size:any,page_number:any) =>{
              return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            setorderList(paginate(restaurant_by_order_list_and_chef.filter((a:any)=>a.order_status.title === 'Cancelled').reverse(), pageLength, currentPage))
          }
        }
      }else{

      }
    })
    .catch(function (error:any) {
      console.log(error);
      setloading(false)
    });
  }

  // This function is used for fetching orders in a paginated format.
  const fetchOrderList = async (pageNumber: number, pageLimit: number = 10) => {
    try {
      let url: any = BASE_URL + PATH.PAGINATED_LIST_OF_ORDERS + `?page=${pageNumber}&limit=${pageLimit}`;
      let body: any = {search: searchValue};

      if (userDetails?.user?.admin_type !== 'SUPER') {
        body.restaurant = userDetails?.user?.restaurant?._id;
      }

      setloading(true);

      const {data: orderData} = await axios.post(url, body);
      let filteredOrders = orderData?.data;

      if (userDetails?.user.admin_type === 'CHEF') {
        filteredOrders = filteredOrders.filter((b:any)=>b?.chef?._id === userDetails?.user._id)
      }

      if (pathname === '/admin/orders/processing') {
        filteredOrders = filteredOrders.filter((a:any)=>a.order_status.title === 'Preparing');
      } else if (pathname === '/admin/orders/Prepared') {
        filteredOrders = filteredOrders.filter((a:any)=>a.order_status.title === 'Prepared');
      } else if (pathname === '/admin/orders/completed') {
        filteredOrders = filteredOrders.filter((a:any)=>a.order_status.title === 'Completed');
      } else if (pathname === '/admin/orders/Cancelled') {
        filteredOrders = filteredOrders.filter((a:any)=>a.order_status.title === 'Completed');
      }

      settotalNumberOfOrders(orderData?.total || 0);
      setorderList(filteredOrders);
    } catch (error) {
        console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    // _order_list();
    fetchOrderList(currentPage - 1, pageLength);
  }, [pathname,currentPage])

  const _onClickSearch = ()=>{
    // _order_list()
    if (!loading) fetchOrderList(currentPage - 1, pageLength);
  }

  const _onClickRefresh = ()=>{
    setsearchValue('');
    // _order_list()
    if (!loading) fetchOrderList(currentPage - 1, pageLength);
  }
  
  return (
    <StyledTableContainer>
    <ThemeProvider theme={theme}>
    <Grid item lg={12} container style={{backgroundColor:_.colors.colorWhite,paddingLeft:10,paddingRight:10,paddingBottom:10}}>
    <Grid style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold'}} component="div">All Orders </Typography>
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold',backgroundColor:_.colors.colorOrangeDisable,padding:10,borderRadius:10,marginLeft:10}} component="div">{totalNumberOfOrders}</Typography>
    </Grid>
    <Grid lg={12} sm={12} md={12} xs={12} style={{width: '100%', padding:10,marginBottom:'10%'}}>
        <TableContainer sx={{display:'contents',alignItems:'center',}} component={Paper}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end',marginBottom:2 }}>
            <Box sx={{marginBottom:0.5,marginRight:1.5}}>
                <BsSearch color={_.colors.colorDarkGray} size={20}/>
            </Box>
            <TextField sx={{width:'30%'}} value={searchValue} onChange={(prop)=>setsearchValue(prop.target.value)}  label="Search" variant="standard" />
            <Button onClick={()=>_onClickSearch()} sx={{backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginBottom:0.5,marginLeft:2}} size='small' variant="contained">Search</Button>
            <Box sx={{display:'flex',width:'70%',alignItems:'center',justifyContent:'flex-end'}}>
                <Button onClick={()=>_onClickRefresh()} sx={{backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginBottom:0.5,marginLeft:2}} size='small' variant="contained">Refresh</Button>
                <Button 
                onClick={()=>{
                    navigation('/admin/orders/add-new-order')
                }}
                sx={{backgroundColor:'#FF9A03',":hover":{backgroundColor:'#E18701'},marginBottom:0.5,marginLeft:2}} size='small' variant="contained">{mediaQueryMatch ? 'Add new Order' : 'New'}</Button>
                {/* <Button variant="outlined" 
                    color={'primary'}
                    sx={{marginLeft:2,marginRight:1}}
                    startIcon={<AiOutlineDownload color={_.colors.colorDarkGray} size={20}/>}
                    endIcon={<GoTriangleDown color={_.colors.colorDarkGray} size={14}/>}>Export</Button>
                <Button variant="outlined" 
                    color={'primary'}
                    sx={{marginLeft:1}}
                    startIcon={<BsFilter color={_.colors.colorDarkGray} size={20}/>}>Filter</Button> */}
            </Box>
        </Box>

        {false?
        <Box sx={{width:'900px'}}>
          <Empty/>
        </Box>
        :
        <Box sx={{ width: '100%', overflow: {xs: 'auto'}}}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor:'#F0F0F0'}}>
              <TableCell style={{color:_.colors.colorBlack}}>S/N</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Order id</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}> Date & time</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>User Name</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Restaurant</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Payment</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Table</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Waiter</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Chef</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Order Status</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Total</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList.map((item:any,index:any) => {
              return(
                <TableRow
                sx={{backgroundColor:_.colors.colorWhite,borderBottomColor:_.colors.colorLightGray,borderBottomWidth:'1px'}}
                key={item?._id}>
                  <TableCell>{index+1*currentPage*pageLength-9}</TableCell>
                  <TableCell align='center' sx={{padding:1}} style={{color:_.colors.colorFacebook}}>{item?.order_id}</TableCell>
                  <TableCell align='center' sx={{padding:1}}>{moment(item?.order_date_and_time).format('D MMMM YYYY, h:mm:ss a')}</TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<UserNameView item={item}/>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<Typography variant="caption" sx={{fontSize:15,color:_.colors.colorBlack}} component="div">{item?.restaurant?.restaurant_name}</Typography>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<PaymentStatusView item={item}/>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}><Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">{item?.table?.table_no}</Typography></TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<WaiterView item={item} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<ChefView item={item} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}>{<OrderStatusView item={item}/>}</TableCell>
                  <TableCell align="center" sx={{padding:1}}><Typography variant='caption' sx={{minWidth:'80px',fontSize:14,color:_.colors.colorBlack}} component="div">₹{item.total.toLocaleString()}</Typography></TableCell>
                  <TableCell align="center" sx={{padding:1}}><ActionView item={item} setloading={setloading} setopenSnackbar={setopenSnackbar} openSnackbar={openSnackbar} _order_list={_order_list}/></TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table></Box>}
        {totalNumberOfOrders !== 0 && <Pagination page={currentPage} onChange={(event: React.ChangeEvent<unknown>, page: number)=>{setcurrentPage(page)}} count={Math.ceil(totalNumberOfOrders/pageLength)} sx={{marginTop:3}} />}
        </TableContainer>
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
    </ThemeProvider>
    </StyledTableContainer>
  );
}
