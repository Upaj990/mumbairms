WeeksModel = require('../../models/admin/Weeks')

exports.AddWeeks = (req, res) => {
    var weeksModel = new WeeksModel();
    weeksModel.id = req.body.id;
    weeksModel.title = req.body.title ;
    weeksModel.status = true;
    weeksModel.save(function(err,data){
        if (err){
            res.json({
                status :false,
                code:403,
                error:err,
            })
        }else{
            res.json({
                status :true,
                code:200,
                message:'Week added !',
                data:data
            })
        } 
    });
};

exports.ListOfWeeks = (req, res) => {
    WeeksModel.find()
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                code:403,
                status :false,
            }) 
        }
        else {
            res.json({
                status :true,
                code:200,
                data:result
            })
        }
    })
}