var mongoose = require("mongoose");
UsersModel = require('../../models/app/Users')
const { db } = require('../../models/app/Users');
var ObjectId = require('mongodb').ObjectID;

var jwt = require('jsonwebtoken');
var tokenelemtns = {
    "Secret":"userSecretData",
    "Life":31500000
};

const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|  (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.Register = (req, res) => {
    UsersModel.findOne({'phone': req.body.phone},(err, result) => {
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var usersModel = new UsersModel();
            usersModel.name = req.body.name;
            usersModel.phone = req.body.phone;
            usersModel.email = req.body.email;
            usersModel.gender = req.body.gender  
            usersModel.date_of_birth = req.body.date_of_birth
            usersModel.preference = req.body.preference
            usersModel.device_uid = req.body.device_uid
            usersModel.os = req.body.os
            usersModel.fcm_token = req.body.fcm_token
            usersModel.login_source = req.body.login_source
            usersModel.active_inactive = true 
            usersModel.status = true
            usersModel.restaurants = req.body.restaurants;
            usersModel.save(function(err,data){
                if(err) return res.json(err);
                res.json({
                    code:200,
                    status: true,
                    message: "Register Successful",
                    data: data
                });
            });
        }else{
            if (req.body.restaurants) result.restaurants = Array.from(new Set([...result.restaurants.map(r => r.toString()), ...req.body.restaurants]));
            result.save(function(err, data){
                if (err) return res.json(err)
                res.json({
                    code:200,
                    status: true,
                    data: result,
                    message: "This mobile number is already registered. Restaurants updated",
                });
            })
        } 
    })
};

exports.Login = (req, res) => {
    UsersModel.findOne({phone: req.body.phone},(err, result) => {
        if (result) {
            var payload = {}
            payload._id = result._id;
            payload.phone = result.phone;
            var token = jwt.sign(payload,tokenelemtns.Secret,{expiresIn:tokenelemtns.Life});
            res.json({
                status :true,
                code:200,
                message:"Login success",
                data:result,
                token:token,
            })
        }
        else {
            res.json({
                code:403,
                status:false,
                message:"Please check your phone number and try again.",
            })
        }
    });
}

exports.SocialLogin = (req, res) => {
    if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
        UsersModel.findOne({email:req.body.email})
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                var usersModel = new UsersModel();
                usersModel.social_uid = req.body.social_uid;
                usersModel.name = req.body.name;
                usersModel.profile = req.body.profile;
                usersModel.email = req.body.email;
                usersModel.gender = req.body.gender
                usersModel.date_of_birth = req.body.date_of_birth
                usersModel.preference = req.body.preference
                usersModel.device_uid = req.body.device_uid
                usersModel.os = req.body.os
                usersModel.fcm_token = req.body.fcm_token
                usersModel.login_source = req.body.login_source
                usersModel.active_inactive = true
                usersModel.status = true
                usersModel.save(function(err,data){
                    if(err){
                        res.json(err);
                    }else{
                        var payload = {}
                        payload._id = data._id;
                        payload.email = data.email;
                        var token = jwt.sign(payload,tokenelemtns.Secret,{expiresIn:tokenelemtns.Life});
                        res.json({
                            code:200,
                            status: true,
                            message: "Register successful",
                            data: data,
                            token:token
                        });
                    }
                });
            }else{
                if(err){
                    res.json(err);
                }else{
                    const updateItem = {
                        //'name': req.body.name,
                        //'profile': req.body.profile,
                        //'email': req.body.email,
                        'fcm_token': req.body.fcm_token,
                        'os': req.body.os,
                        'device_uid':req.body.device_uid,
                        'login_source': req.body.login_source,
                    }
                    db.collection('users').findOneAndUpdate(
                        {_id: new ObjectId(result._id)},
                        {$set:updateItem},
                        {upsert: true,},
                        (err,response) => {
                            console.log(response)
                            UsersModel.findOne({email:req.body.email})
                            .exec((err,result)=> {
                                if(result){
                                    var payload = {}
                                    payload._id = result._id;
                                    payload.email = result.email;
                                    var token = jwt.sign(payload,tokenelemtns.Secret,{expiresIn:tokenelemtns.Life});
                                    res.json({
                                        code:200,
                                        status: true,
                                        message: "Login success",
                                        data:result,
                                        token:token
                                    });
                                }else{
                                    res.json({
                                        code:403,
                                        status: false,
                                        message: "Something went wrong",
                                        data:result,
                                        token:token
                                    });
                                }
                            })
                        }
                    );
                }
            }
        })
    }else{
        res.json({
            code:403,
            status: false,
            message: "Please enter valid email address",
        });
    }
};

exports.ValidatePhone = (req, res) => {
    UsersModel.findOne({phone:req.body.phone})
    .exec((err,result)=> {
        console.log(result)
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
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
    })
}

exports.ValidateEmail = (req, res)=>{
    if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
        UsersModel.findOne({email:req.body.email})
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                res.json({
                    status :true,
                    code:200,
                })
            }else{
                res.json({
                    status :false,
                    code:403,
                    message:'This email address is already registered'

                })
            }
        })
    }else{
        res.json({
            code:403,
            status: false,
            message: "Please enter valid email address",
        });
    }
}

exports.UserDetails = (req, res) => {
    UsersModel.findOne({_id:req.body._id})
    .exec((err,result)=>{
        if (result) {
            res.json({
                status :true,
                code:200,
                data:result
            })
        }
        else {
            res.json({
                code:403,
                status :false,
            })
        }
    })
}

exports.ListOfUsers = async(req, res) => {
    try {
        const userList = req.body.restaurant ? await UsersModel.find({restaurants: req.body.restaurant}).exec() : await UsersModel.find().exec();
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = userList.filter(
                  data =>
                    data.name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.phone.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.email.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:userList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:userList
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

exports.UpdateProfile = (req, res) => {
    UsersModel.findOne({_id:req.body._id},(err, result) => {
       if(result){
            db.collection('users').findOneAndUpdate(
                {_id: new ObjectId(req.body._id)},    
                { $set:{profile:req.file.filename,update_on:new Date()}},  
                { new: true }, 
                (err,result) => {
                    var response={}
                    if (result){
                        response.code=200;
                        response.status=true;
                        response.message= "profile update successful",
                        res(response)
                    }else{
                        response.code=403;
                        response.status=false;
                        response.message="Error"
                        res(err)
                    }
                }
            );
        }else{
            var response={}
            response.code=403;
            response.status=false;
            response.message= "Something went wrong",
            res(err)
        }
       
    }); 
}

const _updateUser =(req, res,result)=>{
    const updateItem = {
        name: req.body.name?req.body.name:result.name,
        phone: req.body.phone?req.body.phone:result.phone,
        email: req.body.email?req.body.email:result.email,
        gender: req.body.gender?req.body.gender:result.gender,
        date_of_birth: req.body.date_of_birth?req.body.date_of_birth:result.date_of_birth,
        preference: req.body.preference?req.body.preference:result.preference,
        device_uid: req.body.device_uid?req.body.device_uid:result.device_uid,
        os: req.body.os?req.body.os:result.os,
        fcm_token: req.body.fcm_token?req.body.fcm_token:result.fcm_token,
        login_source: req.body.login_source?req.body.login_source:result.login_source,
        active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
    }
    db.collection('users').findOneAndUpdate(
        {_id: new mongoose.mongo.ObjectID(req.body.id)},
        {$set:updateItem},
        {upsert: true,},
        (err,result) => {
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

const _existPhone = (req,res,result)=>{
    UsersModel.findOne({phone:req.body.phone})
    .exec((err,result_phone)=> {
        if(result_phone === [] || result_phone === null || result_phone === undefined || result_phone === {} || result_phone === '[]' ){
            _existEmail(req,res,result)
        }else{
            if(result.phone === req.body.phone){
                _existEmail(req,res,result)
            }else{
                res.json({
                    status :false,
                    code:403,
                    message:'This mobile number is already exist'
                })
            }
        }
    })
}

const _existEmail = (req,res,result)=>{
    if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
        UsersModel.findOne({email:req.body.email})
        .exec((err,result_email)=> {
            if(result_email === [] || result_email === null || result_email === undefined || result_email === {} || result_email === '[]' ){
                _updateUser(req,res,result)
            }else{
                if(result.email === req.body.email){
                    _updateUser(req,res,result)
                }else{
                    res.json({
                        status :false,
                        code:403,
                        message:'This email address is already exist'
    
                    })
                }
            }
        })
    }else{
        res.json({
            code:403,
            status: false,
            message: "Please enter valid email address",
        });
    } 
}

exports.ValidatePhoneEmail = (req,res,result)=>{
    UsersModel.findOne({phone:req.body.phone})
    .exec((err,result_phone)=> {
        if(result_phone === [] || result_phone === null || result_phone === undefined || result_phone === {} || result_phone === '[]' ){
            if(req.body.email){
                if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
                    UsersModel.findOne({email:req.body.email})
                    .exec((err,result_email)=> {
                        if(result_email === [] || result_email === null || result_email === undefined || result_email === {} || result_email === '[]' ){
                            res.json({
                                status :true,
                                code:200,
            
                            })
                        }else{
                            result_email.restaurants = Array.from(new Set([...result_email.restaurants.map(r => r.toString()), ...req.body.restaurants]));
                            result_email.save(function(err,result){
                                if (err) return res.json(err)
                                res.json({
                                    status :true,
                                    code:200,
                                    data: result_email,
                                    message:'This email address already exist. Restaurant list updated'
                                })
                            })
                        }
                    })
                }else{
                    res.json({
                        code:403,
                        status: false,
                        message: "Please enter valid email address",
                    });
                }
            }else{
                res.json({
                    status :true,
                    code:200,
                })
            } 
        }else{
            result_phone.restaurants = Array.from(new Set([...result_phone.restaurants.map(r => r.toString()), ...req.body.restaurants]));
            result_phone.save(function(err,result){
                if (err) return res.json(err)
                res.json({
                    status :true,
                    code:200,
                    data: result_phone,
                    message:'This mobile number is already exist. Restaurant list updated'
                })
            })
        }
    })
}


exports.UpdateUserDetails = (req, res) => {
    UsersModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                status :false,
                code:403,
            })
        }else{
            if(req.body.phone ||  req.body.email){
                if(result.phone === req.body.phone && result.email === req.body.email){
                    _updateUser(req,res,result)
                }else{
                    _existPhone(req,res,result)
                }
            }else{
                _updateUser(req,res,result)
            }
        }

    })
}

exports.DeleteUser = (req,res) => {
    UsersModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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

