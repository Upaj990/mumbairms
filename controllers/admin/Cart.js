var mongoose = require("mongoose");
CartModel = require('../../models/admin/Cart')
const { db } = require('../../models/admin/Cart');

exports.AddUpdateCart = (req, res) => {
    CartModel.findOne({user:req.body.user})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            console.log('if')
            var cartModel = new CartModel();
            cartModel.user = req.body.user
            cartModel.food_items = JSON.parse(req.body.food_items)
            cartModel.status = true;
            cartModel.save(function(err,data){
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
        }
        else {
            console.log('else')
            const updateItem = {
                user: req.body.user?new mongoose.mongo.ObjectID(req.body.user):new mongoose.mongo.ObjectID(result.user),
                food_items:req.body.food_items?JSON.parse(req.body.food_items):result.food_items,
                update_on:new Date(),
            }
            db.collection('carts').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(result._id)},
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
};

exports.CartDetails = (req, res) => {
    CartModel.findOne({user:req.body.user})
    .populate('user')
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

exports.DeleteCart = (req,res) => {
    CartModel.findOne({user:req.body.user})
    .populate('user')
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                code:403,
                status :false,
            }) 
        }
        else {
            CartModel.findOneAndDelete({_id:result._id}, function (err, docs) {
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
    })
}

