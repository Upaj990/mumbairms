var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
BannerModel = require('../../models/admin/Banner')
const { db } = require('../../models/admin/Banner');

exports.AddBanner = (req, res) => {
    var bannerModel = new BannerModel();
    bannerModel.restaurant = req.body.restaurant === 'undefined'?null:req.body.restaurant
    bannerModel.image = req.file.filename
    bannerModel.active_inactive = true ;
    bannerModel.status = true;
    bannerModel.save(function(err,data){
        var response={}
        if (err){
            response.code = 403
            response.status=false;
            response.error=err
            res(response)
        }else{
            response.code=200
            response.status=true;
            response.message="banner added successful !"
            response.data=data
            res(response)
        }
    }); 
};

exports.UpdateBannerImage = (req, res) => {
    BannerModel.findOne({_id:req.body._id},(err, result) => {
       if(result){
            db.collection('banners').findOneAndUpdate(
                {_id: new ObjectId(req.body._id)},    
                { $set:{image:req.file.filename,update_on:new Date()}},  
                { new: true }, 
                (err,result) => {
                    var response={}
                    if (result){
                        response.code=200;
                        response.status=true;
                        res(response)
                    }else{
                        response.code=403;
                        response.status=false;
                        res(err)
                    }
                }
            );
        }else{
            var response={}
            response.code=403;
            response.status=false;
            response.message= "Something went wrong !",
            res(err)
        } 
    }); 
}

exports.UpdateBanner = (req, res) => {
    BannerModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var response={}
            response.code = 403
            response.status=false;
            res(response)
        }else{
            const editData = {
                restaurant:req.body.restaurant === undefined?null:req.body.restaurant?new mongoose.mongo.ObjectID(req.body.restaurant):new mongoose.mongo.ObjectID(result.restaurant),
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
            }
            db.collection('banners').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
                {$set:editData},
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

exports.ListOfBanner = async(req, res) => {
    try {
       const bannerList = await BannerModel.find()
       .populate('restaurant')
       .exec() 
       if(req.body.search){
        if (req.body.search.length !== 0) {
            const filterData = bannerList.filter(
              data =>
                data.restaurant&&data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())
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
                data:bannerList
            })
        }
    }else{
        res.json({
            status :true,
            code:200,
            data:bannerList
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

exports.DeleteBanner = (req,res) => {
    BannerModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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
