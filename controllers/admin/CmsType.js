var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
CmsTypeModel = require('../../models/admin/CmsType')
const { db } = require('../../models/admin/CmsType');

exports.AddCmsType = (req, res) => {
    var cmsTypeModel = new CmsTypeModel();
    cmsTypeModel.name = req.body.name;
    cmsTypeModel.active_inactive = true ;
    cmsTypeModel.status = true;
    cmsTypeModel.save(function(err,data){
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
                message:'CMS type Added !',
                data:data
            })
        } 
    });
};

exports.ListOfCmsType = (req, res) => {
    CmsTypeModel.find()
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