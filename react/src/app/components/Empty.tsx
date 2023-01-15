import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from '../config';

function Empty() {
    return (
        <Box sx={{height:'70vh',width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <Box sx={{height:'160px',width:'160px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:_.colors.colorOrangeDisable}}>
                <img src={_.images.empty} style={{height:'100px',width:'100px',marginTop:-10}}/>
            </Box>
            <Typography sx={{fontSize:32,fontWeight:'bold',marginTop:2}}>Oops !!</Typography>
            <Typography sx={{fontSize:14,color:_.colors.colorSubTitle}}>No Record Found</Typography>
        </Box>
    );
}

export default Empty;