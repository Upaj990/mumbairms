var mongoose = require("mongoose");
InventoryModel = require('../../models/admin/Inventory')
const { db } = require('../../models/admin/Inventory');

exports.AddInventory = (req, res) => {
    var inventoryModel = new InventoryModel();
    inventoryModel.restaurant = req.body.restaurant;
    inventoryModel.stockType = req.body.stockType;
    inventoryModel.item_name=req.body.item_name;
    inventoryModel.food_type=req.body.food_type;
    inventoryModel.added_date_and_time=req.body.added_date_and_time;
    inventoryModel.total_amount=req.body.total_amount;
    inventoryModel.current_amount=req.body.current_amount;
    inventoryModel.remaining=req.body.remaining;
    inventoryModel.active_inactive = true ;
    inventoryModel.status = true;
    inventoryModel.save(function(err,data){
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
                message:'Inventory item Added !',
                data:data
            })
        } 
    });
};

exports.UpdateInventory = (req, res) => {
    db.collection('inventories').findOneAndUpdate(
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
exports.ListOfInventory = async(req, res) => {
    try {
        const inventoryList = await InventoryModel.find()
        .populate('restaurant')
        .populate('stockType')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = inventoryList.filter(
                  data =>
                    data.item_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.stockType.name.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:inventoryList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:inventoryList
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

exports.RestaurantByInventoryList = (req, res) => {
    InventoryModel.find({restaurant:new mongoose.mongo.ObjectID(req.body.restaurant)})
    .populate('restaurant')
    .populate('stockType')
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

exports.InventoryItemsList = (req, res) => {
    InventoryModel.find({restaurant:new mongoose.mongo.ObjectID(req.body.restaurant),stockType:new mongoose.mongo.ObjectID(req.body.stockType)})
    .populate('restaurant')
    .populate('stockType')
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

exports.DeleteInventory = (req,res) => {
    InventoryModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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