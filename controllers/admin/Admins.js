var mongoose = require("mongoose");
AdminsModel = require('../../models/admin/Admins')
const { db } = require('../../models/admin/Admins');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var tokenelemtns = {
    "Secret":"admin",
    "Life":31500000
};

const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|  (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.Register = (req, res) => {
    if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
        var condition = {
            $or: [
                {email:req.body.email},
                {phone:req.body.phone},
            ]
        }
        AdminsModel.findOne(condition)
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                var adminsModel = new AdminsModel();
                adminsModel.name = req.body.name;
                adminsModel.profile = req.file.filename;
                adminsModel.email = req.body.email;
                adminsModel.phone = req.body.phone;
                adminsModel.restaurant = req.body.restaurant;
                var hash = bcrypt.hashSync(req.body.password,saltRounds);
                adminsModel.password = hash;
                adminsModel.admin_type = req.body.admin_type;
                adminsModel.active_inactive = true;
                adminsModel.status = true;
                adminsModel.save(function(err,data){
                    var response={}
                    if (err){
                        response.code = 404
                        response.status=false;
                        response.message="Error"
                        res(response)
                    }else{
                        response.code=200
                        response.status=true;
                        response.message="Register successful !"
                        response.data=data
                        res(response)
                    } 
                });
            }else{
                var response={}
                response.code = 404
                response.status=false;
                response.message="You are already registered !"
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

exports.UpdateProfile = (req, res) => {
    AdminsModel.findOne({_id:req.body._id},(err, result) => {
       if(result){
            db.collection('admins').findOneAndUpdate(
                {_id: new ObjectId(req.body._id)},    
                { $set:{profile:req.file.filename,update_on:new Date()}},  
                { new: true }, 
                (err,result) => {
                    var response={}
                    if (result){
                        response.code=200;
                        response.status=true;
                        response.message= "profile update successful !",
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
            response.message= "Something went wrong !",
            res(err)
        } 
    }); 
}

exports.UpdateIdentityProof = (req, res) => {
    AdminsModel.findOne({_id:req.body._id},(err, result) => {
       if(result){
            db.collection('admins').findOneAndUpdate(
                {_id: new ObjectId(req.body._id)},    
                { $set:{identity_proof:req.file.filename,update_on:new Date()}},  
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
                        response.error=err
                        res(err)
                    }
                }
            );
        }else{
            var response={}
            response.code=403;
            response.status=false;
            response.error=err
            res(err)
        }
    }); 
}


exports.Login = (req, res) => {
    if(validateEmail.test(String(req.body.email).toLowerCase())==true) {
        AdminsModel.findOne({email:req.body.email})
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                res.json({
                    code:403,
                    status: false,
                    message: "This email is not registered, please Signup to continue !",
                });
            }else{
                const pass = bcrypt.compareSync(req.body.password,result.password);
                if(pass){
                    var payload = {}
                    payload._id = result._id;
                    payload.phone = result.phone;
                    payload.email = result.email;
                    var token = jwt.sign(payload,tokenelemtns.Secret,{expiresIn:tokenelemtns.Life});
                    res.json({
                        status :true,
                        code:200,
                        message:"Login success !",
                        data:result,
                        token:token,
                    })
                }else{
                    res.json({
                        code : 403,
                        status:false,
                        message:"The password you entered is incorrect, Please try again !",
                    })
                }
            }
        });
    }else{
        res.json({
            code:403,
            status: false,
            message: "Please enter valid email address !",
        });
    }
}

exports.AdminDetails = (req, res) => {
    const decoded = jwt.decode(req.headers.authorization, {complete: true});
    if(decoded){
        AdminsModel.findOne({_id:decoded.payload._id})
        .populate('restaurant')
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
    }else{
        res.json({
            code:403,
            status :false,
        }) 
    }
}

const _updateAdmin = (req, res)=>{
    AdminsModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                status :false,
                code:403,
            })
        }else{
            const updateItem = {
                name:req.body.name?req.body.name:result.name,
                profile:result.profile,
                email:req.body.email?req.body.email:result.email,
                phone:Number(req.body.phone)?Number(req.body.phone):Number(result.phone),
                restaurant:result.admin_type === 'SUPER'?null:req.body.restaurant?new mongoose.mongo.ObjectID(req.body.restaurant):new mongoose.mongo.ObjectID(result.restaurant),
                password:req.body.password?req.body.password:result.password,
                identity_proof:result.identity_proof,
                admin_type:result.admin_type,
                active_inactive:req.body.active_inactive?req.body.active_inactive:result.active_inactive,
                update_on:new Date()
            }
            db.collection('admins').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
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
    
}

exports.UpdateAdminsDetails = (req, res) => {
    if(validateEmail.test(String(req.body.email).toLowerCase())==true || !req.body.email) {
        AdminsModel.findOne({email:req.body.email})
        .exec((err,result)=> {
            if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
                _updateAdmin(req, res)
            }else{
                if(result._id.toString() === req.body.id){
                   _updateAdmin(req, res)
                }else{
                    res.json({
                        status :false,
                        code:403,
                        message:"This email is already registered !"
                    })
                } 
            }
        })
    }else{
        res.json({
            code:403,
            status: false,
            message: "Please enter valid email address !",
        });
    } 
}

exports.UpdateAdminsPassword = (req, res) => {
    var hash = bcrypt.hashSync(req.body.password,saltRounds);
    db.collection('admins').findOneAndUpdate(
        {_id: new mongoose.mongo.ObjectID(req.body.id)},
        { $set:{password:hash,update_on:new Date()}},  
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

exports.UpdateAdminsPasswordWithOldPassword = (req, res) => {
    AdminsModel.findOne({_id:req.body.id})
    .exec((err,result)=> {
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                code:403,
                status: false,
            });
        }else{
            const old_password = bcrypt.compareSync(req.body.old_password,result.password);
            if(old_password){
                const new_password = bcrypt.hashSync(req.body.new_password,saltRounds);
                db.collection('admins').findOneAndUpdate(
                    {_id: new mongoose.mongo.ObjectID(req.body.id)},
                    { $set:{password:new_password,update_on:new Date()}},  
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
                                message:'Update password successful.'
                            })
                        }
                    }
                );
            }else{
                res.json({
                    status :false,
                    code:403,
                    message:'The old password you entered is incorrect, Please try again !'
                })
            }
        }
    })
}

exports.DeleteAdmins = (req,res) => {
    AdminsModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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

exports.ListOfManagers = async(req, res) => {
    try {
        const managerList = await AdminsModel.find({admin_type:'MANAGER'})
        .populate('restaurant')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = managerList.filter(
                  data =>
                    data.name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.phone.toString().includes(req.body.search)||
                    data.email.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:managerList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:managerList
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

exports.ListOfWaiters = async(req, res) => {
    try {
        const managerList = await AdminsModel.find({admin_type:'WAITER'})
        .populate('restaurant')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = managerList.filter(
                  data =>
                    data.name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.phone.toString().includes(req.body.search)||
                    data.email.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:managerList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:managerList
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

exports.ListOfChefs = async(req, res) => {
    try {
        const chefList = await AdminsModel.find({admin_type:'CHEF'})
        .populate('restaurant')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = chefList.filter(
                  data =>
                    data.name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.phone.toString().includes(req.body.search)||
                    data.email.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:chefList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:chefList
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


