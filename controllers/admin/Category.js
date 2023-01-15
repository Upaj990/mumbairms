var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
CategoryModel = require('../../models/admin/Category')
const { db } = require('../../models/admin/Category');

exports.AddCategory = (req, res) => {
    CategoryModel.findOne({name:req.body.name},(err, result) => {
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var categoryModel = new CategoryModel();
            categoryModel.name = req.body.name;
            categoryModel.image = req.file.filename
            categoryModel.active_inactive = true ;
            categoryModel.status = true;
            categoryModel.save(function(err,data){
                var response={}
                if (err){
                    response.code = 403
                    response.status=false;
                    response.error=err
                    res(response)
                }else{
                    response.code=200
                    response.status=true;
                    response.message="Category added successful !"
                    response.data=data
                    res(response)
                }
            });  
        }else{
            var response={}
            response.code=403
            response.status=false;
            response.message="Already added this Category !"
            res(response)
        }
    }) 
};

exports.UpdateCategoryImage = (req, res) => {
    CategoryModel.findOne({_id:req.body._id},(err, result) => {
       if(result){
            db.collection('categories').findOneAndUpdate(
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

exports.UpdateCategory = (req, res) => {
    db.collection('categories').findOneAndUpdate(
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

exports.ListOfCategory = async(req, res) => {
    try {
        const categoryList = await CategoryModel.find().exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = categoryList.filter(
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
                    data:categoryList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:categoryList
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

exports.DeleteCategory = (req,res) => {
    CategoryModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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


