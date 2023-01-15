import * as React from 'react';
import { Alert, AppBar, Backdrop, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Snackbar, Step, StepButton, Stepper, Switch, SwitchProps, Table, TableBody, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useRef, useState } from "react";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { TableCell } from '@mui/material';
import _ from "../../config";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { FcDownload } from 'react-icons/fc';
import { BsColumns, BsFilter, BsSearch } from 'react-icons/bs';
import { styled } from '@mui/system';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import Stack from '@mui/material/Stack';
import ButtonUnstyled, {
  buttonUnstyledClasses,
  ButtonUnstyledProps,
} from '@mui/base/ButtonUnstyled';
import { GoEye, GoPencil, GoPrimitiveDot, GoTriangleDown } from 'react-icons/go';
import { AiOutlineDownload } from 'react-icons/ai';
import { IoFilterSharp } from 'react-icons/io5';
import { withStyles } from '@mui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDeleteSweep } from 'react-icons/md';
import { FiDownload } from 'react-icons/fi';
import { BASE_URL, FILE_PATH, PATH } from '../../api';
import { Empty } from '../../components';

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
      main: _.colors.colorGray,
      contrastText:_.colors.colorWhite
    }
  }
});

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : _.colors.colorOrange,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : _.colors.colorOrange,
      opacity: 1,
    },
  }));
  const ActiveInactive = (props:any)=>{
    const {item,setloading,setOpenSnackbar,openSnackbar,_list_of_table} = props;

    const _updateMenuTable =()=>{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        'id': item._id,
        'active_inactive': !item.active_inactive
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
          _list_of_table()
          !item.active_inactive&&setOpenSnackbar({ ...openSnackbar, open: true,message:`Active now !`,type:'success'});
          item.active_inactive&&setOpenSnackbar({ ...openSnackbar, open: true,message:`Inactive !`,type:'error'}); 
        }else{
          setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
        }
      })
      .catch(function (error:any) {
        setloading(false)
        console.log(error);
      });
    }
      return(
        <Box style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <IOSSwitch sx={{ m: 1 }} defaultChecked={item?.active_inactive} onChange={_updateMenuTable} />
        </Box>
      )
  }

  const ActionView = (props:any)=>{
    const navigation = useNavigate()
    const {item,setdialog, setidForDelete} = props;
    const {userDetails} = useSelector((state:RootState) => state);
    return(
        <Box style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <a download={`${item._id}.png`} href={item.qr_code}><Button variant="outlined" color={'primary'} size="small" startIcon={<FiDownload color={_.colors.colorSubTitle} style={{marginRight:-8,marginTop:2,marginBottom:2}} size={16}/>}/></a>
            <Button onClick={()=>navigation('/admin/table/add-table',{ state: {TAG:'EDIT',data:item}})} sx={{marginLeft:1}} variant="outlined" color={'primary'} size="small" startIcon={<GoPencil color={_.colors.colorSubTitle} style={{marginRight:-8,marginTop:2,marginBottom:2}} size={16}/>}/>
              {//userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHIEF'&&
              <Button 
              onClick={()=>{
                setdialog(true)
                setidForDelete(item)
              }} 
              sx={{marginLeft:1}} variant="outlined" color={'primary'} size="small" startIcon={<MdDeleteSweep color={_.colors.colorSubTitle} style={{marginRight:-8,marginTop:2,marginBottom:2}} size={16}/>
            }
            />}
        </Box>
    )
  }

  const RestaurantLogo = (props:any)=>{
    const {item} = props;
    return(
      <Box sx={{}}>
        <img src={item.qr_code} 
        style={{height:'100px',width:'100px',objectFit:'contain'}}/>
      </Box>
    )
  }

export default function TableList() {
  const navigation = useNavigate()
  const {pathname} = useLocation();
  const [tableList, settableList] = useState([])
  const [loading, setloading] = useState(false)
  const [dialog, setdialog] = useState<any>(false)
  const [idForDelete, setidForDelete] = useState<any>(null)
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

  const {userDetails} = useSelector((state:RootState) => state);
  const [searchValue, setsearchValue] = useState('')
  const [totalNumberOfTables, settotalNumberOfTables] = useState(0)
  const [currentPage, setcurrentPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0);
}, [pathname]);

  const pageLength = 10
  const _list_of_table = ()=>{
    setloading(true)
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      search:searchValue
    });
    var config = {
      method: 'post',
      url: BASE_URL+PATH.LIST_OF_TABLE,
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
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
          settotalNumberOfTables(response.data.data.filter((a:any)=>a?.restaurant?._id === userDetails?.user.restaurant._id).length)
          const paginate = (array:any,page_size:any,page_number:any) =>{
            return array.slice((page_number - 1) * page_size, page_number * page_size);
          }
          settableList(paginate(response.data.data.filter((a:any)=>a?.restaurant?._id === userDetails?.user.restaurant._id).reverse(), pageLength, currentPage))
        }else{
          settotalNumberOfTables(response.data.data.length)
          const paginate = (array:any,page_size:any,page_number:any) =>{
            return array.slice((page_number - 1) * page_size, page_number * page_size);
          }
          settableList(paginate(response.data.data.reverse(), pageLength, currentPage))
        }
      }
    })
    .catch(function (error:any) {
      console.log(error);
      setloading(false)
    });
  }

  useEffect(() => {
    _list_of_table()
  }, [searchValue,currentPage])

  const _onClickSearch = ()=>{
    _list_of_table()
  }

  const _deleteTable = ()=>{
    setloading(true)
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      '_id': idForDelete? idForDelete._id:null
    });
    var config = {
      method: 'post',
      url: BASE_URL+PATH.DELETE_TABLE,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    axios(config)
    .then(function (response:any) {
      setloading(false)
      console.log(JSON.stringify(response.data));
      setdialog(false)
      setidForDelete(null)
      if(response.data.status){
        setOpenSnackbar({ ...openSnackbar, open: true,message:'Delete table successful !',type:'success' });
        _list_of_table()
      }else{
        setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' });
      }
    })
    .catch(function (error:any) {
      setloading(false)
      console.log(error);
    });
  }
  return (
    <StyledTableContainer>
    <ThemeProvider theme={theme}>
    <Grid item lg={12} container style={{backgroundColor:_.colors.colorWhite,paddingLeft:10,paddingRight:10,paddingBottom:10}}>
    <Grid style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold'}} component="div">Table List</Typography>
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold',backgroundColor:_.colors.colorOrangeDisable,padding:10,borderRadius:10,marginLeft:10}} component="div">{totalNumberOfTables}</Typography>
    </Grid>
    <Grid lg={12} sm={12} md={12} xs={12} style={{padding:10,marginBottom:'10%'}}>
        <TableContainer sx={{display:'contents',alignItems:'center',}} component={Paper}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end',marginBottom:2 }}>
            <Box sx={{marginBottom:0.5,marginRight:1.5}}>
                <BsSearch color={_.colors.colorDarkGray} size={20}/>
            </Box>
            <TextField sx={{width:'30%'}} value={searchValue} onChange={(prop)=>setsearchValue(prop.target.value)} label="Search" variant="standard" />
            <Button onClick={()=>_onClickSearch()} sx={{backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginBottom:0.5,marginLeft:2}} size='small' variant="contained">Search</Button>
            <Box sx={{display:'flex',width:'70%',alignItems:'center',justifyContent:'flex-end'}}>
                <Button onClick={()=>navigation('/admin/table/add-table')} sx={{backgroundColor:'#FF9A03',":hover":{backgroundColor:'#E18701'},marginBottom:0.5,marginRight:2}} size='small' variant="contained">Add New Table</Button>
            </Box>
        </Box>
        {totalNumberOfTables === 0?
          <Box sx={{width:'900px'}}>
            <Empty/>
          </Box>
        :<Box sx={{overflowX: 'auto', width: '100%'}}><Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor:'#F0F0F0'}}>
              <TableCell style={{color:_.colors.colorBlack}}>S/N</TableCell>
              {/* <TableCell align="center" style={{color:_.colors.colorBlack}}>LOGO</TableCell> */}
              <TableCell align="center" style={{color:_.colors.colorBlack}}>RESTURANTS NAME</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>QR CODE</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>{'TABLE NO.'}</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>CAPACITY (PEOPLE)</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>ACTIVE/INACTIVE</TableCell>
              <TableCell align="center" style={{color:_.colors.colorBlack}}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableList.map((item:any,index:any) => (
              <TableRow
                sx={{backgroundColor:_.colors.colorWhite,borderBottomColor:_.colors.colorLightGray,borderBottomWidth:'1px',}} key={index}>
                <TableCell>{index+1*currentPage*pageLength-9}</TableCell>
                <TableCell align="center"><Typography variant="h2" sx={{maxWidth:'200px',textAlign:'center',fontSize:14,color:_.colors.colorTitle,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.restaurant.restaurant_name}</Typography></TableCell>
                <TableCell align="center"><RestaurantLogo item={item}/></TableCell>
                <TableCell align='center'>{item.table_no}</TableCell>
                <TableCell align='center'>{item.capacity_people}</TableCell>
                <TableCell align="center" >{<ActiveInactive item={item} setloading={setloading} setOpenSnackbar={setOpenSnackbar} openSnackbar={openSnackbar} _list_of_table={_list_of_table}/>}</TableCell>
                <TableCell align="center">{<ActionView item={item} setdialog={setdialog} setidForDelete={setidForDelete}/>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></Box>}
        {totalNumberOfTables !== 0 && <Pagination page={currentPage} onChange={(event: React.ChangeEvent<unknown>, page: number)=>{setcurrentPage(page)}} count={Math.ceil(totalNumberOfTables/pageLength)} sx={{marginTop:3}} />}
        </TableContainer>
      </Grid>
    </Grid>
    <Snackbar anchorOrigin={{vertical,horizontal}} open={open} autoHideDuration={3000} onClose={snackbarClose} key={vertical + horizontal}>
      <Alert onClose={snackbarClose} severity={type} sx={{ width: '100%' }}>{message}</Alert>
    </Snackbar>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
      //onClick={handleClose}
      >
      <CircularProgress color='inherit' />
    </Backdrop>
    <Dialog
    open={dialog}
    onClose={()=>setdialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {"Delete Menu"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={()=>setdialog(false)}>No</Button>
        <Button color={'secondary'} onClick={()=>{
          idForDelete&&_deleteTable()
        }} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
    </ThemeProvider>
    </StyledTableContainer>
  );
}
