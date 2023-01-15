var mongoose = require("mongoose");
StockTypeModel = require('../../models/admin/StockType')
const { db } = require('../../models/admin/StockType');

exports.AddStockType = (req, res) => {
    var stockTypeModel = new StockTypeModel();
    stockTypeModel.name = req.body.name;
    stockTypeModel.active_inactive = true ;
    stockTypeModel.status = true;
    stockTypeModel.save(function(err,data){
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
                message:'Stock Type Added !',
                data:data
            })
        } 
    });
};
exports.UpdateStockType = (req, res) => {
    db.collection('stocktypes').findOneAndUpdate(
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

exports.ListOfStockType = async(req, res) => {
    try {
        const stockTypeList = await StockTypeModel.find().exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = stockTypeList.filter(
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
                    data:stockTypeList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:stockTypeList
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

exports.DeleteStockType = (req,res) => {
    StockTypeModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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