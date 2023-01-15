var mongoose = require("mongoose");
RestaurantyModel = require('../../models/admin/Restaurant')
const { db } = require('../../models/admin/Restaurant');

const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|  (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.AddResturant = (req, res) => {
    if(validateEmail.test(String(req.body.restaurant_email).toLowerCase())==true) {
        RestaurantyModel.findOne({restaurant_contact_number:req.body.restaurant_contact_number})
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                RestaurantyModel.findOne({restaurant_email:req.body.restaurant_email})
                .exec((err,result)=> {
                    if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                        var restaurantyModel = new RestaurantyModel();
                        restaurantyModel.manager = req.body.manager;
                        restaurantyModel.restaurant_name = req.body.restaurant_name
                        restaurantyModel.restaurant_contact_number = req.body.restaurant_contact_number
                        restaurantyModel.restaurant_email = req.body.restaurant_email
                        restaurantyModel.food_type = req.body.food_type
                        restaurantyModel.restaurant_address = JSON.parse(req.body.restaurant_address)
                        restaurantyModel.latLong = JSON.parse(req.body.latLong)
                        restaurantyModel.cuisines = req.body.cuisines
                        restaurantyModel.GSTIN_number = req.body.GSTIN_number
                        restaurantyModel.GST_state = req.body.GST_state  
                        restaurantyModel.FSSAI_number = req.body.FSSAI_number
                        restaurantyModel.aadhar_copy = req.files['aadhar_copy'][0]
                        restaurantyModel.pan_copy = req.files['pan_copy'][0]
                        restaurantyModel.IGST_toggle = req.body.IGST_toggle
                        restaurantyModel.IGST_amount = req.body.IGST_amount
                        restaurantyModel.IGST_type = req.body.IGST_type
                        restaurantyModel.SGST_toggle = req.body.SGST_toggle
                        restaurantyModel.SGST_amount = req.body.SGST_amount
                        restaurantyModel.SGST_type = req.body.SGST_type
                        restaurantyModel.CGST_toggle = req.body.CGST_toggle
                        restaurantyModel.CGST_amount = req.body.CGST_amount
                        restaurantyModel.CGST_type = req.body.CGST_type
                        restaurantyModel.service_tax_toggle = req.body.service_tax_toggle
                        restaurantyModel.service_tax_amount = req.body.service_tax_amount
                        restaurantyModel.service_tax_type = req.body.service_tax_type
                        restaurantyModel.restaurant_timings = JSON.parse(req.body.restaurant_timings)
                        restaurantyModel.closed_on = req.body.closed_on
                        restaurantyModel.bill_width = req.body.bill_width
                        restaurantyModel.restaurant_logo = req.files['restaurant_logo'][0]
                        restaurantyModel.restaurant_cover_photo = req.files['restaurant_cover_photo'][0]
                        restaurantyModel.active_inactive = true ;
                        restaurantyModel.save(function(err,data){
                            var response={}
                            if (err){
                                response.code = 403
                                response.status=false;
                                response.error=err
                                res(response)
                            }else{
                                response.code=200
                                response.status=true;
                                response.message="Restaurant added successful."
                                response.data=data
                                res(response)
                            }
                        }); 
                    }else{
                        var response={}
                        response.code = 404
                        response.status=false;
                        response.message="This email address already exists."
                        res(response)
                    }
                })
            }else{
                var response={}
                response.code = 404
                response.status=false;
                response.message="This contact number already exists."
                res(response)
            }
        })
    }else{
        var response={}
        response.code = 404
        response.status=false;
        response.message="Please enter valid email address !"
        res(response)
    }
};

exports.UpdateRestaurant = (req, res) => {
    RestaurantyModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var response={}
            response.code = 403
            response.status=false;
            res(response)
        }else{
            const updateItem = {
                manager: req.body.manager?req.body.manager:result.manager,
                restaurant_name: req.body.restaurant_name?req.body.restaurant_name:result.restaurant_name,
                // restaurant_contact_number: req?.body?.restaurant_contact_number,
                // restaurant_email: req?.body?.restaurant_email,
                food_type: req.body.food_type?req.body.food_type:result.food_type,
                restaurant_address:req.body.restaurant_address?JSON.parse(req.body.restaurant_address):result.restaurant_address,
                latLong: req.body.latLong?JSON.parse(req.body.latLong):result.latLong,
                cuisines: req.body.cuisines?req.body.cuisines:result.cuisines,
                GSTIN_number: req.body.GSTIN_number?req.body.GSTIN_number:result.GSTIN_number,
                GST_state: req.body.GST_state?req.body.GST_state:result.GST_state,
                FSSAI_number: req.body.FSSAI_number?req.body.FSSAI_number:result.FSSAI_number,
                aadhar_copy: req.files['aadhar_copy']?req.files['aadhar_copy'][0]:result.aadhar_copy,
                pan_copy: req.files['pan_copy']?req.files['pan_copy'][0]:result.pan_copy,
                IGST_toggle: req.body.IGST_toggle?req.body.IGST_toggle:result.IGST_toggle,
                IGST_amount: req.body.IGST_toggle?req.body.IGST_amount:result.IGST_amount,
                IGST_type: req.body.IGST_type?req.body.IGST_type:result.IGST_type,
                SGST_toggle: req.body.SGST_toggle?req.body.SGST_toggle:result.SGST_toggle,
                SGST_amount: req.body.SGST_toggle?req.body.SGST_amount:result.SGST_amount,
                SGST_type: req.body.SGST_type?req.body.SGST_type:result.SGST_type,
                CGST_toggle: req.body.CGST_toggle?req.body.CGST_toggle:result.CGST_toggle,
                CGST_amount: req.body.CGST_toggle?req.body.CGST_amount:result.CGST_amount,
                CGST_type: req.body.CGST_type?req.body.CGST_type:result.CGST_type,
                service_tax_toggle: req.body.service_tax_toggle?req.body.service_tax_toggle:result.service_tax_toggle,
                service_tax_amount: req.body.service_tax_toggle?req.body.service_tax_amount:result.service_tax_amount,
                service_tax_type: req.body.service_tax_type?req.body.service_tax_type:result.service_tax_type,
                restaurant_timings: req.body.restaurant_timings?JSON.parse(req.body.restaurant_timings):result.restaurant_timings,
                closed_on: req.body.closed_on?req.body.closed_on:result.closed_on,
                bill_width: req.body.bill_width?req.body.bill_width:result.bill_width,
                restaurant_logo: req.files['restaurant_logo']?req.files['restaurant_logo'][0]:result.restaurant_logo,
                restaurant_cover_photo: req.files['restaurant_cover_photo']?req.files['restaurant_cover_photo'][0]:result.restaurant_cover_photo,
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
            }
            db.collection('restaurants').findOneAndUpdate(
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

exports.ListOfRestaurant = async(req, res) => {
    try {
        const restaurantList = await RestaurantyModel.find()
        .populate('manager')
        .populate('cuisines')
        .populate('closed_on')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = restaurantList.filter(
                  data =>
                    data.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant_email.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant_contact_number.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:restaurantList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:restaurantList
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

exports.RestaurantDetails = (req, res) => {
    RestaurantyModel.findOne({_id:req.body._id})
    .populate('manager')
    .populate('cuisines')
    .populate('closed_on')
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

exports.DeleteRestaurant = (req,res) => {
    RestaurantyModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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