var mongoose = require("mongoose");
CouponsModel = require('../../models/admin/Coupons')
const { db } = require('../../models/admin/Coupons');

exports.AddCoupons = (req, res) => {
    CouponsModel.findOne({code:req.body.code})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var couponsModel = new CouponsModel();
            couponsModel.title = req.body.title;
            couponsModel.coupon_type = req.body.coupon_type
            couponsModel.restaurant = req.body.restaurant === 'undefined'?null:req.body.restaurant
            couponsModel.menu = req.body.menu
            couponsModel.code = req.body.code
            couponsModel.start_date = req.body.start_date
            couponsModel.end_date = req.body.end_date
            couponsModel.discount_type = req.body.discount_type
            couponsModel.discount = req.body.discount
            couponsModel.max_discount = req.body.max_discount
            couponsModel.min_purchase = req.body.min_purchase
            couponsModel.image = req.file
            couponsModel.active_inactive = true ;
            couponsModel.status = true;
            couponsModel.save(function(err,data){
                var response={}
                if (err){
                    response.code = 404
                    response.status=false;
                    response.error=err
                    res(response)
                }else{
                    response.code=200
                    response.status=true;
                    response.message="Coupon added successful !"
                    response.data=data
                    res(response)
                }
            });
        }else{
            var response={}
            response.code = 403
            response.status=false;
            response.message='This code is already existed.'
            res(response)
        }
    })   
};

exports.ListOfCoupons = async(req, res) => {
    try {
        const couponsList = await CouponsModel.find()
        .populate('restaurant')
        .populate('menu')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = couponsList.filter(
                  data =>
                    data.title.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.code.toLowerCase().includes(req.body.search.toLowerCase())||
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
                    data:couponsList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:couponsList
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

exports.UpdateCoupons = (req, res) => {
    CouponsModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var response={}
            response.code = 403
            response.status=false;
            res(response)
        }else{
            const updateItem = {
                title: req.body.title?req.body.title:result.title,
                coupon_type: req.body.coupon_type?req.body.coupon_type:result.coupon_type,
                restaurant:req.body.restaurant === 'undefined'?null:req.body.restaurant?new mongoose.mongo.ObjectID(req.body.restaurant):new mongoose.mongo.ObjectID(result.restaurant),
                menu: req.body.menu?req.body.menu:result.menu,
                code: req.body.code?req.body.code:result.code,
                start_date: req.body.start_date?req.body.start_date:result.start_date,
                end_date: req.body.end_date?req.body.end_date:result.end_date,
                discount_type: req.body.discount_type?req.body.discount_type:result.discount_type,
                discount: req.body.discount?req.body.discount:result.discount,
                min_purchase: req.body.min_purchase?req.body.min_purchase:result.min_purchase,
                image: req.file?req.file:result.image,
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive, 
            }
            db.collection('coupons').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
                {$set:updateItem},
                {upsert: true,},
                (err,result) => {
                    if(err){
                        var response={}
                        response.code = 403
                        response.status=false;
                        res(response)
                    }else{
                        var response={}
                        response.code = 200
                        response.status=true;
                        res(response)
                    }
                }
            );

        }
    }) 
}

exports.DeletCoupons = (req,res) => {
    CouponsModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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

