/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { AppBar, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiFillHome} from "react-icons/ai";
import { HiViewGridAdd} from "react-icons/hi";
import { GiTatteredBanner} from "react-icons/gi";
import { RiCoupon2Fill, RiUserVoiceFill} from "react-icons/ri";
import { GoPrimitiveDot} from "react-icons/go";
import { IoIosOptions, IoMdCart, IoMdNotifications} from "react-icons/io";
import { TiArrowSortedDown,TiArrowSortedUp} from "react-icons/ti";
import { FiMenu} from "react-icons/fi";
import _ from "../../../config";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import type { RootState } from '../../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { AddCategory, AddCuisines, AddMenu, AddNewOrder, AddNewRestaurant, AddOns, AddTable, AddCoupons, Dashboard, ListOfAddOns, ListOfCategory, ListOfCuisines, MenuList, Notification, OrderDetails, OrdersList, ResturantsList, TableList, TableView, ListOfCoupons, AddUser, ListOfUser, ListOfManager, AddWaiter, ListOfWaiter, AddChef, ListOfChef, AddBanner, ListOfBanner, AddCMS, ListOfCMS, SystemOption, Profile,Error, AddStockType, ListOfStockType, AddInventory, ListOfInventory} from '../..';
import { matchPath, Route, Routes, useNavigate } from 'react-router-dom';
import { SiAirtable, SiCraftcms, SiHomeassistantcommunitystore, SiGoogleanalytics } from 'react-icons/si';
import { MdCategory, MdMenuBook, MdInventory } from 'react-icons/md';
import { FaConciergeBell, FaUserAlt, FaUserTie } from 'react-icons/fa';
import AddManager from './../AddManager';
import { useLocation } from 'react-router-dom'
import  MapComponent  from '../MapComponent';
  
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../../api';
import user from '../../../functions/user';
import { AddUserDetails } from '../../../redux/reducers/UserDetails';
import Analytics from '../Analytics';

const drawerWidth = 270;

interface Props {
  window?: () => Window;
}

const routes:any = [
    {path:'/admin/dashboard'},
    {path:'/admin/orders/all'},
    {path:'/admin/orders/processing'},
    {path:'/admin/orders/Prepared'},
    {path:'/admin/orders/completed'},
    {path:'/admin/orders/cancelled'},
    {path:'/admin/orders/details'},
    {path:'/admin/orders/add-new-order'},
    {path:'/admin/restaurant/add-new-restaurant'},
    {path:'/admin/restaurant/restaurants-list'},
    {path:'/admin/menu/add-menu'},
    {path:'/admin/menu/menu-list'},
    {path:'/admin/table/add-table'},
    {path:'/admin/table/table-list'},
    {path:'/admin/table/table-view'},
    {path:'/admin/category/add-category'},
    {path:'/admin/category/list-of-categories'},
    {path:'/admin/add-ons/add-add-ons'},
    {path:'/admin/add-ons/list-of-add-ons'},
    {path:'/admin/cuisines/add-cuisines'},
    {path:'/admin/cuisines/list-of-cuisines'},
    {path:'/admin/coupons/add-coupons'},
    {path:'/admin/coupons/list-of-coupons'},
    {path:'/admin/notification'},
    {path:'/admin/user/add-user'},
    {path:'/admin/user/list-of-user'},
    {path:'/admin/manager/add-manager'},
    {path:'/admin/manager/list-of-manager'},
    {path:'/admin/waiter/add-waiter'},
    {path:'/admin/waiter/list-of-waiter'},
    {path:'/admin/chef/add-chef'},
    {path:'/admin/chef/list-of-chef'},
    {path:'/admin/banner/add-banner'},
    {path:'/admin/banner/list-of-banner'},
    {path:'/admin/cms/add-cms'},
    {path:'/admin/cms/list-of-cms'},
    {path:'/admin/system-option'},
    {path:'/admin/profile'},
    {path: '/admin/map-component'},
    {path:'/admin/stock-type/add-stock-type'},
    {path:'/admin/stock-type/list-of-stock-type'},
    {path:'/admin/inventory/add-inventory'},
    {path:'/admin/inventory/list-of-inventory'},
    {path: '/admin/analytics'}
  ]

const drawerList = [
    {
      title:'Dashboard',
      path:'/admin/dashboard'
    },
    {
      nested_title:'Orders',
      extraPath:'/admin/orders/details',
      data:[
      {
        title:'Orders',
        subTitle:'All',
        path:'/admin/orders/all',
      },
      {
        title:'Orders',
        subTitle:'Preparing',
        path:'/admin/orders/processing',
      },
      {
        title:'Orders',
        subTitle:'Prepared',
        path:'/admin/orders/Prepared',
      },
      {
        title:'Orders',
        subTitle:'Completed',
        path:'/admin/orders/completed',
      },
      {
        title:'Orders',
        subTitle:'Cancelled',
        path:'/admin/orders/cancelled',
      },
      {
        title:'Orders',
        subTitle:'Add New Order',
        path:'/admin/orders/add-new-order',
      },
    ]
  },
  {
    nested_title:'Restaurant',
    data:[
      {
        title:'Restaurant',
        subTitle:'Add New Restaurant',
        path:'/admin/restaurant/add-new-restaurant',
      },
      {
        title:'Restaurant',
        subTitle:'Restaurants List',
        path:'/admin/restaurant/restaurants-list',
      }

      ]
    },
    {
      nested_title:'Table',
      data:[
        {
          title:'Table',
          subTitle:'Add Table',
          path:'/admin/table/add-table',
        },
        {
          title:'Table',
          subTitle:'Table List',
          path:'/admin/table/table-list',
        },
        {
          title:'Table',
          subTitle:'Table View',
          path:'/admin/table/table-view',
        }
      ]
    },   
    {
      nested_title:'Menu',
      data:[
        {
          title:'Menu',
          subTitle:'Add menu',
          path:'/admin/menu/add-menu',
        },
        {
          title:'Menu',
          subTitle:'Menu List',
          path:'/admin/menu/menu-list',
        }
      ]
    },
    {
      nested_title:'Category',
      data:[
        {
          title:'Category',
          subTitle:'Add Category',
          path:'/admin/category/add-category',
        },
        {
          title:'Category',
          subTitle:'List of categories',
          path:'/admin/category/list-of-categories',
        },
      ]
    },   
    {
      nested_title:'Stock-type',
      data:[
        {
          title:'Stock-type',
          subTitle:'Add Stock-type',
          path:'/admin/stock-type/add-stock-type',
        },
        {
          title:'Stock-type',
          subTitle:'List of Stock-type',
          path:'/admin/stock-type/list-of-stock-type',
        },
      ]
    },
    {
      nested_title:'Inventory',
      data:[
        {
          title:'Inventory',
          subTitle:'Add Inventory',
          path:'/admin/inventory/add-inventory',
        },
        {
          title:'Inventory',
          subTitle:'List of Inventory',
          path:'/admin/inventory/list-of-inventory',
        },
      ]
    },
    {
      nested_title:'Add-ons',
      data:[
        {
          title:'Add-ons',
          subTitle:'Add Add-ons',
          path:'/admin/add-ons/add-add-ons',
        },
        {
          title:'Add-ons',
          subTitle:'List of Add-ons',
          path:'/admin/add-ons/list-of-add-ons',
        },
      ]
    },
    {
      nested_title:'Cuisines',
      data:[
        {
          title:'Cuisines',
          subTitle:'Add Cuisines',
          path:'/admin/cuisines/add-cuisines',
        },
        {
          title:'Cuisines',
          subTitle:'List of Cuisines',
          path:'/admin/cuisines/list-of-cuisines',
        },
      ]
    },   
    {
      nested_title:'Coupons',
      data:[
        {
          title:'Coupons',
          subTitle:'Add Coupons',
          path:'/admin/coupons/add-coupons',
        },
        {
          title:'Coupons',
          subTitle:'List of Coupons',
          path:'/admin/coupons/list-of-coupons',
        },
      ]
    },
    {
      title:'Notification',
      path:'/admin/notification',
    },
    
    {
      nested_title:'User',
      data:[
        {
          title:'User',
          subTitle:'Add User',
          path:'/admin/user/add-user',
        },
        {
          title:'User',
          subTitle:'List of User',
          path:'/admin/user/list-of-user',
        },
      ]
    },
    {
      nested_title:'Manager',
      data:[
        {
          title:'Manager',
          subTitle:'Add Manager',
          path:'/admin/manager/add-manager',
        },
        {
          title:'Manager',
          subTitle:'List of Manager',
          path:'/admin/manager/list-of-manager',
        },
      ]
    },
    {
      nested_title:'Waiter',
      data:[
        {
          title:'Waiter',
          subTitle:'Add Waiter',
          path:'/admin/waiter/add-waiter',
        },
        {
          title:'Waiter',
          subTitle:'List of Waiter',
          path:'/admin/waiter/list-of-waiter',
        },
      ]
    },
    {
      nested_title:'Chef',
      data:[
        {
          title:'Chef',
          subTitle:'Add Chef',
          path:'/admin/chef/add-chef',
        },
        {
          title:'Chef',
          subTitle:'List of Chef',
          path:'/admin/chef/list-of-chef',
        },
      ]
    },
    {
      nested_title:'Banner',
      path:'/admin/',
      data:[
        {
          title:'Banner',
          subTitle:'Add Banner',
          path:'/admin/banner/add-banner',
        },
        {
          title:'Banner',
          subTitle:'List of Banner',
          path:'/admin/banner/list-of-banner',
        },
      ]
    },
    {
      title:'CMS',
      path:'/admin/cms/list-of-cms',
      path_arr:[{path:'/admin/cms/list-of-cms'},{path:'/admin/cms/add-cms'}]
    },
    {
      title:'System Option',
      path:'/admin/system-option',
    },
    {
      title: 'Analytics',
      path: '/admin/analytics'
    }
]

const DrawerButton = ({index,item,}:{index:any,item:any})=>{
    const navigation = useNavigate()
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const handleClick = (index:any) => {
      setOpen(!open);
    };
    const path_arr = item?.path_arr&&item?.path_arr.find((a:any)=>a?.path === location.pathname)?.path === location.pathname
    const orderDetails_path = '/admin/orders/details' === location.pathname
    return(
        <>
        {item.title?
        <ListItemButton style={{backgroundColor:item.path === location.pathname || path_arr?_.colors.colorOrange:_.colors.colorTransparent,borderRadius:10}} key={item.title}
        onClick={()=>navigation(item.path)}>
        <ListItemIcon>
          {item.title === 'Dashboard' && <AiFillHome color={item.path === location.pathname ?_.colors.colorWhite:_.colors.colorTitle} size={20}/> }
          {item.title === 'Notification' && <IoMdNotifications color={item.path === location.pathname ?_.colors.colorWhite:_.colors.colorTitle} size={20}/> }
          {item.title === 'System Option' && <IoIosOptions color={item.path === location.pathname ?_.colors.colorWhite:_.colors.colorTitle} size={20}/> }
          {item.title === 'CMS' &&<SiCraftcms color={item.path === location.pathname || path_arr?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
          {item.title === 'Analytics' &&<SiGoogleanalytics color={item.path === location.pathname || path_arr?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
        </ListItemIcon>
        <ListItemText style={{color:item.path === location.pathname || path_arr?_.colors.colorWhite:_.colors.colorTitle}} primary={item.title} />
        </ListItemButton>
        :
        <>
        <ListItemButton style={{backgroundColor:item.data.find((i:any)=>i.path === location.pathname) || item.extraPath === location.pathname ?_.colors.colorOrange:_.colors.colorTransparent,borderRadius:10}} key={item.title} 
          onClick={()=>handleClick(index)}>
            <ListItemIcon>
              {item.nested_title === 'Orders'&& <IoMdCart color={item.data.find((i:any)=>i.path === location.pathname) || orderDetails_path?_.colors.colorWhite:_.colors.colorTitle} size={20}/>}
              {item.nested_title === 'Restaurant'&& <SiHomeassistantcommunitystore color={item.data.find((i:any)=>i.path === location.pathname)?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Table'&& <SiAirtable color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Menu'&& <MdMenuBook color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Category'&& <MdCategory color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Stock-type'&& <MdInventory color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Inventory'&& <MdInventory color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Add-ons'&& <HiViewGridAdd color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Cuisines'&& <FaConciergeBell color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Coupons'&& <RiCoupon2Fill color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'User'&& <FaUserAlt color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Manager'&& <FaUserTie color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Waiter'&& <RiUserVoiceFill color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Chef'&& <RiUserVoiceFill color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Banner'&& <GiTatteredBanner color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
            </ListItemIcon>
            <ListItemText style={{color:item.data.find((i:any)=>i.path === location.pathname) || item.extraPath === location.pathname ?_.colors.colorWhite:_.colors.colorTitle}} primary={item.nested_title} />
            {open ? <TiArrowSortedUp color={item.data.find((i:any)=>i.path === location.pathname) || item.extraPath === location.pathname ?_.colors.colorWhite:_.colors.colorTitle} size={16}/> : <TiArrowSortedDown color={item.data.find((i:any)=>i.path === location.pathname)|| item.extraPath === location.pathname ?_.colors.colorOrange:_.colors.colorTitle} size={16}/>}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            {item.data.map((item:any, index:any) => (
                <ListItemButton
                style={{borderRadius:10}} key={item.title} 
                onClick={()=>navigation(item.path)}
                sx={{ pl: 4 }}>
                <ListItemIcon>
                    <GoPrimitiveDot color={item.path === location.pathname?_.colors.colorOrange:_.colors.colorTitle} size={14}/>
                    </ListItemIcon>
                <ListItemText style={{color:item.path === location.pathname?_.colors.colorOrange:_.colors.colorTitle}} primaryTypographyProps={{fontSize: '14px'}} primary={item.subTitle} />
                </ListItemButton>
            ))}
            </List>
        </Collapse>
        </>
        }
        </>
    )
}

const DrawerView = ()=>{
  const navigation = useNavigate()
  return(
    <Box style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:10,backgroundColor:_.colors.colorWhite}}>
      <img onClick={()=>navigation('/admin/dashboard')} src={_.images.bohfy_logo} style={{height:34,marginTop:'10%'}}/> 
      <List sx={{width:'100%',marginTop:5}}>
        {drawerList.map((item, index) => (
          <DrawerButton index={index} item={item}/>
        ))}
      </List>
    </Box>
  )
}


export default function Admin(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigation = useNavigate()
  const {pathname}:any = useLocation();

  const [loading, setloading] = useState(true)
  const mathRoute = routes.map((route:any) => {
    const match:any = matchPath(pathname,route.path);
    return match
  })
  const matchResult = mathRoute.find((a:any)=>a?.pathname === pathname)?.pathname
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container = window !== undefined ? () => window().document.body : undefined;
  const location = useLocation();
  const dispatch = useDispatch()
  const {userDetails} = useSelector((state:RootState) => state);
  const [headerTitle, setheaderTitle] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const profileMenu = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    user((item:any) => {
      dispatch(AddUserDetails(item));
      setTimeout(() => {
        setloading(false)
      }, 200);
    })
  },[])

  const _headerTitle = ()=>{
    if(location.pathname === '/admin/dashboard'){
      setheaderTitle('Dashboard')
    }else if(location.pathname === '/admin/orders/all' || location.pathname === '/admin/orders/processing' || location.pathname === '/admin/orders/completed' || location.pathname === '/admin/orders/cancelled' || location.pathname === '/admin/orders/add-new-order' || location.pathname === '/admin/orders/details'){
      setheaderTitle('Orders')
    }else if(location.pathname === '/admin/restaurant/add-new-restaurant' || location.pathname === '/admin/restaurant/restaurants-list'){
      setheaderTitle('Restaurant')
    }else if(location.pathname === '/admin/table/add-table' || location.pathname === '/admin/table/table-list' || location.pathname === '/admin/table/table-view'){
      setheaderTitle('Table')
    }else if(location.pathname === '/admin/menu/add-menu' || location.pathname === '/admin/menu/menu-list'){
      setheaderTitle('Menu')
    }else if(location.pathname === '/admin/category/add-category' || location.pathname === '/admin/category/list-of-categories'){
      setheaderTitle('Category')
    }else if(location.pathname === '/admin/stock-type/add-stock-type' || location.pathname === '/admin/stock-type/list-of-stock-type'){
      setheaderTitle('Stock-type')  
    }else if(location.pathname === '/admin/inventory/add-inventory' || location.pathname === '/admin/inventory/list-of-inventory'){
      setheaderTitle('Inventory')   
    }else if(location.pathname === '/admin/add-ons/add-add-ons' || location.pathname === '/admin/add-ons/list-of-add-ons'){
      setheaderTitle('Add-ons')
    }else if(location.pathname === '/admin/cuisines/add-cuisines' || location.pathname === '/admin/cuisines/list-of-cuisines'){
      setheaderTitle('Cuisines')
    }else if(location.pathname === '/admin/coupons/add-coupons' || location.pathname === '/admin/coupons/list-of-coupons'){
      setheaderTitle('Coupons')
    }else if(location.pathname === '/admin/notification'){
      setheaderTitle('Notification')
    }else if(location.pathname === '/admin/user/add-user' || location.pathname === '/admin/user/list-of-user'){
      setheaderTitle('User')
    }else if(location.pathname === '/admin/manager/add-manager' || location.pathname === '/admin/manager/list-of-manager'){
      setheaderTitle('Manager')
    }else if(location.pathname === '/admin/waiter/add-waiter' || location.pathname === '/admin/waiter/list-of-waiter'){
      setheaderTitle('Waiter')
    }else if(location.pathname === '/admin/chef/add-chef' || location.pathname === '/admin/chef/list-of-chef'){
      setheaderTitle('Chef')
    }else if(location.pathname === '/admin/banner/add-banner' || location.pathname === '/admin/banner/list-of-banner'){
      setheaderTitle('Banner')
    }else if(location.pathname === '/admin/cms/list-of-cms'){
      setheaderTitle('CMS')
    }else if(location.pathname === '/admin/system-option'){
      setheaderTitle('System Option')
    }else if(location.pathname === '/admin/profile'){
      setheaderTitle('Profile')
    }else if(location.pathname === '/admin/map-component'){
      setheaderTitle('Pick Latitude and Longitude')
    }else if(location.pathname === '/admin/analytics'){
      setheaderTitle('Analytics')
    }
  }

  useEffect(() => {
    _headerTitle()
  }, [location])

  // if(userDetails.user.active_inactive){
  // }
  // else{
  //   navigation('/admin/login')
  //   localStorage.removeItem('@TOKEN')
  // }
     
    return (
    userDetails?.user?._id && matchResult === pathname && userDetails.user.active_inactive=== true?
    <Box sx={{width: '100%', overflowX: 'hidden', display: 'flex'}}>
      <AppBar
        color="transparent"
        position='fixed'
        sx={{width: {sm: `calc(100% - ${drawerWidth}px)` },ml: { sm: `${drawerWidth}px`,backdropFilter:"blur(20px)"},background: 'transparent', boxShadow: 'none',borderBottom :`0.1px groove ${_.colors.colorExtraLightGray}`}}>
        <Toolbar sx={{display:'flex',flexDirection:'row',alignItems:'center',alignContent:'space-between',}}>
          <Box style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
            <IconButton 
            onClick={handleDrawerToggle}
            sx={{display: { sm:'none' }}}
            size='medium'>
            <FiMenu color={_.colors.colorTitle} size={30}/>
            </IconButton>
            <Typography variant="h6" style={{fontSize:20,color:_.colors.colorTitle,}} component="div">{headerTitle}</Typography>
          </Box>
          <Box style={{position:'fixed',display:'flex',flexDirection:'row',alignItems:'center',right:20}} >
          {/* <IconButton 
            size='medium'
            style={{padding:10,marginRight:12}}>
              <IoNotificationsSharp color={_.colors.colorBlack} size={26}/>
            </IconButton> */}
            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'end',marginLeft:2,marginRight:1}}>
              <Typography variant="h6" style={{fontSize:16,color:_.colors.colorTitle,fontWeight:'bold'}} component="div">{userDetails?.user?.name}</Typography>
              <Typography variant="h6" style={{fontSize:14,color:_.colors.colorSubTitle,}} component="div">Admin</Typography>
            </Box>
            <IconButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>)=>setAnchorEl(event.currentTarget)}
              size='medium'>
                <img src={FILE_URL+FILE_PATH.PROFILE_IMAGE+userDetails?.user?.profile} 
                style={{height:'40px',width:'40px',alignSelf: 'center',borderRadius:100,display:'block',objectFit:'cover'}}/>
            </IconButton>
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={profileMenu}
            onClose={()=>setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
            <MenuItem onClick={()=>{
              navigation('/admin/profile')
              handleClose()
            }}>Profile</MenuItem>
            <MenuItem onClick={()=>{
              navigation('/admin/login')
              localStorage.removeItem('@TOKEN')
              handleClose()
            }}>Logout</MenuItem>
          </Menu>
          </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth },flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{display: { xs: 'block', sm: 'none' },'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}}>
          <DrawerView/>
        </Drawer>
        <Drawer
        variant="permanent"
        sx={{display: { xs: 'none', sm: 'block' },'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },}}
        open>
          <DrawerView/>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: {sm: 3}, width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar/>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/map-component" element={<MapComponent />}/>
          <Route path="/orders/all" element={<OrdersList/>}/>
          <Route path="/orders/processing" element={<OrdersList/>}/>
          <Route path="/orders/Prepared" element={<OrdersList/>}/>
          <Route path="/orders/completed" element={<OrdersList/>}/>
          <Route path="/orders/cancelled" element={<OrdersList/>}/>
          <Route path="/orders/details" element={<OrderDetails/>}/>
          <Route path="/orders/add-new-order" element={<AddNewOrder/>}/>
          <Route path="/restaurant/add-new-restaurant" element={<AddNewRestaurant/>}/>
          <Route path="/restaurant/restaurants-list" element={<ResturantsList/>}/>
          <Route path="/menu/add-menu" element={<AddMenu/>}/>
          <Route path="/menu/menu-list" element={<MenuList/>}/>
          <Route path="/table/add-table" element={<AddTable/>}/>
          <Route path="/table/table-list" element={<TableList/>}/>
          <Route path="/table/table-view" element={<TableView/>}/>
          <Route path="/category/add-category" element={<AddCategory/>}/>
          <Route path="/category/list-of-categories" element={<ListOfCategory/>}/>
          <Route path="/stock-type/add-stock-type" element={<AddStockType/>}/>
          <Route path="/stock-type/list-of-stock-type" element={<ListOfStockType/>}/>
          <Route path="/inventory/add-inventory" element={<AddInventory/>}/>
          <Route path="/inventory/list-of-inventory" element={<ListOfInventory/>}/>
          <Route path="/add-ons/add-add-ons" element={<AddOns/>}/>
          <Route path="/add-ons/list-of-add-ons" element={<ListOfAddOns/>}/>
          <Route path="/cuisines/add-cuisines" element={<AddCuisines/>}/>
          <Route path="/cuisines/list-of-cuisines" element={<ListOfCuisines/>}/>
          <Route path="/coupons/add-coupons" element={<AddCoupons/>}/>
          <Route path="/coupons/list-of-coupons" element={<ListOfCoupons/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/user/add-user" element={<AddUser/>}/>
          <Route path="/user/list-of-user" element={<ListOfUser/>}/>
          <Route path="/manager/add-manager" element={<AddManager/>}/>
          <Route path="/manager/list-of-manager" element={<ListOfManager/>}/>
          <Route path="/waiter/add-waiter" element={<AddWaiter/>}/>
          <Route path="/waiter/list-of-waiter" element={<ListOfWaiter/>}/>
          <Route path="/chef/add-chef" element={<AddChef/>}/>
          <Route path="/chef/list-of-chef" element={<ListOfChef/>}/>
          <Route path="/banner/add-banner" element={<AddBanner/>}/>
          <Route path="/banner/list-of-banner" element={<ListOfBanner/>}/>
          <Route path="/cms/add-cms" element={<AddCMS/>}/>
          <Route path="/cms/list-of-cms" element={<ListOfCMS/>}/>
          <Route path="/system-option" element={<SystemOption/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/analytics" element={<Analytics/>}/>
        </Routes>
      </Box>
    </Box>:!loading?<Error/>:null
  );
}

