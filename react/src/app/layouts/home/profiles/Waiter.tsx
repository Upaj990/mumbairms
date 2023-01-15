import * as React from 'react';
import { AppBar, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { GoPrimitiveDot} from "react-icons/go";
import { IoMdCart} from "react-icons/io";
import { TiArrowSortedDown,TiArrowSortedUp} from "react-icons/ti";
import { FiMenu} from "react-icons/fi";
import _ from "../../../config";
import { SiAirtable, SiCraftcms, SiHomeassistantcommunitystore } from 'react-icons/si';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import type { RootState } from '../../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import { AddMenu, AddNewOrder, MenuList, OrderDetails, OrdersList, Profile,Error,AddUser,AddTable,TableList, TableView, } from '../..';
import { matchPath, Route, Routes, useNavigate } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { useLocation } from 'react-router-dom'
  
import { BASE_URL, FILE_PATH, FILE_URL, PATH } from '../../../api';
import user from '../../../functions/user';
import { AddUserDetails } from '../../../redux/reducers/UserDetails';

const drawerWidth = 270;

interface Props {
  window?: () => Window;
}

const routes:any = [
  {path:'/admin/orders/all'},
  {path:'/admin/orders/processing'},
  {path:'/admin/orders/Prepared'},
  {path:'/admin/orders/completed'},
  {path:'/admin/orders/cancelled'},
  {path:'/admin/orders/details'},
  {path:'/admin/orders/add-new-order'},
  {path:'/admin/table/add-table'},
  {path:'/admin/table/table-list'},
  {path:'/admin/table/table-view'},
  {path:'/admin/menu/add-menu'},
  {path:'/admin/menu/menu-list'},
  {path:'/admin/profile'},
  {path:'/admin/user/add-user'},
]

const drawerList = [
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
    }
]

const DrawerButton = ({index,item,}:{index:any,item:any})=>{
    const navigation = useNavigate()
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const handleClick = (index:any) => {
      setOpen(!open);
    };
    
    const orderDetails_path = '/admin/orders/details' === location.pathname
    return(
        <>
        <ListItemButton style={{backgroundColor:item.data.find((i:any)=>i.path === location.pathname) || item.extraPath === location.pathname ?_.colors.colorOrange:_.colors.colorTransparent,borderRadius:10}} key={item.title} 
          onClick={()=>handleClick(index)}>
            <ListItemIcon>
              {item.nested_title === 'Orders'&& <IoMdCart color={item.data.find((i:any)=>i.path === location.pathname) || orderDetails_path?_.colors.colorWhite:_.colors.colorTitle} size={20}/>}
              {item.nested_title === 'Table'&& <SiAirtable color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
              {item.nested_title === 'Menu'&& <MdMenuBook color={item.data.find((i:any)=>i.path === location.pathname) ?_.colors.colorWhite:_.colors.colorTitle} size={16}/>}
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
    )
}

const DrawerView = ()=>{
  const navigation = useNavigate()
  return(
    <Box style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:10,backgroundColor:_.colors.colorWhite}}>
      <img onClick={()=>navigation('/admin/orders/all')} src={_.images.bohfy_logo} style={{height:34,marginTop:'10%'}}/> 
      <List sx={{width:'100%',marginTop:5}}>
        {drawerList.map((item, index) => (
          <DrawerButton index={index} item={item}/>
        ))}
      </List>
    </Box>
  )
}

export default function Waiter(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigation = useNavigate()
  const {pathname}:any = useLocation();

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
  const [loading, setloading] = useState(true)
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
    if(location.pathname === '/admin/orders/all' || location.pathname === '/admin/orders/processing' || location.pathname === '/admin/orders/completed' || location.pathname === '/admin/orders/cancelled' || location.pathname === '/admin/orders/add-new-order' || location.pathname === '/admin/orders/details'){
      setheaderTitle('Orders')
    }else if(location.pathname === '/admin/menu/add-menu' || location.pathname === '/admin/menu/menu-list'){
      setheaderTitle('Menu')
    }
  }

  useEffect(() => {
    _headerTitle()
  }, [location])

  return (
    userDetails?.user?._id && matchResult === pathname && userDetails.user.active_inactive=== true?
    <Box sx={{display: 'flex', width: '100%', overflowX: 'hidden'}}>
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
              <Typography variant="h6" style={{fontSize:14,color:_.colors.colorSubTitle,}} component="div">Waiter</Typography>
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
      <Box component="main" sx={{ flexGrow: 1, p: {sm: 3}, width: {xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar/>
        <Routes>
          <Route path="/orders/all" element={<OrdersList/>}/>
          <Route path="/orders/processing" element={<OrdersList/>}/>
          <Route path="/orders/Prepared" element={<OrdersList/>}/>
          <Route path="/orders/completed" element={<OrdersList/>}/>
          <Route path="/orders/cancelled" element={<OrdersList/>}/>
          <Route path="/orders/details" element={<OrderDetails/>}/>
          <Route path="/orders/add-new-order" element={<AddNewOrder/>}/>
          <Route path="/table/add-table" element={<AddTable/>}/>
          <Route path="/table/table-list" element={<TableList/>}/>
          <Route path="/table/table-view" element={<TableView/>}/>
          <Route path="/menu/add-menu" element={<AddMenu/>}/>
          <Route path="/menu/menu-list" element={<MenuList/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/user/add-user" element={<AddUser/>}/>
        </Routes>
      </Box>
    </Box>:!loading?<Error/>:null
  );
}
