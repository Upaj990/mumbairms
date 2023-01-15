import * as React from 'react';
import { Alert, AppBar, Backdrop, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Pagination, Snackbar, Step, StepButton, Stepper, Switch, SwitchProps, Table, TableBody, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useRef, useState } from "react";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { TableCell } from '@mui/material';
import _ from "../../config";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { FcDownload } from 'react-icons/fc';
import { BsCalendarEvent, BsColumns, BsFilter, BsSearch } from 'react-icons/bs';
import { styled } from '@mui/system';
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
import { BASE_URL, PATH } from '../../api';

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

  const ActionView = (props:any)=>{
    const navigation = useNavigate()
    const {item} = props;
    return(
      <Box style={{display:'flex',alignItems:'center',justifyContent:'flex-start'}}>
        <Button onClick={()=>navigation('/admin/cms/add-cms',{ state: {TAG:'EDIT',data:item} })} variant="outlined" color={'primary'} size="small" startIcon={<GoPencil color={_.colors.colorSubTitle} style={{marginRight:-8,marginTop:2,marginBottom:2}} size={16}/>}/>
      </Box>
    )
  }


export default function ListOfCMS() {
  const navigation = useNavigate()
  const {pathname} = useLocation();
  const [CMSList, setCMSList] = useState([])
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

  useEffect(() => {
    window.scrollTo(0, 0);
}, [pathname]);

  const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const _list_of_cms = ()=>{
    setloading(true)
    var axios = require('axios');

    var config = {
      method: 'post',
      url: BASE_URL+PATH.LIST_OF_CMS,
      headers: { }
    };

    axios(config)
    .then(function (response:any) {
      console.log(JSON.stringify(response.data));
      setloading(false)
      if(response.data.status){
        setCMSList(response.data.data)
      }
    })
    .catch(function (error:any) {
      console.log(error);
      setloading(false)
    });
  }
  useEffect(() => {
    _list_of_cms()
  }, [])

  const _deleteCMS = ()=>{
    setloading(true)
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      '_id': idForDelete? idForDelete._id:null
    });
    var config = {
      method: 'post',
      url: BASE_URL+PATH.DELETE_CMS,
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
        setOpenSnackbar({ ...openSnackbar, open: true,message:'Delete CMS successful !',type:'success' });
        _list_of_cms()
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
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold'}} component="div">CMS List</Typography>
        <Typography variant="h1" style={{fontSize:20,color:_.colors.colorBlack,fontWeight:'bold',backgroundColor:_.colors.colorOrangeDisable,padding:10,borderRadius:10,marginLeft:10}} component="div">{CMSList.length}</Typography>
    </Grid>
    <Grid lg={12} sm={12} md={12} xs={12} style={{padding:0,marginBottom:'10%',marginTop:15}}>
        <TableContainer sx={{display:'contents',alignItems:'center',}} component={Paper}>
        <Box sx={{overflowX: 'auto', width: '100%'}}><Table sx={{minWidth:'980px'}} aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor:'#F0F0F0'}}>
              <TableCell style={{color:_.colors.colorBlack}}>S/N</TableCell>
              <TableCell align="left" style={{color:_.colors.colorBlack}}>CMS TYPE</TableCell>
              <TableCell align="left" style={{color:_.colors.colorBlack}}>PAGE CONTENT</TableCell>
              {/* <TableCell align="center" style={{color:_.colors.colorBlack}}>ACTIVE/INACTIVE</TableCell> */}
              <TableCell align="left" style={{color:_.colors.colorBlack}}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CMSList.map((item:any,index:any) => (
              <TableRow
                sx={{backgroundColor:_.colors.colorWhite,borderBottomColor:_.colors.colorLightGray,borderBottomWidth:'1px',}} key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell align="left"><Typography variant="h2" sx={{marginLeft:1,maxWidth:'200px',textAlign:'start',fontSize:14,color:_.colors.colorTitle,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.cms_type.name}</Typography></TableCell>
                <TableCell sx={{paddingLeft:0,paddingRight:0}} align="left"><Typography variant="h2" sx={{maxWidth:'420px',textAlign:'left',fontSize:14,color:_.colors.colorTitle,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:4}} component="div" dangerouslySetInnerHTML={{
                  __html: item.content
                }}></Typography></TableCell>
                <TableCell align="center">{<ActionView item={item} setdialog={setdialog} setidForDelete={setidForDelete}/>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>
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
        {"Delete Restaurant"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={()=>setdialog(false)}>No</Button>
        <Button color={'secondary'} onClick={()=>{
          idForDelete&&_deleteCMS()
        }} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
    </ThemeProvider>
    </StyledTableContainer>
  );
}