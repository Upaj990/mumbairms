var mongoose = require("mongoose");
AddOnsModel = require('../../models/admin/AddOns')
const { db } = require('../../models/admin/AddOns');

exports.AddAddOns = (req, res) => {
    var addOnsModel = new AddOnsModel();
    addOnsModel.name = req.body.name;
    addOnsModel.active_inactive = true ;
    addOnsModel.status = true;
    addOnsModel.save(function(err,data){
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
                message:'AddOns Added !',
                data:data
            })
        } 
    });
};

exports.UpdateAddOns = (req, res) => {
    db.collection('addons').findOneAndUpdate(
        {_id: new mongoose.mongo.ObjectID(req.body.id)},
        {$set:req.body},
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

exports.SearchAddons = (req, res) => {
    AddOnsModel.findOne({_id:req.body._id})
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

exports.ListOfAddOns = async(req, res) => {
    try {
        const addonsList = await AddOnsModel.find().exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = addonsList.filter(
                  data =>
                    data.name.toLowerCase().includes(req.body.search.toLowerCase())
                );
                res.json({
                    status :true,
                    code:200,
                    data:filterData
                })
            } else {
                res.json({
                    status :true,
                    code:200,
                    data:addonsList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:addonsList
            })
        }
    } catch (error) {
        res.json({
            code:403,
            status :false,
            error:error
        })
    }
}

exports.DeleteAddons = (req,res) => {
    AddOnsModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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
