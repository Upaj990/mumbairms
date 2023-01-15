import { Box, Button, Checkbox, Divider, FormControlLabel, useMediaQuery, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
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

const currencies = [
    {
      value: 'ONE',
      label: 'One'
    },
    {
      value: 'TWO',
      label: 'Two',
    },
    {
      value:'THREE',
      label: 'Three',
    },
    {
      value:'FOUR',
      label: 'Four',
    },
];
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Notification() {
    const mediaQuery = useMediaQuery('(min-width:600px)');
    const navigation = useNavigate()
    const [currency, setCurrency] = React.useState('Title 1');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };
    const [selectedValue, setSelectedValue] = useState(false);
    console.log(selectedValue,'selectedValue')

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    {/* <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Table</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/> */}
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Notification</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">Notification</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Title</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:{xs: '50%', sm: '40%'},display:'flex',flexDirection:'row',marginLeft:{xs: 20, sm: 28}}}>
                            <TextField id="outlined-basic" color='secondary' size='small' label="Enter title" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Send to</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:{xs: '50%', sm: '40%'},display:'flex',flexDirection:'row',marginLeft:{xs: 20, sm: 28}}}>
                                <TextField sx={{width:'100%'}} id="outlined-select-currency" select size='small' color='secondary' label="Select users" value={currency} onChange={handleChange}>
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Table */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Description</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:{xs: '50%', sm: '40%'},display:'flex',flexDirection:'row',marginLeft:{xs: 20, sm: 28}}}>
                            <TextField id="outlined-basic"  multiline rows={4} color='secondary' size='small' label="Enter description" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Image</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:{xs: '50%', sm: '40%'},display:'flex',flexDirection:'column',marginLeft:{xs: 20, sm: 28}}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                    <TextField sx={{width:'100%'}} size={'small'}  disabled defaultValue="Choose file" />
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} size='medium' variant="contained">Choose</Button>
                                </Box>
                                <Box sx={{marginTop:2}}>
                                    <img src={'https://stackfood-admin.6amtech.com/public/assets/admin/img/900x400/img1.jpg'}
                                    style={{height:'240px',width: mediaQuery ? '450px': '140px',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button sx={{backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none'}} size='medium' variant="contained">Send Notification</Button>
                    <Button sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},textTransform:'none',marginLeft:2}} size='medium' variant="contained">Cancel</Button>
                </Box>
            </Grid>
        </Box>
        </ThemeProvider>
    );
}

export default Notification;