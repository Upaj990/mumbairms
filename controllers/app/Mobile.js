const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const SERVICE_ID = process.env.SERVICE_ID;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

exports.Otp = (req, res) => {
client.verify
    .services(SERVICE_ID)
    .verifications.create({
        to: req.body.phone,
        channel: 'sms',
    })
    .then(result => {
        res.json({
            status :true,
            code:200,
        })
    }).catch(err =>{
        res.json({
            status :false,
            code:403,
            message:err.code === 60200&&'Invalid parameter'|| 
            err.code === 60200&&'Invalid parameter'||
            err.code === 60201&&'Invalid verification code'||
            err.code === 60202&&'Max check attempts reached'||
            err.code === 60203&&'Max send attempts reached'||
            err.code === 60204&&'Service does not support this feature'||
            err.code === 60205&&'SMS is not supported by landline phone number'||
            err.code === 60206&&`'Amount' & 'Payee' params are required'`||
            err.code === 60207&&'Max rate limits per service reached'||
            err.code === 60208&&'Rate limit with that UniqueName already exists'||
            err.code === 60209&&'UniqueName format is invalid'||
            err.code === 60210&&'Max Buckets per Rate limit reached'||
            err.code === 60211&&'Bucket with the given Interval already exists'||
            err.code === 60212&&'Too many concurrent requests for phone number'||
            err.code === 60213&&'A Messaging Configuration already exists for the given country'
        })
    })
};
  
exports.Verify = (req, res) => {
client.verify
    .services(SERVICE_ID)
    .verificationChecks.create({
        to: req.body.phone,
        code: req.body.code,
    })
    .then(result => {
        console.log(result)
        if(result.valid){
            res.json({
                status :true,
                code:200,
            })
        }else{
            res.json({
                status :false,
                code:403,
            })
        }
        
    }).catch(err => {
        console.log(err)
        res.json({
            status :false,
            code:403,
            error:err
        })
    })
};    