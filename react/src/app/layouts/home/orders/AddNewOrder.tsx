import { Alert, Autocomplete, Backdrop, Box, Button, Card, Checkbox, CircularProgress, Container, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Paper, Radio, RadioGroup, Snackbar, TextField, Typography, useMediaQuery } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { BiFoodTag, BiMinus, BiPlus } from 'react-icons/bi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MdCancel } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { CgFormatSlash } from 'react-icons/cg';
import { FaStarOfLife } from 'react-icons/fa';
import type { RootState } from '../../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoMdAddCircleOutline,IoMdClose } from 'react-icons/io';
import _ from '../../../config';
import { BASE_URL, PATH } from '../../../api';
import { v4 as uuid } from 'uuid';
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

const CategoryView = (props:any)=>{
    const mediaQuery = useMediaQuery('(min-width:600px)')
    const {item,categoryIndex,selectCategory,setselectCategory,selectCategoryHover, setselectCategoryHover} = props;
    return(<>
        {[...item.slice(categoryIndex, categoryIndex + (mediaQuery ? 7 : 2))].map((item:any,index:any)=>{
            return <Button
            key={index} 
            onMouseOver={()=>{
                setselectCategoryHover({id:item._id,isHover:true}) 
            }}  
            onMouseOut={()=>{
                setselectCategoryHover({id:item._id,isHover:false}) 
            }}
            onClick={()=>{
                setselectCategory(item.category)
            }}
            endIcon={selectCategory?._id === item.category._id&&<IoIosArrowDown color={_.colors.colorWhite} size={16}/>}
            sx={{backgroundColor:selectCategory?._id === item.category._id?_.colors.colorOrange:_.colors.colorOrangeDisable,borderWidth:0,":hover":{backgroundColor:selectCategoryHover.isHover&&selectCategoryHover.id === item.category._id&&selectCategory._id === item.category._id?_.colors.colorOrangeDisable:_.colors.colorOrange,color:selectCategoryHover.isHover&&selectCategoryHover.id === item.category._id&&selectCategory._id === item.category._id?_.colors.colorOrange:_.colors.colorOrangeDisable,borderWidth:0},fontWeight:'bold',textTransform:'none',borderRadius:2,paddingTop:1,paddingBottom:1,paddingLeft:selectCategory?._id === item.category._id?3:4,paddingRight:selectCategory?._id === item.category._id?3:4,marginLeft:1,color:selectCategory?._id === item.category._id?_.colors.colorOrangeDisable:_.colors.colorOrange}} disableElevation size='small' variant='outlined'>{item.category.name}</Button>
        })}
        </>
    )
}

const MenuItemsView = (props:any)=>{
    const {item,onHover,setonHover,_menuItemClick,selectedMenuItems,restaurant} = props;
    return(
        item.map((item:any,index:any)=>{
            return(
                <Button 
                    key={index} 
                    onMouseOver={()=>{
                        setonHover({id:index,isHover:true}) 
                    }}  
                    onMouseOut={()=>{
                        setonHover({id:index,isHover:false}) 
                    }} 
                    onClick={()=>{
                        _menuItemClick(item)
                    }}
                    sx={{height:'90px',width:'180px',backgroundColor:selectedMenuItems.find((a:any)=>a._id === item._id) && item.addons_categories.length === 0 ?_.colors.colorOrange:_.colors.colorOrangeDisable,"&:hover":{backgroundColor:"rgb(230, 92, 0)"},display:'flex',flexDirection:'column',alignItems:'center',padding:1,borderRadius:3,margin:1}}>
                    {onHover.isHover && onHover.id === index && !selectedMenuItems.find((a:any)=>a._id === item._id && a.addons_categories.length === 0)?
                    <Box sx={{display:'flex'}}>
                        <IoMdAddCircleOutline color={_.colors.colorWhite} size={32}/>
                    </Box>
                    :
                    <>
                    <Box sx={{width:'100%',display:'flex'}}>
                        <BiFoodTag color={item.food_type === 'veg'?'#08A117':_.colors.colorRed} style={{position:'absolute'}} size={20}/>
                        <Typography variant="h6" sx={{width:'100%',fontSize:14,textAlign:'center',color:selectedMenuItems.find((a:any)=>a._id === item._id) && item.addons_categories.length === 0?_.colors.colorOrangeDisable:_.colors.colorOrange,fontWeight:'bold',display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',lineHeight:1,WebkitLineClamp:2,marginLeft:1,paddingLeft:2,paddingRight:2}} component="div">{item.menu_name}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{fontSize:16,fontWeight:'normal',textAlign:'center',color:selectedMenuItems.find((a:any)=>a._id === item._id) && item.addons_categories.length === 0?_.colors.colorOrangeDisable:_.colors.colorOrange}} component="div">₹{item.price.toFixed(2)}</Typography>
                    {item.addons_categories.length === 0 && <Box sx={{marginTop:2}}/>}
                    <Typography variant="h6" sx={{fontSize:8,textAlign:'center',fontWeight:'bold',color:selectedMenuItems.find((a:any)=>a._id === item._id) && item.addons_categories.length === 0?_.colors.colorOrangeDisable:_.colors.colorOrange,marginTop:1}} component="div">{item.addons_categories.length === 0 ? '':'customizable'}</Typography>
                    </>}
                </Button>
            )
        })
    )
}

const SelectAddonsValuesView = (props:any) => {
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
        <>
        {<Box sx={{display:'flex',flexDirection:'row',flexWrap:'wrap',marginTop:index===0?1:0,marginBottom:.6}}>
            <Box sx={{width:'56%',display:'flex',flexDirection:'row',marginRight:1}}>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                    <Box sx={{width:34,backgroundColor:_.colors.colorTransparent,borderRadius:100,marginRight:1}}/>
                    <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}>
                        <Typography variant="subtitle1" sx={{width:'100%',fontSize:14,fontWeight:'bold',textAlign:'start',lineHeight:1,color:_.colors.colorTitle,margin:0,padding:0,marginTop:-.5}} component="div">{addonName.name}</Typography>
                        <Typography variant='subtitle1' sx={{width:'140%',fontSize:13,color:_.colors.colorOrange,textAlign:'start',lineHeight:1,fontWeight:'bold',marginLeft:1}} component="div">{selectAddonsValues.filter((a:any)=>a.parent === item.parent).map((b:any)=>b.name).join(', ')}</Typography>
                    </Box>
                </Box> 
            </Box>
            <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorOrange,marginRight:0.6,fontWeight:'bold',marginTop:-.5}} component="div">₹{selectAddonsValues.filter((a:any)=>a.parent === item.parent).map((b:any)=>Number(b.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue})}</Typography>
        </Box>
        }
        </>
    )
}

const MenuItemsAddedView = (props:any) => {
    const {item,index,selectedMenuItems,setselectedMenuItems,setloading,restaurant} = props;
    const selectAddonsValues = item?.selectAddonsValues
    const _itemTotalPrice = item?.selectAddonsValues&&item?.selectAddonsValues.length !== 0 && item.selectAddonsValues.map((a:any)=>Number(a.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue})+Number(item.price)
    useEffect(() => {
        console.log(selectedMenuItems.map((item:any) => item.uid))
    }, [selectedMenuItems])
    return(
        item.addons_categories.length === 0?
        <>
        {/* non customizable menu added item */}
        <Box key={index} sx={{display:'flex',flexDirection:'row',alignItems:'center',paddingTop:1,paddingBottom:2,borderBottom:1,borderBottomColor:_.colors.colorExtraLightGray}}>
            <Box sx={{width:'132%',display:'flex',flexDirection:'row',alignItems:'center'}}>
                <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,marginTop:-.6}}>
                    <IconButton onClick={()=>{
                        const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                        setselectedMenuItems(removeOBJ)
                    }} size="small">
                        <MdCancel color={_.colors.colorBlack} size={24}/>
                    </IconButton>
                </Box>
                <Box sx={{height:'100%',marginLeft:.5,marginRight:1}}>
                    <BiFoodTag color={item.food_type === 'veg'?'#08A117':_.colors.colorRed} size={24}/>
                </Box>
                <Typography variant="caption" sx={{maxWidth:'100%',fontSize:16,color:_.colors.colorTitle,lineHeight:1.15,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.menu_name}</Typography>
            </Box>
            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginLeft:1}}>
                <Typography variant="h6" sx={{fontSize:14,textAlign:'center',fontWeight:'bold',color:_.colors.colorOrange,marginRight:0.6}} component="div">₹{item.price.toFixed(2)}</Typography>
                <Box  sx={{display:'flex',flexDirection:'row',alignItems:'center',backgroundColor:_.colors.colorTransparent,borderWidth:2,borderRadius:2}}>
                    <IconButton onClick={()=>{
                        if(item.quantity === 1){
                            const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                            setselectedMenuItems(removeOBJ)
                        }else{
                            const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                            // const objIndex = selectedMenuItems.findIndex((a:any)=>a.uid === item.uid)
                            // selectedMenuItems[objIndex].quantity = item.quantity-1
                            const newItem = {...item, quantity: item.quantity-1, uid: uuid()}
                            setselectedMenuItems([...removeOBJ, newItem])
                        }
                    }} size='medium'>
                        <BiMinus color={_.colors.colorBlack} size={16}/>
                    </IconButton>
                    <Typography variant="h6" sx={{fontSize:15,fontWeight:'bold',textAlign:'center',color:_.colors.colorTitle,marginRight:0.6}} component="div">{item.quantity}</Typography>
                    <IconButton onClick={()=>{
                        // const objIndex = selectedMenuItems.findIndex((a:any)=>a.uid === item.uid)
                        // selectedMenuItems[objIndex].quantity = item.quantity+1
                        const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                        const newItem = {...item, quantity: item.quantity+1, uid: uuid()}
                        setselectedMenuItems([...removeOBJ, newItem])
                    }} size="medium">
                        <BiPlus color={_.colors.colorBlack} size={16}/>
                    </IconButton>
                </Box>
                <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorOrange,fontWeight:'bold'}} component="div">₹{(item.price*item.quantity).toFixed(2)}</Typography>
            </Box>  
        </Box>
        </>
        :
        <>
        {/* customizable menu added item */}
        <Box sx={{display:'flex',flexDirection:'column',paddingTop:1,paddingBottom:2,borderBottom:1,borderBottomColor:_.colors.colorExtraLightGray}}>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <Box sx={{width:'132%',display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,marginTop:-.6}}>
                        <IconButton onClick={()=>{
                            const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                            setselectedMenuItems(removeOBJ)
                        }} size="small">
                        <MdCancel color={_.colors.colorBlack} size={24}/>
                        </IconButton>
                    </Box>
                    <Box sx={{height:'100%',marginLeft:.5,marginRight:1}}>
                        <BiFoodTag color={item.food_type === 'veg'?'#08A117':_.colors.colorRed} size={24}/>
                    </Box>
                    <Typography variant="caption" sx={{maxWidth:'100%',fontSize:16,color:_.colors.colorTitle,lineHeight:1.15,display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp:2}} component="div">{item.menu_name}</Typography>
                </Box> 
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginLeft:1}}>
                    <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorOrange,fontWeight:'bold',marginRight:0.6}} component="div">₹{item.price.toFixed(2)}</Typography>
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',backgroundColor:_.colors.colorTransparent}}>
                        <IconButton onClick={()=>{
                            if(item.quantity === 1){
                                const removeOBJ = selectedMenuItems.filter((a:any)=> a.uid !== item.uid)
                                setselectedMenuItems(removeOBJ)
                            }else{
                                const objIndex = selectedMenuItems.findIndex((a:any)=>a.uid === item.uid)
                                selectedMenuItems[objIndex].quantity = item.quantity-1
                                setselectedMenuItems([...selectedMenuItems])
                            }
                        }} size='medium'>
                            <BiMinus color={_.colors.colorBlack} size={16}/>
                        </IconButton>
                        <Typography variant="h6" sx={{fontSize:15,fontWeight:'bold',textAlign:'center',color:_.colors.colorTitle,marginRight:0.6}} component="div">{item.quantity}</Typography>
                        <IconButton onClick={()=>{
                            const objIndex = selectedMenuItems.findIndex((a:any)=>a.uid === item.uid)
                            selectedMenuItems[objIndex].quantity = item.quantity+1
                            setselectedMenuItems([...selectedMenuItems])
                        }} size="medium">
                            <BiPlus color={_.colors.colorBlack} size={16}/>
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{fontSize:14,textAlign:'center',fontWeight:'bold',color:_.colors.colorOrange}} component="div">₹{_itemTotalPrice*item.quantity}</Typography>
                </Box>
            </Box>
            {/* addons categories item */}
            {
                item.selectAddons.map((item:any,index:any)=>{
                    return(
                        <SelectAddonsValuesView key={index} item={item} index={index} setloading={setloading} selectAddonsValues={selectAddonsValues}/>
                    )
                })
            }
        </Box>
        </>
    )
} 

const AddonsSingleSelectionView = (props:any)=>{
    const {item,index,priceValue,selectAddonsValues,setselectAddonsValues,addonsCategoryData,otherValue,currentRadioValue, setcurrentRadioValue,addonsCategoriesList} = props;
    
    useEffect(() => {
        if(addonsCategoryData.data.addonsName.find((a:any)=>a.id === currentRadioValue).id === currentRadioValue){
            const addonsData = addonsCategoriesList.filter((a:any)=>a.other.multipleSelection === false).map((b:any)=>{
                const addons_name = addonsCategoriesList.filter((a:any)=>a.other.multipleSelection === false).map((b:any)=>b.data.addonsName[0])
                const addons_price = addonsCategoriesList.filter((a:any)=>a.other.multipleSelection === false).map((b:any)=>b.data.addonsPrice[0])
                return {id:b.data.addonsName[0].id,name:addons_name.find((name:any)=>name.id === b.data.addonsName[0].id)?.value,price:addons_price.find((name:any)=>name.id === b.data.addonsPrice[0].id)?.value,parent:b.id,other:b.other}
            })
            setselectAddonsValues([...addonsData])
        } 
    }, [])
    
    const _radioChecked = (props:any)=>{
        setcurrentRadioValue(props.target.value)
        if(selectAddonsValues.find((a:any)=>a.parent === addonsCategoryData.id)){
            {/* remove Addon data */}
            const removeOBJ = selectAddonsValues.filter((a:any) => a.parent !== addonsCategoryData.id);
            setselectAddonsValues([...removeOBJ])
            {/* add Addon data */}
            const addonsName = addonsCategoryData.data.addonsName.find((a:any)=>a.id === props.target.value).value
            const addonsPrice = addonsCategoryData.data.addonsPrice.find((a:any)=>a.id === props.target.value).value
            const addonsData = {id:props.target.value,name:addonsName,price:addonsPrice,parent:addonsCategoryData.id,other:otherValue}
            setselectAddonsValues([...removeOBJ,addonsData]) 
        }else{
            {/* add Addon data */}
            const addonsName = addonsCategoryData.data.addonsName.find((a:any)=>a.id === props.target.value).value
            const addonsPrice = addonsCategoryData.data.addonsPrice.find((a:any)=>a.id === props.target.value).value
            const addonsData = {id:props.target.value,name:addonsName,price:addonsPrice,parent:addonsCategoryData.id,other:otherValue}
            setselectAddonsValues([...selectAddonsValues,addonsData])
        }
    }
    return(
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:2}}>
            <FormControlLabel value={item.id} onChange={_radioChecked} checked={item.id === currentRadioValue} sx={{marginLeft:.15}} control={<Radio/>} label={<Typography variant="h6" sx={{fontSize:15,textAlign:'center',color:_.colors.colorTitle}} component="div">{item.value}</Typography>}/>
            <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorOrange,marginLeft:-1}} component="div">₹{priceValue.find((a:any)=>a.id === item.id).value}</Typography>
        </Box>
    )
}

const AddonsMultipleSelectionView = (props:any)=>{
    const {item,index,priceValue,selectAddonsValues,setselectAddonsValues,addonsCategoryData,otherValue,openSnackbar,setOpenSnackbar} =props;
    const [checkBoxSelect, setcheckBoxSelect] = useState(false)
    const _checkedBox = (props:any)=>{
        if(selectAddonsValues.find((a:any)=>a.id === item.id)){
            const removeOBJ = selectAddonsValues.filter((a:any) => a.id !== item.id);
            setselectAddonsValues([...removeOBJ])
            setcheckBoxSelect(props.target.checked)
        }else{
            if(Number(addonsCategoryData.other.maximumLimit)){
                if(selectAddonsValues.filter((a:any)=> a.parent === addonsCategoryData.id).length+1 > Number(addonsCategoryData.other.maximumLimit)){
                    setOpenSnackbar({...openSnackbar, open: true,message:`You can choose up to ${addonsCategoryData.other.maximumLimit} options`,type:'error' });
                }else{
                    const addonsName = addonsCategoryData.data.addonsName.find((a:any)=>a.id === item.id).value
                    const addonsPrice = addonsCategoryData.data.addonsPrice.find((a:any)=>a.id === item.id).value
                    const addonsData = {id:item.id,name:addonsName,price:addonsPrice,parent:addonsCategoryData.id,other:otherValue}
                    setselectAddonsValues([...selectAddonsValues,addonsData])
                    setcheckBoxSelect(props.target.checked)
                }
            }else{
                const addonsName = addonsCategoryData.data.addonsName.find((a:any)=>a.id === item.id).value
                const addonsPrice = addonsCategoryData.data.addonsPrice.find((a:any)=>a.id === item.id).value
                const addonsData = {id:item.id,name:addonsName,price:addonsPrice,parent:addonsCategoryData.id,other:otherValue}
                setselectAddonsValues([...selectAddonsValues,addonsData])
                setcheckBoxSelect(props.target.checked)
            }
        }
    }
    
    return(
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:2}}>
            <Checkbox {...label} checked={checkBoxSelect} onChange={_checkedBox}/>
            <Typography variant="h6" sx={{fontSize:15,textAlign:'center',color:_.colors.colorTitle}} component="div">{item.value}</Typography>
            <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorOrange,marginLeft:1}} component="div">₹{priceValue.find((a:any)=>a.id === item.id).value}</Typography>
        </Box>
    )
}

const AddonsCategoriesView = (props:any)=>{
    const {item,index,selectAddonsValues,setselectAddonsValues,addonsCategoriesList,openSnackbar,setOpenSnackbar,setloading} = props;
    const addonsCategoryData = item
    const priceValue = item.data.addonsPrice
    const otherValue = item?.other
    const [addonName, setaddonName] = useState<any>('')
    const [currentRadioValue, setcurrentRadioValue] = useState(item.data.addonsName[0].id)

    const _addonsItem = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            '_id':item.id
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
        <>
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
            <Typography variant="h6" sx={{fontSize:17,textAlign:'start',color:_.colors.colorTitle,fontWeight:'bold',marginRight:0.6}} component="div">{addonName.name}</Typography>
            {otherValue?.mandatory&&<FaStarOfLife color={_.colors.colorRed} size={8}/>}
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',marginLeft:2}}>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" >
                {
                    item.data.addonsName.map((item:any,index:any)=>{
                        return(
                            otherValue?.multipleSelection?
                            <AddonsMultipleSelectionView key={index} item={item} index={index} priceValue={priceValue} selectAddonsValues={selectAddonsValues} setselectAddonsValues={setselectAddonsValues} addonsCategoryData={addonsCategoryData} otherValue={otherValue} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar}/>
                            :
                            <AddonsSingleSelectionView key={index} item={item} index={index} priceValue={priceValue} selectAddonsValues={selectAddonsValues} setselectAddonsValues={setselectAddonsValues} addonsCategoryData={addonsCategoryData} otherValue={otherValue} currentRadioValue={currentRadioValue} setcurrentRadioValue={setcurrentRadioValue} addonsCategoriesList={addonsCategoriesList}/>
                        )
                    })
                }
            </RadioGroup>
        </Box>
        </>
    )
}

const OrderStatus = [
    {id:'PLA',title: 'Placed'},
    {id:'ACC',title:'Accepted' },
    {id:'PRE',title: 'Preparing'},
    {id:'SER',title:'Served'},
    {id:'COM',title: 'Completed'}
]

const OrderStatus2 = [
    {id:'PRE',title: 'Preparing'},
    {id:'SER',title:'Served'},
    {id:'COM',title: 'Completed'}
]

function AddNewOrder() {
    const navigation = useNavigate()
    const {state,pathname}:any = useLocation();
    const mediaQuery = useMediaQuery('(min-width:600px)')
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
    const [usersList, setusersList] = useState([])
    const [restaurantsList, setrestaurantsList] = useState([])
    const [tableList, settableList] = useState([])
    const [waitersList, setwaitersList] = useState([])
    
    const [user, setuser] = useState<any>({})
    const [userFromAddUser, setuserFromAddUser] = useState<any>({})
    const [restaurant, setrestaurant] = useState<any>(null)
    const [table, settable] = useState<any>(null)
    const [orderType, setorderType] = useState('dine_in')
    const [subtotal, setsubtotal] = useState<number>(0)
    const [IGST_amount, setIGST_amount] = useState<number>(0)
    const [SGST_amount, setSGST_amount] = useState<number>(0)
    const [CGST_amount, setCGST_amount] = useState<number>(0)
    const [serviceTax_amount, setserviceTax_amount] = useState<number>(0)
    const [total, settotal] = useState<number>(0)
    const [order_status, setorder_status] = useState<any>(null)
    const [waiter, setwaiter] = useState<any>(null)
    const [payment_status, setpayment_status] = useState<any>(null)
    const [orderDateTime, setorderDateTime] = useState<Date | null>(new Date());
    const [instructions, setinstructions] = useState('')

    const [onHover, setonHover] = useState({})
    const [categoryList, setcategoryList] = useState([])
    const [selectCategory, setselectCategory] = useState<any>({})
    const [selectCategoryHover, setselectCategoryHover] = useState({})
    const [menuItemsList, setmenuItemsList] = useState([])
    const [addonsBackDrop, setaddonsBackDrop] = useState(false)
    const [selectedMenuItems, setselectedMenuItems] = useState<any>([])
    const [selectAddonsCategories, setselectAddonsCategories] = useState<any>({})
    const [selectAddonsValues, setselectAddonsValues] = useState<any>([])
    const [categoryIndex, setCategoryIndex] = useState<number>(0)

    const {userDetails} = useSelector((state:RootState) => state);

    const _subtotalPrice = selectedMenuItems.map((element:any) => {
        if(element.selectAddonsValues){
            const _addonsPrice = element.selectAddonsValues.length !== 0 &&element.selectAddonsValues.map((a:any)=>Number(a.price)).reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue})
            const itemTotalPrice = Number(element.price)+_addonsPrice
            return itemTotalPrice * element.quantity
        }else{
           return element.price * element.quantity
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const taxes_amount = ()=>{
        setIGST_amount(restaurant.IGST_type === 'percentage'?Number(restaurant.IGST_amount)*subtotal/100:Number(restaurant.IGST_amount))
        setSGST_amount(restaurant.SGST_type === 'percentage'?Number(restaurant.SGST_amount)*subtotal/100:Number(restaurant.SGST_amount))
        setCGST_amount(restaurant.CGST_type === 'percentage'?Number(restaurant.CGST_amount)*subtotal/100:Number(restaurant.CGST_amount))
        setserviceTax_amount(restaurant.service_tax_type === 'percentage'?Number(restaurant.service_tax_amount)*subtotal/100:Number(restaurant.service_tax_amount))
        settotal(subtotal+IGST_amount+SGST_amount+CGST_amount+serviceTax_amount)
    }

    useEffect(() => {
        restaurant&&taxes_amount()
        _subtotalPrice.length === 0?setsubtotal(0):setsubtotal(_subtotalPrice.reduce(function (previousValue:any, currentValue:any){return previousValue + currentValue}))
    }, [_subtotalPrice])
    

    useEffect(() => {
        if(!addonsBackDrop){
            setselectAddonsValues([])
            setTimeout(() => {
                setselectAddonsCategories([])
            },250);
        }
    }, [addonsBackDrop])
    
    useEffect(() => {
        !restaurant&&
        settableList([])
        setcategoryList([])
        setmenuItemsList([])
        setselectedMenuItems([])
    }, [restaurant])

    const _editData = (_restaurant:any)=>{
        if (state?.TAG === 'TABLE_VIEW') {
            setrestaurant(state?.data?.restaurant);
            settable(state?.data?.table);
            return;
        }

        setuser(state?.data?.user)
        setrestaurant(_restaurant)
        settable(state?.data?.table)
        setorderType(state?.data?.order_type)
        setTimeout(() => {
            setselectedMenuItems(state?.data?.food_items)
        }, 200);
        setsubtotal(state?.data?.subtotal)
        setIGST_amount(state?.data?.IGST_amount)
        setSGST_amount(state?.data?.SGST_amount)
        setCGST_amount(state?.data?.CGST_amount)
        setserviceTax_amount(state?.data?.service_tax_amount)
        settotal(state?.data?.total)
        setorder_status(state?.data?.order_status)
        setwaiter(state?.data?.waiter)
        setpayment_status(state?.data?.payment_status)
        setorderDateTime(state?.data?.order_date_and_time)
        setinstructions(state?.data?.instructions)
    }

    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            state?.TAG==='ADD_USER'&&setuserFromAddUser(state?.data)
            state?.TAG==='ADD_USER'&&setuser(state?.data)
            state?.TAG==='TABLE_VIEW'&&_editData(userDetails?.user.restaurant)
            state?.TAG==='EDIT'&&_editData(userDetails?.user.restaurant)
        }else{
            state?.TAG==='ADD_USER'&&setuserFromAddUser(state?.data)
            state?.TAG==='ADD_USER'&&setuser(state?.data)
            state?.TAG==='TABLE_VIEW'&&_editData(state?.data?.restaurant)
            state?.TAG==='EDIT'&&_editData(state?.data?.restaurant)
        }
    }, [state])

    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            setrestaurant(userDetails?.user.restaurant)
        }
    }, [userDetails])
    
    useEffect(() => {
        if(userDetails?.user.admin_type === 'WAITER'){
            setwaiter(userDetails?.user)
        }else{
            !order_status&&setwaiter(null)
        }
    }, [order_status,userDetails])

    const _listOfUsers = ()=>{
        setloading(true)
        var axios = require('axios');
        let data = {
            restaurant: userDetails?.user?.restaurant?._id,
        }
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_USERS,
          data: data,
        };
        console.log(config)
        axios(config)
        .then(function (response:any) {
          setloading(false)
          console.log(JSON.stringify(response.data));
          if(response.data.status){
            setusersList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
          }else{
    
          }
        })
        .catch(function (error:any) {
          setloading(false)
          console.log(error);
        });
      }
    
      useEffect(() => {
        _listOfUsers()
      }, [userDetails])

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

    const _order_list_by_restaurant = (item:any)=>{
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
                const filterOrderStatus = response.data.data.filter((a:any)=>a.order_status.title !== 'Completed' && a.order_status?.title !== 'Cancelled').map((b:any)=>b.table._id)
                const filteredTableList =  item.filter((a:any) => !filterOrderStatus.find((b:any)=>b === a._id));
                settableList(filteredTableList)
            }else{
                console.log('else');
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _table_list_by_restaurant = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'restaurant':restaurant._id
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
                _order_list_by_restaurant(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
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
        restaurant?._id&&_table_list_by_restaurant()
    }, [restaurant])

    const _menuListByRestaurant = ()=>{
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'restaurant':restaurant._id
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.RESRAURANT_BY_MENU_LIST,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                var categoryArr:any = Object.values(response.data.data.reduce((acc:any,cur:any)=>Object.assign(acc,{[cur.category._id]:cur}),{}))
                setcategoryList(categoryArr)
                setselectCategory(categoryArr[0].category)
            }else{

            }
        })
        .catch(function (error:any) {
        console.log(error);
        });
    }
    useEffect(() => {
        restaurant?._id&&_menuListByRestaurant()
    }, [restaurant])

    const _menu_items_list = ()=>{
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'restaurant': restaurant._id,
        'category': selectCategory._id 
        });
        var config = {
        method: 'post',
        url: BASE_URL+PATH.MENU_ITEMS_LIST,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            response.data.status&&setmenuItemsList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
        })
        .catch(function (error:any) {
            console.log(error);
        });
    }
    useEffect(() => {
        restaurant?._id&&selectCategory?._id&&_menu_items_list()
    }, [restaurant,selectCategory])

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
            setwaitersList(response.data.data.filter((a:any)=>a.restaurant._id === restaurant?._id && a.active_inactive === true))
          }else{
    
          }
        })
        .catch(function (error:any) {
          setloading(false)
          console.log(error);
        });
      }
    
      useEffect(() => {
        restaurant?._id && _listOfWaiters()
      }, [restaurant])

    const _menuItemClick = (item:any)=>{
        if(item.addons_categories.length === 0){
            if(!selectedMenuItems.find((a:any)=>a._id === item._id)){
                item.quantity = 1
                item.uid = uuid()
                setselectedMenuItems([...selectedMenuItems,item])
            }
        }else{
            setselectAddonsCategories(item)
            setaddonsBackDrop(true)
        }
    }

    const _selectAddonSubmit = ()=>{
        const _mandatory = selectAddonsCategories.addons_categories.filter((a:any)=>a.other.mandatory === true)
        const _mandatoryResult = _mandatory.filter((a:any) => !selectAddonsValues.some((b:any) => b.parent === a.id));
        const parentID = selectAddonsValues.map((a:any) => a.parent)
        const filtered = selectAddonsValues.filter((item:any, index:any) => !parentID.includes(item.parent, index + 1)).map((a:any)=>{return {id:a.id,parent:a.parent}})
        if(_mandatoryResult.length === 0){
            if(selectedMenuItems.find((a:any)=>a._id === selectAddonsCategories._id)){
                const new_obj = {...selectAddonsCategories,quantity:1,uid:uuid(),selectAddonsValues:selectAddonsValues,selectAddons:filtered}
                selectedMenuItems.push(new_obj)
                setselectedMenuItems([...selectedMenuItems])
                setaddonsBackDrop(false)
            }else{
                selectAddonsCategories.quantity = 1
                selectAddonsCategories.uid = uuid()
                selectAddonsCategories.selectAddonsValues = selectAddonsValues
                selectAddonsCategories.selectAddons = filtered
                selectedMenuItems.push(selectAddonsCategories)
                setselectedMenuItems([...selectedMenuItems])
                setaddonsBackDrop(false)
            }
        }else{
            setOpenSnackbar({...openSnackbar, open: true,message:'Mandatory fields are required.',type:'error' });
        }
    }

    const _updateProfile = (item:any)=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('_id',item._id );
        data.append('profile',user.profile.file);
        var config = {
            method: 'post',
            url: BASE_URL+PATH.USER_PROFILE_UPDATE,
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            data : data
        };

        axios(config)
        .then(function (response:any) {
            setloading(false)
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                state?.TAG==='EDIT'?_updateOrder(item._id):_addOrder(item._id)
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:'Something went wrong !',type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });
    }
    const _addNewUser = ()=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          name:user.name.trim(),
          phone:user.phone.trim(),
          email:user.email.trim(),
          gender:user.gender,
          date_of_birth:user.dateOfBirth,
          preference:user.preference,
          login_source:user.login_source,
          restaurants: [userDetails?.user?.restaurant?._id] || []
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.USER_REGISTER,
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
            if(user.profile?.uri){
                _updateProfile(response.data.data)
            }else{
                state?.TAG==='EDIT'?_updateOrder(response.data.data._id):_addOrder(response.data.data._id)
            }
           
          }else{
            setOpenSnackbar({...openSnackbar, open: true,message:response.data.message,type:'error' });
          }
        })
        .catch(function (error:any) {
          setloading(false)
          console.log(error);
        });
    }

    const _addOrder = (user_id:any)=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'user': user_id?user_id:user._id,
            'restaurant': restaurant._id,
            'table': table._id,
            'waiter':waiter?._id,
            'order_type':orderType,
            'food_items': JSON.stringify(selectedMenuItems),
            'subtotal': subtotal,
            'IGST_amount': IGST_amount,
            'SGST_amount': SGST_amount,
            'CGST_amount': CGST_amount,
            'service_tax_amount': serviceTax_amount,
            'total': total.toFixed(2),
            'order_status': order_status,
            'order_history':{id:uuid(),user:userDetails?.user,order_status:order_status,activity:'Created'},
            'payment_status': payment_status,
            'order_date_and_time': orderDateTime,
            'instructions':instructions
        });
        var config = {
            method: 'post',
            url: BASE_URL+PATH.ADDNEWORDER,
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
                navigation('/admin/orders/all')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _updateOrder = (user_id:any)=>{
        setloading(true)
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          'id': state?.data?._id,
          'user': user_id?user_id:user._id,
          'restaurant': restaurant._id,
          'table': table._id,
          'waiter':waiter?._id,
          'order_type':orderType,
          'food_items': JSON.stringify(selectedMenuItems),
          'subtotal': subtotal,
          'IGST_amount': IGST_amount,
          'SGST_amount': SGST_amount,
          'CGST_amount': CGST_amount,
          'service_tax_amount': serviceTax_amount,
          'total': total.toFixed(2),
          'order_status': order_status, 
          'payment_status': payment_status,
          'order_date_and_time': orderDateTime,
          'instructions':instructions
        });
        var data2 = qs.stringify({
            'id': state?.data?._id,
            'user': user_id?user_id:user._id,
            'restaurant': restaurant._id,
            'table': table._id,
            'waiter':waiter?._id,
            'order_type':orderType,
            'food_items': JSON.stringify(selectedMenuItems),
            'subtotal': subtotal,
            'IGST_amount': IGST_amount,
            'SGST_amount': SGST_amount,
            'CGST_amount': CGST_amount,
            'service_tax_amount': serviceTax_amount,
            'total': total.toFixed(2),
            'order_status': order_status,
            'order_history': {id:uuid(),user:userDetails?.user,order_status:order_status,activity:'Update'},
            'payment_status': payment_status,
            'order_date_and_time': orderDateTime,
            'instructions':instructions
        });
        var config = {
          method: 'post',
          url: BASE_URL+PATH.UPDATE_ORDER,
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : state?.data?.order_history.find((a:any)=>a.order_status.id === order_status.id)?.order_status.id === order_status.id?data:data2
        };
        
        axios(config)
        .then(function (response:any) {
            setloading(false)
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                navigation('/admin/orders/all')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            setloading(false)
            console.log(error);
        });  
    }

    const _addNewOrder = ()=>{
        if(user?._id){
            state?.TAG==='EDIT'?_updateOrder(null):_addOrder(null)
        }else{
            _addNewUser()
        }
    }

    const _clickSubmit = ()=>{
        if(!user?.name && !user?.phone && !restaurant?._id && !table?._id && selectedMenuItems.length === 0 && !order_status?.id && !payment_status?.id && !orderDateTime){
            setOpenSnackbar({...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!user?.name && !user?.phone){
            setOpenSnackbar({...openSnackbar, open: true,message:'User is required.',type:'error' });
        }else if(!restaurant?._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else if(!table?._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Table is required.',type:'error' });
        }else if(selectedMenuItems.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Food items is required.',type:'error' });
        }else if(!order_status?.id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Order Status is required.',type:'error' });
        }else if(!payment_status?.id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Payment Status is required.',type:'error' }); 
        }else if(!orderDateTime){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Order Date and Time is required.',type:'error' }); 
        }else if(payment_status?.title === 'Unpaid' && order_status?.title === 'Completed'){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Please mark this order as paid, if you want to Complete it !!',type:'error' }); 
        }else{
            _addNewOrder()
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
        <Grid container lg={12} sm={12} md={12} xs={12}>  
        <Box sx={{display:'flex',overflow:'auto'}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{margin: {xs: 2, sm: 0}, display:'flex',flexDirection:'row',alignItems:'center',overflow:'auto'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Orders</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">Add-New-Order</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5, margin: {xs: 2, sm: 0}}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">Add New Order</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{margin: {xs: 2, sm: 0}, overflow:'auto'}}>
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">User</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:{xs: '50%', sm: '28%'},display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginLeft:{xs: 10, sm: 28}}}>
                            {userFromAddUser?.name&&userFromAddUser?.phone&& state?.TAG==='ADD_USER'?
                            <TextField value={userFromAddUser?.name+' '+`(${userFromAddUser?.phone})`} color='secondary' size='small' hiddenLabel disabled variant="outlined" sx={{width:'100%'}}/>
                            :
                            <Autocomplete
                            sx={{width:'100%'}}
                            options={usersList}
                            defaultValue={state?.TAG==='EDIT'?state?.data?.user:null}
                            disabled={state?.TAG==='EDIT'}
                            getOptionLabel={(option:any) => option.name + ' ' + `(${option.phone})`}
                            renderOption={(p:any, option:any) => <Box component='li' {...p}>{`${option.name} (XXXXXX${option.phone.substring(option.phone.length - 4)})`}</Box>}
                            filterSelectedOptions
                            onChange={(event:any, values:any)=>{
                                setuser(values)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size='small' color='secondary'
                                    hiddenLabel
                                />
                            )}/>
                            }
                            </Box>
                            {userFromAddUser?.name&&userFromAddUser?.phone&& state?.TAG==='ADD_USER'?
                            <Box sx={{height:28,width:28,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:_.colors.colorWhite,marginTop:0.4,marginLeft:2,borderRadius:100,boxShadow:6}}>
                                <IconButton onClick={()=>{
                                    setuserFromAddUser({})
                                    setuser({})
                                }} size="small">
                                    <IoMdClose color={_.colors.colorTitle} size={16}/>
                                </IconButton>
                            </Box>:state?.TAG !== 'EDIT'&&<Button onClick={()=>navigation('/admin/user/add-user',{ state: {TAG:'ORDER'}})} sx={{backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginBottom:0.5,marginLeft:2}} size='small' variant="contained">{mediaQuery ? 'Add New User' : 'New' }</Button>}
                        </Box>
                    </Box>
                    {/* Select Restaurant  */}
                    {userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHIEF'?
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
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
                    </Box>
                    :
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <Autocomplete
                            sx={{width:'100%'}}
                            options={restaurantsList}
                            defaultValue={state?.TAG==='TABLE_VIEW' || state?.TAG==='EDIT'?state?.data?.restaurant:userDetails?.user.restaurant}
                            disabled={state?.TAG==='TABLE_VIEW' || state?.TAG==='EDIT' ? true : false}
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
                    {/* Select Table */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Table</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <Autocomplete
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        sx={{width:'100%'}}
                        options={tableList}
                        value={table}
                        defaultValue={state?.TAG==='TABLE_VIEW' || state?.TAG==='EDIT'?state?.data.table:null}
                        disabled={state?.TAG==='TABLE_VIEW' || state?.TAG==='EDIT' ? true : false}
                        getOptionLabel={(option:any) => option.table_no}
                        filterSelectedOptions
                        onChange={(event:any, values:any)=>{
                            settable(values)
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
                    {/* Select Order Type */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Order Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="dine_in" onChange={(props:any)=>setorderType(props.target.value)} checked={orderType === 'dine_in'} control={<Radio />} label="Dine In" />
                                    <FormControlLabel value="parcel" onChange={(props:any)=>setorderType(props.target.value)} checked={orderType === 'parcel'} control={<Radio />} label="Parcel" />
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    {restaurant&&<Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',marginTop:3}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Food items</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Container maxWidth={false} sx={{width:'100%',display:'flex',flexDirection:'column',marginTop:3,padding:0}}>
                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <Box sx={{height:'40px',width:'40px',backgroundColor:_.colors.colorOrange,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2}}>
                                    <IconButton size="large" onClick={() => {
                                        if (categoryIndex === 0) return;
                                        const newIndex = categoryIndex - (mediaQuery ? 7 : 2);
                                        if (newIndex < 0) return;
                                        setCategoryIndex(newIndex)
                                    }}>
                                        <IoIosArrowBack color={_.colors.colorWhite} size={20}/>
                                    </IconButton>
                                </Box>
                                <Container maxWidth={false} sx={{padding:0}}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <CategoryView item={categoryList} categoryIndex={categoryIndex} selectCategory={selectCategory} setselectCategory={setselectCategory} selectCategoryHover={selectCategoryHover} setselectCategoryHover={setselectCategoryHover}/>
                                    </Box>
                                </Container>
                                <Box sx={{height:'40px',width:'40px',backgroundColor:_.colors.colorOrange,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2}}>
                                    <IconButton size="large" onClick={() => {
                                        if (categoryIndex === categoryList.length - 1) return;
                                        const newIndex = categoryIndex + (mediaQuery ? 7 : 2);
                                        if (newIndex > categoryList.length - 1) return;
                                        setCategoryIndex(newIndex)
                                    }}>
                                        <IoIosArrowForward color={_.colors.colorWhite} size={20}/>
                                    </IconButton>
                                </Box>
                            </Box>
                            <Grid container lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',marginTop:4}}>
                                <Grid container lg={7} sm={7} md={7} xs={7}>
                                    <MenuItemsView item={menuItemsList} onHover={onHover} setonHover={setonHover} _menuItemClick={_menuItemClick} selectedMenuItems={selectedMenuItems} restaurant={restaurant}/>
                                </Grid>
                                <Grid container lg={5} sm={5} md={5} xs={5} sx={{maxWidth: '40%'}}>
                                    <Box sx={{boxSizing:'content-box',width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start'}}>
                                        <Box sx={{width:'100%',display:'flex',flexDirection:'row',backgroundColor:_.colors.colorOrange,borderTopLeftRadius:12,borderTopRightRadius:12,padding:1}}>
                                            <Typography variant="h6" sx={{width:'100%',fontSize:14,textAlign:'start',color:_.colors.colorWhite,marginRight:0.6}} component="div">Items</Typography>
                                            <Box sx={{width:'76%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorWhite,marginRight:0.6}} component="div">Price</Typography>
                                                <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorWhite,marginRight:0.6}} component="div">Qty</Typography>
                                                <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorWhite,marginRight:0.6}} component="div">Total</Typography>
                                            </Box>
                                        </Box>
                                        {selectedMenuItems.length === 0?
                                        <Box sx={{minHeight:'100px',width:'100%',overflow:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:_.colors.colorWhite,padding:1}}>
                                            <Box sx={{height:'100px',width:'100px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:_.colors.colorOrangeDisable,padding:.5,margin:.6}}>
                                                <img src={_.images.cart} style={{height:'60px',width:'60px'}}/>
                                            </Box>
                                        </Box>
                                        :<Paper elevation={0} sx={{minHeight:'100px',maxHeight:'430px',width:'100%',overflow:'auto',display:'flex',flexDirection:'column',backgroundColor:_.colors.colorMaxExtraLightGray,padding:1}}>
                                            {
                                                selectedMenuItems.map((item:any,index:any)=>{
                                                    return(
                                                        <MenuItemsAddedView item={item} index={index} selectedMenuItems={selectedMenuItems} setselectedMenuItems={setselectedMenuItems} setloading={setloading} restaurant={restaurant}/>
                                                    )
                                                })
                                            }
                                        </Paper>}
                                        <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:_.colors.colorOrange,borderBottomLeftRadius:12,borderBottomRightRadius:12,padding:1}}>
                                            <Typography variant="h6" sx={{width:'100%',fontSize:14,textAlign:'start',color:_.colors.colorWhite,marginRight:0.6}} component="div">Items subtotal:</Typography>
                                            <Typography variant="h6" sx={{fontSize:14,textAlign:'center',color:_.colors.colorWhite,marginRight:0.6}} component="div">₹{subtotal.toFixed(2)}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>}
                    {/* Subtotal */}
                    {selectedMenuItems.length !== 0 && subtotal !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:5,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Subtotal</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+subtotal.toFixed(2)} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* IGST */}
                    {selectedMenuItems.length !== 0 && IGST_amount !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">IGST</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+IGST_amount} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* SGST */}
                    {selectedMenuItems.length !== 0 && SGST_amount !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">SGST</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+SGST_amount} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* CGST */}
                    {selectedMenuItems.length !== 0 && CGST_amount !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">CGST</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+CGST_amount} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* Service charge */}
                    {selectedMenuItems.length !== 0 && serviceTax_amount !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Service Charge</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+serviceTax_amount} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* Total */}
                    {selectedMenuItems.length !== 0 && total !== 0&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Total</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={'₹'+total.toFixed(2)} color='secondary' size='small' variant="outlined" disabled
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>}
                    {/* Select Status */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Payment Status</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <Autocomplete
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{width:'100%'}}
                        options={[{id:'PAI',title:'Paid'},{id:'UNP',title:'Unpaid'}]}
                        value={payment_status}
                        defaultValue={state?.TAG==='EDIT'?state?.data?.payment_status:null}
                        getOptionLabel={(option:any) => option.title}
                        filterSelectedOptions
                        onChange={(event:any, values:any)=>{
                            setpayment_status(values)
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
                    {/* Select Status */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Order Status</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <Autocomplete
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{width:'100%'}}
                        options={state?.TAG==='EDIT'?OrderStatus2:OrderStatus}
                        value={order_status}
                        defaultValue={state?.TAG==='EDIT'?state?.data?.order_status:null}
                        getOptionLabel={(option:any) => option.title}
                        filterSelectedOptions
                        onChange={(event:any, values:any)=>{
                            setorder_status(values)
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
                    {/* Select Status */}
                    {order_status?.title === 'Accepted' || order_status?.title === 'Preparing' || order_status?.title === 'Served' ||  order_status?.title === 'Completed' ?
                    restaurant &&
                    userDetails?.user.admin_type === 'WAITER'?
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Waiters</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <Autocomplete
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{width:'100%'}}
                        options={waitersList}
                        // value={waiter}
                        defaultValue={userDetails?.user}
                        disabled={true}
                        getOptionLabel={(option:any) => option.name}
                        filterSelectedOptions
                        onChange={(event:any, values:any)=>{
                            setwaiter(values)
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            size='small' color='secondary'
                            //label='Select'
                        />
                        )}/>
                        </Box>
                    </Box>
                    :
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Waiters</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                        <Autocomplete
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{width:'100%'}}
                        options={waitersList}
                        // value={waiter}
                        defaultValue={state?.TAG === 'EDIT'?state?.data?.waiter:null}
                        disabled={state?.TAG==='EDIT'&&state?.data?.waiter}
                        getOptionLabel={(option:any) => option.name}
                        filterSelectedOptions
                        onChange={(event:any, values:any)=>{
                            setwaiter(values)
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            size='small' color='secondary'
                            //label='Select'
                        />
                        )}/>
                    </Box>
                </Box>
                    :null}
                    {/* Select order date and time */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
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
                    {/* Select Instructions */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Instructions</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width:'40%',display:'flex',flexDirection:'row',marginLeft:28}}>
                            <TextField value={instructions} onChange={(prop)=>setinstructions(prop.target.value)} multiline minRows={4} maxRows={4} color='secondary' size='small' label="Enter Instructions" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{margin: {xs: 2, sm: 0}, width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:5,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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
            {/* Add Add-ons */}
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,backdropFilter:"blur(10px)"}}
            open={addonsBackDrop}>
            <Box sx={{width:'50%',backgroundColor:_.colors.colorTransparent}}>
                <Box sx={{display:'flex',flexDirection:'row',backgroundColor:_.colors.colorOrange,paddingTop:1.5,paddingBottom:1.5,paddingLeft:2,paddingRight:2,borderTopLeftRadius:12,borderTopRightRadius:12,}}>
                    <Typography variant="h6" sx={{width:'100%',fontSize:18,textAlign:'start',color:_.colors.colorWhite,fontWeight:'bold',marginRight:0.6}} component="div">SELECT ADDONS</Typography>
                    <Box sx={{height:30,width:30,backgroundColor:_.colors.colorWhite,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:100,boxShadow:5}}>
                        <IconButton onClick={()=>setaddonsBackDrop(false)} size="small">
                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column',padding:2,backgroundColor:_.colors.colorWhite}}>
                    <Paper elevation={0} sx={{maxHeight:'400px',width:'100%',overflow:'auto',display:'flex',flexDirection:'column',padding:1}}>
                    {selectAddonsCategories?.addons_categories&&selectAddonsCategories.addons_categories.map((item:any,index:any)=>{
                        return(
                            <AddonsCategoriesView key={index} item={item} index={index} selectAddonsValues={selectAddonsValues} setselectAddonsValues={setselectAddonsValues} addonsCategoriesList={selectAddonsCategories?.addons_categories} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} setloading={setloading}/> 
                        )
                    })}
                    </Paper>
                    <Box sx={{width:'100%',marginTop:5,marginBottom:1,display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center'}}>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Typography variant="h6" sx={{fontSize:15,textAlign:'center',color:_.colors.colorTitle}} component="div">Total:</Typography>
                            <Typography variant="h6" sx={{fontSize:16,fontWeight:'bold',textAlign:'center',color:_.colors.colorTitle,marginLeft:1}} component="div">₹{selectAddonsValues.length===0?0:selectAddonsValues.map((a:any) => a.price).reduce((acc:any, amount:any) => Number(acc)+Number(amount))}</Typography>
                            <Button onClick={_selectAddonSubmit} sx={{width:'16%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginLeft:3}} size='medium' variant="contained">SUBMIT</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Backdrop>
        </Box>
        </Grid>  
        </ThemeProvider>
        </LocalizationProvider>
    );
}

export default AddNewOrder;