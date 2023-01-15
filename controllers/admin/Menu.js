var mongoose = require("mongoose");
MenuModel = require('../../models/admin/Menu')
const { db } = require('../../models/admin/Menu');

exports.AddMenu = (req, res) => {
    var menuModel = new MenuModel();
    menuModel.restaurant = req.body.restaurant;
    menuModel.category = req.body.category
    menuModel.food_type = req.body.food_type
    menuModel.menu_name = req.body.menu_name
    menuModel.SKU = req.body.SKU
    menuModel.addons_categories = JSON.parse(req.body.addons_categories)
    menuModel.price = req.body.price
    menuModel.taxes = req.body.taxes
    menuModel.details = req.body.details
    menuModel.image = req.file
    menuModel.active_inactive = true ;
    menuModel.status = true;
    menuModel.save(function(err,data){
        var response={}
        if (err){
            response.code = 403
            response.status=false;
            response.error=err
            res(response)
        }else{
            response.code=200
            response.status=true;
            response.message="menu added successful !"
            response.data=data
            res(response)
        }
    });   
};

const _update_menuImage =(req, res)=>{
    db.collection('menus').findOneAndUpdate(
        {_id: new mongoose.mongo.ObjectID(req.body.id)},
        {$set:{'image': req.file}},
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

exports.UpdateMenu = (req, res) => {
    MenuModel.findOne({_id:req.body.id})
    .exec((err,result)=>{
        if(result === [] || result === null || result === undefined || result === {} || result === '[]' ){
            var response={}
            response.code = 403
            response.status=false;
            res(response)
        }else{
            const updateItem = {
                restaurant: req.body.restaurant?new mongoose.mongo.ObjectID(req.body.restaurant):new mongoose.mongo.ObjectID(result.restaurant),
                category: req.body.category?new mongoose.mongo.ObjectID(req.body.category):new mongoose.mongo.ObjectID(result.category),
                food_type: req.body.food_type?req.body.food_type:result.food_type,
                menu_name: req.body.menu_name?req.body.menu_name:result.menu_name,
                SKU: req.body.SKU?req.body.SKU:result.SKU,
                addons_categories: req.body.addons_categories?JSON.parse(req.body.addons_categories):result.addons_categories,
                price: req.body.price?req.body.price:result.price,
                taxes: req.body.taxes?req.body.taxes:result.taxes,
                details: req.body.details?req.body.details:result.details,
                active_inactive: req.body.active_inactive?req.body.active_inactive:result.active_inactive,
            }
            db.collection('menus').findOneAndUpdate(
                {_id: new mongoose.mongo.ObjectID(req.body.id)},
                {$set:updateItem},
                {upsert: true,},
                (err,result) => {
                    if(err){
                        var response={}
                        response.code = 403
                        response.status=false;
                        response.err=err
                        res(response)
                    }else{
                        if(req.file){
                            _update_menuImage(req,res)
                        }else{
                            var response={}
                            response.code = 200
                            response.status=true;
                            res(response)
                        }
                    }
                }
            );

        }
    }) 
}

exports.ListOfMenu = async(req, res) => {
    try {
        const menuList = await MenuModel.find()
        .populate('restaurant')
        .populate('category')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = menuList.filter(
                  data =>
                    data.menu_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.category.name.toLowerCase().includes(req.body.search.toLowerCase())
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
                    data:menuList
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:menuList
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

exports.RestaurantByMenuList = (req, res) => {
    MenuModel.find({restaurant:new mongoose.mongo.ObjectID(req.body.restaurant)})
    .populate('restaurant')
    .populate('category')
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

exports.MenuItemsList = (req, res) => {
    MenuModel.find({restaurant:new mongoose.mongo.ObjectID(req.body.restaurant),category:new mongoose.mongo.ObjectID(req.body.category)})
    .populate('restaurant')
    .populate('category')
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

exports.DeleteMenu = (req,res) => {
    MenuModel.findOneAndDelete({_id:req.body._id }, function (err, docs) {
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

exports.paginatedListOfMenu = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const { restaurant, search } = req.body;

        const query = restaurant ? { restaurant } : {};

        const total = await MenuModel.countDocuments(query);

        const menuList = await MenuModel.find(query)
        .sort({ _id: -1  })
        .limit(search === '' ? limit : 0)
        .skip(search === '' ? page * limit : 0)
        .populate('restaurant')
        .populate('category')
        .exec()
        if(req.body.search){
            if (req.body.search.length !== 0) {
                const filterData = menuList.filter(
                  data =>
                    data.menu_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.restaurant.restaurant_name.toLowerCase().includes(req.body.search.toLowerCase())||
                    data.category.name.toLowerCase().includes(req.body.search.toLowerCase())
                );
                res.json({
                    status :true,
                    code:200,
                    data:filterData,
                    total,
                    page,
                    pageSize: filterData.length,
                })
            } else {
                res.json({
                    status :true,
                    code:200,
                    data:menuList,
                    total,
                    page,
                    pageSize: menuList.length,
                })
            }
        }else{
            res.json({
                status :true,
                code:200,
                data:menuList,
                total,
                page,
                pageSize: menuList.length,
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