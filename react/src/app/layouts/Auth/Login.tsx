import { Alert, Backdrop, Button, Checkbox, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import _ from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, PATH } from "../../api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    secondary: {
      main: _.colors.colorOrange,
      contrastText:_.colors.colorWhite
    }
  }
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Login() {
  const navigation = useNavigate()
  const {pathname} = useLocation();
  const [email, setemail] = useState <any>('')
  const [password, setpassword] = useState<any>('')
  const [loading, setloading] = useState(true)
  const token = localStorage.getItem('@TOKEN');

  useEffect(() => {
    setloading(false)
    token&&navigation('/admin/dashboard')
  },[])
  

  const [passwordToggle, setpasswordToggle] = useState<any>(false);
  const handleClickShowPassword = () => {
    setpasswordToggle(!passwordToggle);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
}, [pathname]);

  const _loginClick = ()=>{
    if(email.length === 0 || password.length === 0){
      setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
    }else{
      setloading(true)
      var axios = require('axios');
      var qs = require('qs');
      var data = qs.stringify({
        'email': email,
        'password':password
      });
      var config = {
        method: 'post',
        url: BASE_URL+PATH.LOGIN,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };

      axios(config)
      .then(function (response:any) {
        console.log(JSON.stringify(response.data));
        if(response.data.status && response.data.data.active_inactive === true){
          setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,vertical:'bottom',horizontal:'left',type:'success'});
          localStorage.setItem('@TOKEN',response.data.token)
          if(response.data.data.admin_type === 'SUPER' || response.data.data.admin_type === 'MANAGER'){
            setTimeout(() => {
              navigation('/admin/dashboard')
              setloading(false)
            }, 500);
          }else{
            setTimeout(() => {
              navigation('/admin/orders/all')
              setloading(false)
            }, 500);
          }
        }else{
          setOpenSnackbar({ ...openSnackbar, open: true,message:'Login Failed ! Please contact to admin.',type:'error' });
          setloading(false)
        }
      })
      .catch(function (error:any) {
        console.log(error);
        setloading(false)
      });
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Grid item lg={12} container style={{height:'100%',width:'100%',position: 'fixed',display:'flex',backgroundColor:_.colors.colorWhite}}>
        <Grid item lg={7} xs={0} display={{ xs: "none", lg:'block' }}>
          <div style={{position:'relative',overflow:'hidden'}}>
            <img src={_.images.login_bg} style={{height:"100%",width:"pixels",maxHeight:'120%',maxWidth:'146%',alignSelf: 'center'}}/> 
          </div>
        </Grid>
        <Grid item lg={5} xs={12} container style={{justifyContent:'center'}}>
          <div style={{height:'100%',width:'100%',backgroundColor:_.colors.colorWhite,textAlign:'center',justifyContent:'center',paddingTop:'16%'}}>
            <img src={_.images.bohfy_logo} style={{height:52}}/> 
            <Typography variant='h5' gutterBottom  style={{marginTop:'4%'}}>Welcome Back,<br/>Sign In to Continue!</Typography>
            <br/>
            <div style={{display:'block',textAlign:'center',alignItems:'center',justifyContent:'center'}}>
              <TextField
                value={email}
                onChange={(prop)=>setemail(prop.target.value)}
                sx={{width:'70%',marginTop:2}}
                color={'secondary'}
                size="small"
                id="outlined-required"
                label="Email"
              />
              <br/>
              <FormControl sx={{ m: 1,width:'70%',marginTop:2}} size='small'
                color={'secondary'} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                id="outlined-adornment-password"
                  type={passwordToggle ? 'text' : 'password'}
                  value={password}
                  onChange={(prop)=>setpassword(prop.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {passwordToggle ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <br/>
              <div style={{width:'70%',display:'flex',flexDirection:'row',justifyContent:'space-between',textAlign:'center',alignItems:'center',marginLeft:'auto',marginRight:'auto',marginTop:2}}>
                <div style={{display:'flex',flexDirection:'row',textAlign:'center',alignItems:'center'}}>
                <Checkbox {...label} style={{color:_.colors.colorOrange,marginLeft:-10}} defaultChecked />
                <a style={{cursor:'pointer',color:_.colors.colorBlack,fontSize: '14px',fontWeight:'normal'}} target="_self" data-uia="login-help-link">Remember Me</a>
                </div>
              </div>
            </div>
            <br/>
            <Button 
            onClick={_loginClick}
            color={'secondary'}
            sx={{width:'70%',marginTop:2}}
            variant="contained">Sign In</Button> 
          </div>
          <Typography variant='subtitle2' gutterBottom  style={{display:'flex',position:'absolute',bottom:10}}>COPYRIGHT© 2022 ALL RIGHTS RESERVED. BOHFY</Typography>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
          <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar anchorOrigin={{vertical,horizontal}} open={open} autoHideDuration={3000} onClose={snackbarClose} key={vertical + horizontal}>
        <Alert onClose={snackbarClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {/* </div> */}
    </ThemeProvider>
  );
}

export default Login;
