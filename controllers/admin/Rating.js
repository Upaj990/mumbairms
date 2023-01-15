var mongoose = require("mongoose");
RatingModel = require('../../models/admin/Rating')
const { db } = require('../../models/admin/Rating');

exports.AddRating = (req, res) => {
    RatingModel.findOne({user:req.body.user})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            if(req.body.rating_value <= 5 && req.body.rating_value >= 1){
                var ratingModel = new RatingModel();
                ratingModel.user = req.body.user
                ratingModel.restaurant = req.body.restaurant
                ratingModel.rating_value = req.body.rating_value;
                ratingModel.status = true;
                ratingModel.save(function(err,data){
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
                            data:data
                        })
                    } 
                });
            }else{
                res.json({
                    status :false,
                    code:403,
                    massage:'Please select 1 to 5 stars'
                })
            }
        }
        else {
            res.json({
                status :false,
                code:403,
                massage:'Already added..!!'
            })
        }
    }) 
};

exports.ExistingRating = (req, res) => {
    RatingModel.findOne({user:req.body.user})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                status :false,
                code:403,
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
};

exports.RatingValueForRestaurant = (req, res) => {
    RatingModel.find({restaurant:req.body.restaurant})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                status :true,
                code:200,
                data:{
                    restaurant_rating_Value:0,
                    no_of_users:0
                }
            })
        }
        else {
            const total_value = result.length*5
            const rating_value = result.map((a)=>a.rating_value).reduce((acc, amount) => Number(acc)+Number(amount))
            res.json({
                status :true,
                code:200,
                data:{
                    restaurant_rating_Value:rating_value*5/total_value,
                    no_of_users:result.length
                }
            })
        }
    }) 
};


