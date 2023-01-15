var mongoose = require("mongoose");
CuisinesModel = require('../../models/admin/Cuisines')
const { db } = require('../../models/admin/Cuisines');

exports.AddCuisines = (req, res) => {
    var cuisinesModel = new CuisinesModel();
    cuisinesModel.name = req.body.name;
    cuisinesModel.active_inactive = true ;
    cuisinesModel.status = true;
    cuisinesModel.save(function(err,data){
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
                message:'Cuisines Added !',
                data:data
            })
        } 
    });
};

exports.UpdateCuisines = (req, res) => {
    db.collection('cuisines').findOneAndUpdate(
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

exports.ListOfCuisines = async(req, res) => {
    try {
        const cuisinesList = await CuisinesModel.find().exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = cuisinesList.filter(
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
                    data:cuisinesList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:cuisinesList
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

exports.DeleteCuisines = (req,res) => {
    CuisinesModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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

