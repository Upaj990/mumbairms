const mongoose = require("mongoose");
const TableModel = require('../../models/admin/Table')
const { db } = require('../../models/admin/Table');
const QRCode = require('qrcode')

exports.AddTable = (req, res) => {
    TableModel.findOne({restaurant:req.body.restaurant,table_no:req.body.table_no})
    .exec((err,result)=>{
        console.log(result)
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            const tableModel = new TableModel();
            tableModel.restaurant = req.body.restaurant;
            tableModel.table_no = req.body.table_no;
            QRCode.toDataURL(JSON.stringify(tableModel),function (err, url){ 
                tableModel.capacity_people = req.body.capacity_people
                tableModel.qr_code = url
                tableModel.active_inactive = true ;
                tableModel.status = true;
                tableModel.save(function(err,data){
                    if (err){
                        res.json({
                            code:404,
                            status :false,
                            error:err
                        })
                    }else{
                        res.json({
                            code:200,
                            status :true,
                            message:"Table added successful !",
                            data:data
                        })
                    }
                })
            })
        }else{
            res.json({
                code:403,
                status :false,
                message:'This table already exists.',
                error:err
            })
        }
    })
};

exports.UpdateTable = (req, res) => {
    TableModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            res.json({
                code:404,
                status :false,
                error:err
            })
        }else{
            const updateItem = {
                restaurant:req.body.restaurant?new mongoose.mongo.ObjectID(req.body.restaurant):new mongoose.mongo.ObjectID(result.restaurant),
                table_no: req.body.table_no?req.body.table_no:result.table_no,
                capacity_people: req.body.capacity_people?req.body.capacity_people:result.capacity_people,
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
            }
            db.collection('tables').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
                {$set:updateItem},
                {upsert: true,},
                (err,result) => {
                    if(err){
                        res.json({
                            code:404,
                            status :false,
                            error:err
                        })
                    }else{
                        res.json({
                            code:200,
                            status :true,
                        })
                    }
                }
            );
        }
    }) 
}

exports.RestaurantByTableList = (req, res) => {
    TableModel.find({restaurant:new mongoose.mongo.ObjectID(req.body.restaurant)})
    .populate('restaurant')
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

exports.ListOfTable = async(req, res) => {
    try {
        const tableList = await TableModel.find()
        .populate('restaurant')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = tableList.filter(
                  data =>
                    data.table_no.toString().includes(req.body.search)||
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
                    data:tableList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:tableList
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

exports.DeleteTable = (req,res) => {
    TableModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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