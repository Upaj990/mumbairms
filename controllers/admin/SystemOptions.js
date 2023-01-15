var mongoose = require("mongoose");
SystemOptionsModel = require('../../models/admin/SystemOptions')
const { db } = require('../../models/admin/Cuisines');

exports.AddSystemOptions = (req, res) => {
    SystemOptionsModel.find()
    .exec((err,result)=>{
        if(result.length === 0){
            var systemOptionsModel = new SystemOptionsModel();
            systemOptionsModel.facebook = req.body.facebook;
            systemOptionsModel.instagram = req.body.instagram;
            systemOptionsModel.twitter = req.body.twitter;
            systemOptionsModel.restaurant_range = req.body.restaurant_range;
            systemOptionsModel.table_range = req.body.table_range;
            systemOptionsModel.active_inactive = true ;
            systemOptionsModel.status = true;
            systemOptionsModel.save(function(err,data){
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
                    })
                } 
            });
        }else{
            SystemOptionsModel.findOne({_id:result[0]._id})
            .exec((err,result)=>{
                if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                    res.json({
                        code:404,
                        status :false,
                        error:err
                    })
                }else{
                    const updateItem = {
                        facebook: req.body.facebook?req.body.facebook:result.facebook,
                        instagram: req.body.instagram?req.body.instagram:result.instagram,
                        twitter: req.body.twitter?req.body.twitter:result.twitter,
                        restaurant_range: Number(req.body.restaurant_range)?Number(req.body.restaurant_range):Number(result.restaurant_range),
                        table_range: Number(req.body.table_range)?Number(req.body.table_range):Number(result.table_range),
                        active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
                        update_on:new Date(),
                    }
                    db.collection('system_options').findOneAndUpdate(
                        {_id: result._id},
                        {$set:updateItem},
                        {upsert: true,},
                        (err,result) => {
                            if(err){
                                res.json({
                                    code:404,
                                    status :false,
                                    error:err
                                })
                            }else{
                                res.json({
                                    code:200,
                                    status :true,
                                })
                            }
                        }
                    );
                }
            })  
        }
    })
};

exports.SystemOptionsDetails = (req, res) => {
    SystemOptionsModel.find()
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
                data:result.length === 0?null:result[0]
            })
        }
    })
}
