import { Alert, Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Link, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { CgFormatSlash } from 'react-icons/cg';
import NumberFormat from 'react-number-format';
import { FaStarOfLife } from 'react-icons/fa';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, FILE_URL, PATH } from '../../api';
import { v4 as uuid } from 'uuid';
import _ from '../../config';
import { IoMdClose } from 'react-icons/io';

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
          isNumericString
        />
      );
    },
  );

const FieldView = (props:any)=>{
    const {item,index,parent_item,setaddonsName,addonsName,addonsPrice, setaddonsPrice,setaddonsNameCurrentValue,setaddonsPriceCurrentValue,setplusFields,plusFields} = props; 

    useEffect(() => {
        if(addonsName.find((v:any)=>v.id === item && v.isDeleted === true)){
            
        }else{
            if(addonsName.find((v:any)=>v.id === item || v.isDeleted === true)){
                addonsName.find((a:any)=>a.isDeleted === true)&&
                addonsName.splice(addonsName.findIndex((a:any) => a.isDeleted === true) , 1)
                setaddonsName([...addonsName])
            }else{
                var array =[...addonsName], obj={id:item,value:'',isDeleted:false};
                array.push(obj);   
                setaddonsName(array)
            }
        }
        if(addonsPrice.find((v:any)=>v.id === item && v.isDeleted === true)){
            
        }else{
            if(addonsPrice.find((v:any)=>v.id === item || v.isDeleted === true)){
                addonsPrice.find((a:any)=>a.isDeleted === true)&&
                addonsPrice.splice(addonsPrice.findIndex((a:any) => a.isDeleted === true) , 1)
                setaddonsPrice([...addonsPrice])
            }else{
                var array =[...addonsPrice], obj={id:item,value:'',isDeleted:false};
                array.push(obj);
                setaddonsPrice(array)
            }
        }
    },[plusFields])
    
    const _removeOBJ = (data:any)=>{
        if(plusFields.find((id:any)=>id === data && addonsName.find((v:any)=>v.id === data) && addonsPrice.find((v:any)=>v.id === data))){
            {/* {update add fields} */}
            plusFields.splice(plusFields.findIndex((a:any) => a === data),1)
            setplusFields([...plusFields])
            {/* {update addons name} */}
            const objIndexName = addonsName.findIndex(((obj:any) => obj.id === item));
            addonsName[objIndexName].isDeleted = true
            setaddonsName([...addonsName]) 
            {/* {update addons price} */}
            const objIndexPrice = addonsPrice.findIndex(((obj:any) => obj.id === item));
            addonsPrice[objIndexPrice].isDeleted = true
            setaddonsPrice([...addonsPrice]) 
        }else{
           
        }
    }
    return(
        <Box key={index} sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:index===0?0:1}}>
            <Box>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,marginRight:0.6}} component="div">Addons Name</Typography>
                <FaStarOfLife color={_.colors.colorRed} size={8}/>
            </Box>
                <TextField value={addonsName[addonsName.findIndex((a:any)=>a.id === item)]?.value} 
                onChange={(prop)=>{
                    setaddonsNameCurrentValue({id:item,value:prop.target.value,parent_item:parent_item})
                    if(addonsName.find((v:any)=>v.id === item)){
                        const objIndex = addonsName.findIndex(((obj:any) => obj.id === item));
                        addonsName[objIndex].value = prop.target.value
                        addonsName[objIndex].isDeleted = false
                        setaddonsName([...addonsName])
                    }else{
                        var array =[...addonsName], obj={id:item,value:prop.target.value,isDeleted:false};
                        array.push(obj);   
                        setaddonsName(array)
                    }
                }}
                color='secondary' size='small' placeholder='Enter addons name' variant="outlined"
                sx={{width:'200px',backgroundColor:_.colors.colorWhite,}} />
            </Box>
            <Box>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                    <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,marginRight:0.6}} component="div">Price</Typography>
                    <FaStarOfLife color={_.colors.colorRed} size={8}/>
                </Box>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <TextField
                        sx={{width:'200px',backgroundColor:_.colors.colorWhite}}
                        color='secondary' size='small' placeholder="Enter price" variant="outlined"
                        value={addonsPrice[addonsPrice.findIndex((a:any)=>a.id === item)]?.value}
                        onChange={(prop)=>{
                            setaddonsPriceCurrentValue({id:item,value:prop.target.value,parent_item:parent_item})
                            if(addonsPrice.find((v:any)=>v.id === item)){
                                const objIndex = addonsPrice.findIndex(((obj:any) => obj.id === item));
                                addonsPrice[objIndex].value = prop.target.value
                                addonsPrice[objIndex].isDeleted = false
                                setaddonsPrice([...addonsPrice])
                            }else{
                                var array =[...addonsPrice], obj={id:item,value:prop.target.value,isDeleted:false};
                                array.push(obj);   
                                setaddonsPrice(array)
                            }
                        }}
                        InputProps={{
                            inputComponent: NumberFormatCustom as any,
                        }}
                    />
                    <Box sx={{backgroundColor:index!== 0?_.colors.colorWhite:_.colors.colorTransparent,borderRadius:100,boxShadow:index!== 0?6:0,marginLeft:2}}>
                        <IconButton onClick={()=>_removeOBJ(item)} disabled={index === 0} size="small">
                            <IoMdClose color={index!== 0?_.colors.colorTitle:_.colors.colorTransparent} size={12}/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const AddAddonsView = (props:any)=>{
    const {item,index,state,setOpenSnackbar,openSnackbar,setaddonsCategoryData,addonsCategoryData} = props;
    const [selectAddons, setselectAddons] = useState<any>(null)
    const [plusFields, setplusFields] = useState([uuid()])
    const [addonsName, setaddonsName] = useState<any>([])
    const [addonsPrice, setaddonsPrice] = useState<any>([])
    const [addonsNameCurrentValue, setaddonsNameCurrentValue] = useState<any>({})
    const [addonsPriceCurrentValue, setaddonsPriceCurrentValue] = useState<any>({})
    const [multipleSelection, setmultipleSelection] = useState(false)
    const [mandatory, setmandatory] = useState(false)
    const [maxLimitCheckbox, setmaxLimitCheckbox] = useState(false)
    const [maxLimit, setmaxLimit] = useState('')

    const parent_item = item

    const _update_init = ()=>{
        if(item._id === addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.id){
            setaddonsName(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.data?.addonsName)
            setaddonsPrice(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.data?.addonsPrice)
            setplusFields(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.data?.addonsName.map((b:any)=>b.id))
            setselectAddons(item)
            setmultipleSelection(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.multipleSelection)
            setmandatory(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.mandatory)
            if(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.maximumLimit){
                setmaxLimitCheckbox(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.maximumLimit.length === 0 ? false : true)
            }else{
                setmaxLimitCheckbox(false)
            }
            setmaxLimit(addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.maximumLimit)
        }
        if(item._id !== addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.id){
            setaddonsName([])
            setaddonsPrice([])
            setplusFields([uuid()])
            setselectAddons(null)
        }
    }
    useEffect(() => {
        state&&_update_init()
    },[])

    useEffect(() => {
        if(addonsNameCurrentValue?.value || addonsPriceCurrentValue?.value){
            if(addonsCategoryData.find((v:any)=>v.id === item._id)){
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].data = {addonsName:addonsName,addonsPrice:addonsPrice}
                setaddonsCategoryData([...addonsCategoryData])
            }else{
                var array =[...addonsCategoryData], obj={'id':item._id,'data':{addonsName:addonsName,addonsPrice:addonsPrice},other:{multipleSelection:multipleSelection,mandatory:mandatory,maximumLimit:maxLimit}};
                array.push(obj);   
                setaddonsCategoryData(array)
            }
        }else{

        }
    }, [addonsName,addonsPrice,multipleSelection,mandatory,maxLimit])
    
    const _checkBoxAddons = (data:any)=>{
        if(data?._id === selectAddons?._id){
            setselectAddons(null)
            setplusFields([uuid()])
            setaddonsName([])
            setaddonsPrice([])
            setaddonsNameCurrentValue({})
            setaddonsPriceCurrentValue({})
            setmultipleSelection(false)
            setmandatory(false)
            setmaxLimitCheckbox(false)
            setmaxLimit('')
            if(addonsCategoryData.find((v:any)=>v.id === item._id)){
                const removeOBJ = addonsCategoryData.filter((a:any) => a.id !== item._id);
                setaddonsCategoryData([...removeOBJ])
            }
        }else{
            setselectAddons(data)
        }
    }
   
    const _addClick = ()=>{
        if(addonsName.find((a:any) => a.value.length === 0 ) || addonsPrice.find((a:any) => a.value.length === 0 )){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Addons name & price is required.',type:'error' });
        }else{
            const arr = [...plusFields]
            arr.push(uuid())
            setplusFields(arr)
        }
    }
    
    const _clickMultipleSelection = (event:any)=>{
        setmultipleSelection(event.target.checked)
        if(addonsCategoryData.find((v:any)=>v.id === item._id)){
            if(addonsCategoryData.find((v:any)=>v.id === item._id)?.other){
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other.multipleSelection = event.target.checked
                setaddonsCategoryData([...addonsCategoryData])
            }else{
                const findOBJ = addonsCategoryData.find((v:any)=>v.id === item._id)
                findOBJ.other = {multipleSelection:event.target.checked,mandatory:mandatory,maximumLimit:maxLimit}
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other = findOBJ.other
                setaddonsCategoryData([...addonsCategoryData])
            }
        }else{
            var array =[...addonsCategoryData], object={id:item._id,data:{addonsName:addonsName,addonsPrice:addonsPrice},other:{multipleSelection:event.target.checked,mandatory:mandatory,maximumLimit:maxLimit}};
            array.push(object);   
            setaddonsCategoryData(array)
        }
        if(event.target.checked === false){
            const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
            addonsCategoryData[objIndex].other.mandatory = false
            addonsCategoryData[objIndex].other.maximumLimit = ''
            setaddonsCategoryData([...addonsCategoryData])
            setmandatory(false)
            setmaxLimitCheckbox(false)
            setmaxLimit('')  
        }
    }
    const _clickMandatory = (event:any)=>{
        setmandatory(event.target.checked)
        if(addonsCategoryData.find((v:any)=>v.id === item._id)){
            if(addonsCategoryData.find((v:any)=>v.id === item._id)?.other){
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other.mandatory = event.target.checked
                setaddonsCategoryData([...addonsCategoryData])
            }else{
                const findOBJ = addonsCategoryData.find((v:any)=>v.id === item._id)
                findOBJ.other = {multipleSelection:multipleSelection,mandatory:event.target.checked,maximumLimit:maxLimit}
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other = findOBJ.other
                setaddonsCategoryData([...addonsCategoryData])
            }
        }else{
            var array =[...addonsCategoryData], object={id:item._id,data:{addonsName:addonsName,addonsPrice:addonsPrice},other:{multipleSelection:multipleSelection,mandatory:event.target.checked,maximumLimit:maxLimit}};
            array.push(object);   
            setaddonsCategoryData(array)
        }
    }
    const _maxLimitCheckbox = (event:any)=>{
        setmaxLimitCheckbox(event.target.checked)
        if(event.target.checked === false){
            const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
            addonsCategoryData[objIndex].other.maximumLimit =''
            setaddonsCategoryData([...addonsCategoryData])
            setmaxLimit('')  
        }
    }
    const _onChangeMaxLimit = (prop:any)=>{
        setmaxLimit(prop.target.value)
        if(addonsCategoryData.find((v:any)=>v.id === item._id)){
            if(addonsCategoryData.find((v:any)=>v.id === item._id)?.other){
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other.maximumLimit = prop.target.value
                setaddonsCategoryData([...addonsCategoryData])
            }else{
                const findOBJ = addonsCategoryData.find((v:any)=>v.id === item._id)
                findOBJ.other = {multipleSelection:multipleSelection,mandatory:mandatory,maximumLimit:prop.target.value}
                const objIndex = addonsCategoryData.findIndex(((obj:any) => obj.id === item._id));
                addonsCategoryData[objIndex].other = findOBJ.other
                setaddonsCategoryData([...addonsCategoryData])
            }
        }else{
            var array =[...addonsCategoryData], object={id:item._id,data:{addonsName:addonsName,addonsPrice:addonsPrice},other:{multipleSelection:multipleSelection,mandatory:mandatory,maximumLimit:prop.target.value}};
            array.push(object);   
            setaddonsCategoryData(array)
        }
    }
    return(
        <>
        <Box key={index} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
            <Checkbox {...label} checked={item._id === selectAddons?._id} defaultChecked={item._id === selectAddons?._id} onChange={()=>_checkBoxAddons(item)} />
            <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle}} component="div">{item.name}</Typography>
        </Box>
        {item._id === selectAddons?._id&&
        <Box sx={{width:'100%',display:'flex',flexDirection:'column',backgroundColor:_.colors.colorOrangeDisable,paddingTop:0.8,paddingBottom:1,paddingLeft:1,paddingRight:1,borderRadius:1}}> 
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <Checkbox size='small' {...label} checked={multipleSelection} defaultChecked={multipleSelection} onChange={_clickMultipleSelection}/>
                <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle}} component="div">Multiple Selection</Typography>
            </Box> 
            {multipleSelection&&
            <>
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:-2}}>
                <Checkbox size='small' {...label} checked={mandatory} defaultChecked={mandatory} onChange={_clickMandatory}/>
                <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,}} component="div">Mandatory</Typography>
            </Box> 
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:-2}}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Checkbox size='small' {...label} checked={maxLimitCheckbox} defaultChecked={maxLimitCheckbox} onChange={_maxLimitCheckbox}/>
                    <Typography variant="h6" sx={{fontSize:14,color:_.colors.colorTitle,}} component="div">Maximum Limit</Typography>
                </Box>

                {maxLimitCheckbox&&<Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <TextField value={addonsCategoryData[addonsCategoryData.findIndex((a:any)=>a.id === item._id)]?.other?.maximumLimit} onChange={_onChangeMaxLimit} color='secondary' size='small' label="Enter limit" variant="outlined" 
                    InputProps={{
                        inputComponent: NumberFormatCustom as any,
                    }}
                    sx={{width:'200px',backgroundColor:_.colors.colorWhite,marginRight:2}} />
                    <Box sx={{backgroundColor:_.colors.colorTransparent,borderRadius:100,marginLeft:2}}>
                        <IconButton disabled size="small">
                            <IoMdClose color={_.colors.colorTransparent} size={16}/>
                        </IconButton>
                    </Box>
                </Box>}
            </Box>
            </>
            }
            <Box sx={{padding:2}}>
                {plusFields.map((item:any,index:any)=>{
                    return(
                        <FieldView item={item} index={index} key={index} parent_item={parent_item} setaddonsName={setaddonsName} addonsName={addonsName} addonsPrice={addonsPrice} setaddonsPrice={setaddonsPrice} setaddonsNameCurrentValue={setaddonsNameCurrentValue} setaddonsPriceCurrentValue={setaddonsPriceCurrentValue} setplusFields={setplusFields} plusFields={plusFields}/>
                    )
                })}
            </Box>
            <Button onClick={_addClick} sx={{width:'16%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},marginLeft:2,marginBottom:2}} size='small' variant="contained">Add</Button>
        </Box>}
        </>
    )
}

function AddMenu() {
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
    const [categoryList, setcategoryList] = useState([])
    const [addOnsList, setaddOnsList] = useState([])
    const [restaurant, setrestaurant] = useState<any>({})
    const [category, setcategory] = useState<any>({})
    const [foodType, setfoodType] = useState('veg')
    const [menu_name, setmenu_name] = useState('')
    const [SKU, setSKU] = useState('')
    const [add_addons_toggle, setadd_addons_toggle] = useState(false)
    const [price, setprice] = useState('')
    const [taxes, settaxes] = useState('including')
    const [details, setdetails] = useState('')
    const [menuImageURI, setmenuImageURI] = useState<any>(null)

    const [addonsCategoryData, setaddonsCategoryData] = useState([]) 

    const {userDetails} = useSelector((state:RootState) => state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const _editData =()=>{
        setrestaurant(state?.data?.restaurant)
        setcategory(state?.data?.category)
        setfoodType(state?.data?.food_type)
        setmenu_name(state?.data?.menu_name)
        setSKU(state?.data?.SKU)
        setprice(state?.data?.price)
        settaxes(state?.data?.taxes)
        setdetails(state?.data?.details)
        setmenuImageURI({uri:FILE_URL+state?.data?.image.path,file:{name:state?.data?.image.filename},from:'EDIT'})
        setadd_addons_toggle(state?.data?.addons_categories.length === 0?false:true);
        setaddonsCategoryData(state?.data?.addons_categories)
    }
    useEffect(() => {
        if(userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'){
            if(state){
                setrestaurant(userDetails?.user.restaurant)
                setcategory(state?.data?.category)
                setfoodType(state?.data?.food_type)
                setmenu_name(state?.data?.menu_name)
                setSKU(state?.data?.SKU)
                setprice(state?.data?.price)
                settaxes(state?.data?.taxes)
                setdetails(state?.data?.details)
                setmenuImageURI({uri:FILE_URL+state?.data?.image.path,file:{name:state?.data?.image.filename},from:'EDIT'})
                setadd_addons_toggle(state?.data?.addons_categories.length === 0?false:true);
                setaddonsCategoryData(state?.data?.addons_categories)
            }else{
                setrestaurant(userDetails?.user.restaurant)
            }
        }else{
            state&&_editData() 
        }
    }, [])
    useEffect(() => {
       state&&_editData() 
    }, [])

    const _menuImageHandler = (event:any)=>{
        const files = event.target.files
        const reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload=(e)=>{
            setmenuImageURI({uri:e.target?.result,file:event.target.files[0]})
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

    const _categoryList = ()=>{
        var axios = require('axios');
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_CATEGORY,
          headers: { }
        };
    
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          if(response.data.status){
            setcategoryList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
          }else{
    
          }
        })
        .catch(function (error:any) {
          console.log(error);
        });
      }
    
      useEffect(() => {
        _categoryList()
      }, [])

      const _listOfAddOns = ()=>{
        var axios = require('axios');
        var config = {
          method: 'post',
          url: BASE_URL+PATH.LIST_OF_ADDONS,
          headers: { }
        };
    
        axios(config)
        .then(function (response:any) {
          console.log(JSON.stringify(response.data));
          if(response.data.status){
            setaddOnsList(response.data.data.filter((a:any)=>a.active_inactive === true).reverse())
          }
        })
        .catch(function (error:any) {
          console.log(error);
        });
      }
    
      useEffect(() => {
        _listOfAddOns()
      }, [])

    const _addMenu=()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('restaurant',restaurant._id);
        data.append('category', category._id);
        data.append('food_type', foodType);
        data.append('menu_name', menu_name.trim());
        data.append('SKU',SKU.trim());
        data.append('addons_categories',JSON.stringify(addonsCategoryData));
        data.append('price',price);
        data.append('taxes', taxes.trim());
        data.append('details', details.trim());
        data.append('image', menuImageURI.file);
        
        var config = {
            method: 'post',
            url: BASE_URL+PATH.ADD_MENU,
            headers: { 
            Accept: 'applic.ation/json',
            'Content-Type': 'multipart/form-data'
            },
            data : data
        };
        
        axios(config)
        .then(function (response:any) {
            console.log(JSON.stringify(response.data));
            setloading(false)
            if(response.data.status){
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'success' }); 
                navigation('/admin/menu/menu-list')
            }else{
                setOpenSnackbar({ ...openSnackbar, open: true,message:response.data.message,type:'error' }); 
            }
        })
        .catch(function (error:any) {
            console.log(error);
            setloading(false)
        });
    }

    const _updateMenu = ()=>{
        setloading(true)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('id',state?.data?._id);
        data.append('restaurant',restaurant._id);
        data.append('category', category._id);
        data.append('food_type', foodType);
        data.append('menu_name', menu_name.trim());
        data.append('SKU',SKU.trim());
        data.append('addons_categories',JSON.stringify(addonsCategoryData));
        data.append('price',price);
        data.append('taxes', taxes.trim());
        data.append('details', details.trim());
        data.append('image', menuImageURI.file);
        
        var config = {
            method: 'post',
            url: BASE_URL+PATH.UPDATE_MENU,
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
                navigation('/admin/menu/menu-list')
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
        if(menu_name.trim().length === 0 || SKU.trim().length === 0 || price.length === 0 || details.trim().length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'All fields are required.',type:'error' });
        }else if(!restaurant._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Restaurant is required.',type:'error' });
        }else if(!category._id){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Category is required.',type:'error' });
        }else if(foodType.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Food type is required.',type:'error' });
        }else if(addonsCategoryData.find((a:any)=>a.data.addonsName.find((b:any)=>b.value.length === 0 || a.data.addonsPrice.find((b:any)=>b.value.length === 0 )))){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Addons name & price is required.',type:'error' });
        }else if(menuImageURI === null){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Menu image are required.',type:'error' }); 
        }else if(add_addons_toggle && addonsCategoryData.length === 0){
            setOpenSnackbar({ ...openSnackbar, open: true,message:'Addons Categories are required.',type:'error' }); 
        }else{
            state?_updateMenu():_addMenu()
        }
    }

    const _checkBoxAddonsCategories = (event:any)=>{
        setaddonsCategoryData([])
        setadd_addons_toggle(event.target.checked)
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', p: 2}}>
            <Grid container lg={12} sm={12} md={12} xs={12}>
                <Grid lg={12} sm={12} md={12} xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <Link underline='none' onClick={()=>navigation('/admin/dashboard')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Home</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Link underline='none' onClick={()=>navigation('/admin/orders/all')} sx={{color:_.colors.colorDarkGray,":hover":{color:_.colors.colorOrange}}}>Menu</Link>
                    <CgFormatSlash color={_.colors.colorDarkGray} size={20}/>
                    <Typography variant="h1" style={{fontSize:15,color:_.colors.colorTitle}} component="div">{state?'Edit-Menu':'Add-Menu'}</Typography>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:1.5}}>
                    <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{state?'Edit Menu':'Add Menu'}</Typography>
                </Box>
                <Divider sx={{color:_.colors.colorGray,width:'100%',marginTop:2,marginBottom:4}} light />
                <Grid lg={12} sm={12} md={12} xs={12} sx={{}}>
                    {/* Select user */}
                    {userDetails?.user.admin_type === 'MANAGER' || userDetails?.user.admin_type === 'WAITER' || userDetails?.user.admin_type === 'CHEF'?
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <Autocomplete
                            sx={{width:'100%'}}
                            options={restaurantsList}
                            disabled={true}
                            defaultValue={userDetails?.user.restaurant}
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
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Restaurant Name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
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
                    </Box>}
                    {/* Select user */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Category</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                                <Autocomplete
                                sx={{width:'100%'}}
                                options={categoryList}
                                defaultValue={state?.data?.category}
                                getOptionLabel={(option:any) => option.name}
                                filterSelectedOptions
                                onChange={(event:any, values:any)=>{
                                    setcategory(values)
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
                    {/* Select Food items */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Food Type</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="veg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'veg'} control={<Radio />} label="Veg " />
                                    <FormControlLabel value="non_veg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'non_veg'} control={<Radio />} label="Non-veg" />
                                    {/* <FormControlLabel value="egg" onChange={(props:any)=>setfoodType(props.target.value)} checked={foodType === 'egg'} control={<Radio />} label="Egg" /> */}
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box>
                    {/* Select Restaurant */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Menu name</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <TextField color='secondary' value={menu_name} onChange={(prop)=>setmenu_name(prop.target.value)} size='small' label="Enter menu name" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Table */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">SKU</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <TextField value={SKU} onChange={(prop)=>setSKU(prop.target.value)} color='secondary' size='small' label="Enter SKU" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Add Add-ons</Typography>
                            {/* <FaStarOfLife color={_.colors.colorRed} size={8}/> */}
                        </Box>
                        <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <Checkbox {...label} checked={add_addons_toggle} defaultChecked={add_addons_toggle} onChange={_checkBoxAddonsCategories} />
                        </Box>
                    </Box>
                    {/* Select Category */}
                    {add_addons_toggle&&
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Add-ons Categories</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>

                        <Box sx={{width:'52%',display:'flex',flexDirection:'column',ml: {xs: 20, sm: 28}}}>
                            {
                                addOnsList.map((item:any,index:any)=>{
                                    return(
                                       <AddAddonsView item={item} index={index} state={state} key={index} setOpenSnackbar={setOpenSnackbar} openSnackbar={openSnackbar} setaddonsCategoryData={setaddonsCategoryData} addonsCategoryData={addonsCategoryData}/> 
                                    )
                                })
                            }
                        </Box>
                    </Box>}
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Price</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <TextField
                            sx={{width:'100%'}}
                            color='secondary' size='small'
                            label="Enter Price"
                            value={price}
                            onChange={(prop)=>setprice(prop.target.value)}
                            id="formatted-numberformat-input"
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            variant="outlined"
                            />
                        </Box>
                    </Box>
                    {/* Select Food items */}
                    {/* <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Taxes</Typography>
                           
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                    <FormControlLabel value="including" onChange={(props:any)=>settaxes(props.target.value)} checked={taxes === 'including'}  control={<Radio />} label="Including " />
                                    <FormControlLabel value="excluding" onChange={(props:any)=>settaxes(props.target.value)} checked={taxes === 'excluding'} control={<Radio />} label="Excluding" />
                                </RadioGroup>
                            </Box>
                        </Box>
                    </Box> */}
                    {/* Select Category */}
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Details</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'row',ml: {xs: 20, sm: 28}}}>
                            <TextField value={details} onChange={(prop)=>setdetails(prop.target.value)} multiline minRows={4} maxRows={4} color='secondary' size='small' label="Enter Details" variant="outlined"
                            sx={{width:'100%'}} />
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'flex-start',marginTop:3,}}>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',position:'absolute'}}>
                            <Typography variant="h6" sx={{fontSize:16,color:_.colors.colorTitle,marginRight:0.6}} component="div">Image</Typography>
                            <FaStarOfLife color={_.colors.colorRed} size={8}/>
                        </Box>
                        <Box sx={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Box sx={{width: {xs: '50%' , sm: '40%'},display:'flex',flexDirection:'column',ml: {xs: 20, sm: 28}}}>
                            <Box sx={{display:'flex',flexDirection:'row'}}>
                                    <TextField sx={{width:'100%'}} size={'small'} value={menuImageURI?menuImageURI?.file?.name:'Choose file'} variant='outlined'  defaultValue='Choose file'  disabled/>
                                    <Button disableElevation sx={{width:'20%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'},textTransform:'none',marginLeft:1}} component="label" size='medium' variant="contained">Choose <input type="file" onChange={_menuImageHandler} hidden/></Button>
                                </Box>
                                <Box sx={{height:'200px',width:'200px',marginTop:2,position:'relative'}}>
                                    {menuImageURI&&
                                    <Box sx={{backgroundColor:_.colors.colorWhite,borderRadius:100,position:'absolute',top:10,right:10,boxShadow: 6}}>
                                        <IconButton onClick={()=>setmenuImageURI(null)} size="small">
                                            <IoMdClose color={_.colors.colorTitle} size={16}/>
                                        </IconButton>
                                    </Box>
                                    }
                                    <img src={menuImageURI?menuImageURI?.uri:'https://stackfood-admin.6amtech.com/public/assets/admin/img/400x400/img2.jpg'}
                                    style={{height:'100%',width:'100%',borderRadius:10,objectFit:'cover',marginBottom:10}}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10}}>
                    <Button onClick={_clickSubmit} sx={{width:'15%',backgroundColor:_.colors.colorOrange,":hover":{backgroundColor:'#E16512'}}} size='medium' variant="contained">Submit</Button>
                    <Button onClick={()=>navigation('/admin/menu/menu-list')} sx={{width:'15%',backgroundColor:_.colors.colorGray2,":hover":{backgroundColor:'#A0A0A0'},marginLeft:2}} size='medium' variant="contained">Cancel</Button>
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

export default AddMenu;