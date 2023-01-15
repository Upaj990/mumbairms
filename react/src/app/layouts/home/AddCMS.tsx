import { Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from '../../config';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { BASE_URL, PATH } from '../../api';

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

function AddCMS() {
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
    const [cmsTypeList, setcmsTypeList] = useState([])
    const [cmsType, setcmsType] = useState<any>(null)
    const [cmsContent, setcmsContent] = useState(EditorState.createEmpty())
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    const _editData =()=>{
        setcmsType(state?.data?.cms_type)
        const blocksFromHTML = convertFromHTML(state?.data?.content);
        const htmlToEditor = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );
        setcmsContent(EditorState.createWithContent(htmlToEditor))
    }
    useEffect(() => {
       state&&_editData() 
    }, [])

    const onEditorStateChange = (editorState:any) => {
        setcmsContent(editorState)
    };
    
    const _list_of_CMSType = ()=>{
        setloading(true)
        var axios = require('axios');
        var config = {
        method: 'post',
        url: BASE_URL+PATH.LIST_OF_CMS_TYPE,
        headers: { }
        };

        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            setloading(false)
            if(response.data.status){
                setcmsTypeList(response.data.data)
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    useEffect(() => {
        _list_of_CMSType()
    }, [])

    const _addCMS = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'cms_type':cmsType._id,
        'content': draftToHtml(convertToRaw(cmsContent.getCurrentContent()))
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.ADD_CMS,
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
                navigation('/admin/cms/list-of-cms') 
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _updateCMS =()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'id': state?.data?._id,
            'cms_type':cmsType._id,
            'content': draftToHtml(convertToRaw(cmsContent.getCurrentContent()))
        });
        var config = {
            method: 'post',
            url: BASE_URL+PATH.UPDATE_CMS,
            headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        
        axios(config)
        .then(function (response:any) {
            setloading(false)
            if(response.data.status){
                setOpenSnackbar({ ...openSnackbar, open: true,message:'update CMS successful !',type:'success' });
                navigation('/admin/cms/list-of-cms') 
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        }); 
    }

    const _clickSubmit = ()=>{
        if(!cmsType){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'CMS Type are required.',type:'error' }); 
        }else if(draftToHtml(convertToRaw(cmsContent.getCurrentContent())).length-8 === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Page Content are required.',type:'error' }); 
        }else if(draftToHtml(convertToRaw(cmsContent.getCurrentContent())).length-8 < 50){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Required, add content Minimum lenght 50 characters.',type:'error' }); 
        }else{
            state?_updateCMS():_addCMS()
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>cms</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'edit-cms':'add-cms'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit CMS':'Add CMS'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">CMS type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                options={cmsTypeList}
                                defaultValue={state?.data?.cms_type}
                                disabled={state}
                                getOptionLabel={(option:any) => option.name}
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setcmsType(values)
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
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'start',marginTop:3,}}>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Page Content</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box border={1} sx={{minHeight:'400px',width:'90%',maxWidth:'100%',padding:2,borderColor:_.colors.colorGray,borderRadius:2,marginTop:2}}>
                            <Editor
                            editorState={cmsContent}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={onEditorStateChange}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/cms/list-of-cms') } sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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

export default AddCMS;