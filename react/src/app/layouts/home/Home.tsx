import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, PATH } from '../../api';
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch} from 'react-redux';
import user from '../../functions/user';
import { Admin, Manager, Waiter } from './profiles';
import Chef from './profiles/Chef';
import { AddUserDetails } from '../../redux/reducers/UserDetails';

function Home() {
  const navigation = useNavigate()
  const dispatch = useDispatch()
  const {userDetails} = useSelector((state:RootState) => state);
  const [loading, setloading] = useState(true)
  const token = localStorage.getItem('@TOKEN');
  useEffect(() => {
    !token&&navigation('/admin/login')
  }, [])
  
  useEffect(() => {
    user((item:any) => {
      setloading(false)
      dispatch(AddUserDetails(item));
    })
  }, [])
    
  return (
    <>
      {userDetails?.user?.admin_type === 'SUPER'&&<Admin/>}
      {userDetails?.user?.admin_type === 'MANAGER'&&<Manager/>}
      {userDetails?.user?.admin_type === 'WAITER'&&<Waiter/>}
      {userDetails?.user?.admin_type === 'CHEF'&&<Chef/>}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
          <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
}

export default Home;