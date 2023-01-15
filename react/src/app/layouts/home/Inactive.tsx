import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Lottie from 'react-lottie';
import _ from '../../config';

function Inactive() {
    return (
        <Box sx={{height:'100vh',width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Lottie options={{
                loop: true,
                autoplay: true, 
                animationData: _.lotties.error,
            }}
            height={380}
            width={380}
            style={{marginTop:60}}/>
            <Typography sx={{marginTop:-12,fontSize:24,color:_.colors.colorDarkGray,fontWeight:'normal'}}>Your account is inactive! Please contact admin to start the service</Typography>
        </Box>
    );
}

export default Inactive;