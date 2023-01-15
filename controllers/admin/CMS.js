var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
CMSModel = require('../../models/admin/CMS')
const { db } = require('../../models/admin/CMS');

exports.AddCMS = (req, res) => {
    var cmsModel = new CMSModel();
    cmsModel.cms_type = req.body.cms_type;
    cmsModel.content = req.body.content;
    cmsModel.active_inactive = true ;
    cmsModel.status = true;
    cmsModel.save(function(err,data){
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
                message:'CMS Added !',
                data:data
            })
        } 
    });
};

exports.UpdateCMS = (req, res) => {
    CMSModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                status :false,
                code:403,
            })
        }else{
            const updateItem = {
                cms_type:req.body.cms_type?new mongoose.mongo.ObjectID(req.body.cms_type):new mongoose.mongo.ObjectID(result.cms_type),
                content:req.body.content?req.body.content:result.content,
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
            }
            db.collection('cms').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
                {$set:updateItem},
                {upsert: true,},
                (err,response) => {
                    if(err){
                        res.json({
                            status :false,
                            code:403,
                        })
                    }else{
                        res.json({
                            status :true,
                            code:200,
                        })
                    }
                }
            );
        }
    })
}

exports.ListOfCMS = (req, res) => {
    CMSModel.find()
    .populate('cms_type')
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

exports.DeleteCMS = (req,res) => {
    CMSModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
        if(err){
            res.json({
                status :false,
                code:403,
            })
        }else{
            res.json({
                status :true,
                code:200,
            })
        }
    });
}