import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from '../config';

function Select() {
    return (
        <Box sx={{height:'70vh',width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <Box sx={{height:'160px',width:'160px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:_.colors.colorOrangeDisable}}>
                <img src={_.images.select} style={{height:'80px',width:'80px',marginLeft:20}}/>
            </Box>
            <Typography sx={{fontSize:26,fontWeight:'bold',marginTop:2}}>Select Restaurant !!</Typography>
            {/* <Typography sx={{fontSize:14,color:_.colors.colorSubTitle}}>subtitle</Typography> */}
        </Box>
    );
}

export default Select;