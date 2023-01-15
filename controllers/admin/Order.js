var mongoose = require('mongoose');
OrderModel = require('../../models/admin/Order');
UsersModel = require('../../models/app/Users');
const { db } = require('../../models/admin/Order');
const fs = require('fs');
const moment = require('moment');
const { sendCurlNotification } = require('../../services/helper');

const _addKot = (req, res, item) => {
  OrderModel.findOne({ _id: item._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        res.render(
          'Kot',
          { item: result, moment: moment, host: process.env.HOST },
          function (err, str) {
            const _filePath = `./upload/kot/${Date.now()}.pdf`;
            var options = {
              height: '110mm', // allowed units: mm, cm, in, px
              width: '49mm',
              path: _filePath,
            };
            // _pdf.generatePdf({ content: str }, options, (err, buffer) => {
            //   if (err) console.log(err);
            //   const contents = fs.readFileSync(_filePath, {
            //     encoding: 'base64',
            //   });
            console.log('KOT added');
            const updateItem = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              kot: str,
            };
            db.collection('orders').findOneAndUpdate(
              { _id: new mongoose.mongo.ObjectID(item._id) },
              { $set: updateItem },
              { upsert: true },
              (err, result) => {
                if (err) {
                  res.json({
                    status: false,
                    code: 403,
                    error: err,
                  });
                } else {
                  // fs.unlinkSync(_filePath);
                  res.json({
                    status: true,
                    code: 200,
                    message: 'Add new order successful.',
                  });
                }
              }
            );
            // });
          }
        );
      }
    });
};

const _addBill = (req, res, item) => {
  OrderModel.findOne({ _id: item._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        res.render(
          'Bill',
          { item: result, moment: moment, host: process.env.HOST },
          function (err, str) {
            const _filePath = `./upload/bill/${Date.now()}.pdf`;
            var options = {
              height: '160mm', // allowed units: mm, cm, in, px
              width: '49mm',
              path: _filePath,
            };
            // _pdf.generatePdf({ content: str }, options, (err, buffer) => {
            //   if (err) console.log(err);
            //   const contents = fs.readFileSync(_filePath, {
            //     encoding: 'base64',
            //   });
            console.log('Bill added');
            const updateItem = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              bill: str,
            };
            db.collection('orders').findOneAndUpdate(
              { _id: new mongoose.mongo.ObjectID(item._id) },
              { $set: updateItem },
              { upsert: true },
              (err, result) => {
                if (err) {
                  res.json({
                    status: false,
                    code: 403,
                    error: err,
                  });
                } else {
                  // fs.unlinkSync(_filePath);
                  _addKot(req, res, result.value);
                }
              }
            );
            // });
          }
        );
      }
    });
};

exports.AddOrder = (req, res) => {
  OrderModel.find().exec((err, result) => {
    var orderModel = new OrderModel();
    orderModel.order_id =
      result.length === 0 ? 1 : result[result.length - 1].order_id + 1;
    orderModel.user = req.body.user;
    orderModel.restaurant = req.body.restaurant;
    orderModel.table = req.body.table;
    orderModel.waiter = req.body.waiter;
    orderModel.order_type = req.body.order_type;
    orderModel.food_items = JSON.parse(req.body.food_items);
    orderModel.food_items_for_kot = JSON.parse(req.body.food_items);
    orderModel.subtotal = req.body.subtotal;
    orderModel.IGST_amount = req.body.IGST_amount;
    orderModel.SGST_amount = req.body.SGST_amount;
    orderModel.CGST_amount = req.body.CGST_amount;
    orderModel.service_tax_amount = req.body.service_tax_amount;
    orderModel.total = req.body.total;
    orderModel.order_status = req.body.order_status;
    orderModel.order_history = req.body.order_history;
    orderModel.payment_status = req.body.payment_status;
    orderModel.order_date_and_time = req.body.order_date_and_time;
    orderModel.instructions = req.body.instructions;
    orderModel.status = true;
    orderModel.save(function (err, data) {
      if (err) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        sendCurlNotification(
          'hello',
          'hello',
          'hello',
          'fj0HrijISd6lymJyZVYINq:APA91bEt3aFZqEvSAMgLoU8-7UnEOlQ_zd8bAQ9dyanHNp_VYgws9S1RAQ_HNZfpuNrahbyoJ2Syec_mm_6FDy4-mWvMqwg8wiXwH59L8X9qA9N8-Vm5RluZQ2Qph64QZuIw-cvBIEmW'
        );
        _addBill(req, res, data);
      }
    });
  });
};

const _updateKot = (req, res, item, food_items_result) => {
  OrderModel.findOne({ _id: item._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        food_items_result.forEach((i) => {
          const toUpdate = result.food_items_for_kot.findIndex(
            (x) => x._id === i._id
          );
          if (toUpdate >= 0) {
            result.food_items_for_kot[toUpdate].quantity =
              result.food_items_for_kot[toUpdate].quantity - i.quantity;
          }
        });
        //console.log(result.food_items_for_kot,'oookkk')
        res.render(
          'Kot',
          { item: result, moment: moment, host: process.env.HOST },
          function (err, str) {
            const _filePath = `./upload/bill/${Date.now()}.pdf`;
            var options = {
              height: '120mm', // allowed units: mm, cm, in, px
              width: '49mm',
              path: _filePath,
            };
            // _pdf.generatePdf({ content: str }, options, (err, pdf_result) => {
            //   const contents = fs.readFileSync(_filePath, {
            //     encoding: 'base64',
            //   });
            console.log('KOT Updated');
            const updateItem = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              bill: result.bill,
              kot: str,
            };
            const updateItem2 = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              order_history: result.order_history,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              bill: result.bill,
              kot: str,
            };
            db.collection('orders').findOneAndUpdate(
              { _id: new mongoose.mongo.ObjectID(req.body.id) },
              { $set: req.body.order_history ? updateItem2 : updateItem },
              { upsert: true },
              (err, result) => {
                if (err) {
                  res.json({
                    status: false,
                    code: 403,
                    error: err,
                  });
                } else {
                  // fs.unlinkSync(_filePath);
                  res.json({
                    status: true,
                    code: 200,
                  });
                }
              }
            );
            // });
          }
        );
      }
    });
};

const _updateBill = (req, res, item, food_items_result) => {
  OrderModel.findOne({ _id: item._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        res.render(
          'Bill',
          { item: result, moment: moment, host: process.env.HOST },
          function (err, str) {
            const _filePath = `./upload/bill/${Date.now()}.pdf`;
            var options = {
              height: '200mm', // allowed units: mm, cm, in, px
              width: '49mm',
              path: _filePath,
            };
            // _pdf.generatePdf({ content: str }, options, (err, pdf_result) => {
            //   const contents = fs.readFileSync(_filePath, {
            //     encoding: 'base64',
            //   });
            console.log('Bill updated');
            const food_items_body = req.body.food_items
              ? JSON.parse(req.body.food_items)
              : [];
            const filterUnique = food_items_body.filter(function (a) {
              return !this.has(a.uid);
            }, new Set(food_items_result.map((b) => b.uid)));

            const updateItem = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot:
                filterUnique.length === 0
                  ? result.food_items_for_kot
                  : filterUnique,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              bill: str,
            };
            const updateItem2 = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot:
                filterUnique.length === 0
                  ? result.food_items_for_kot
                  : filterUnique,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              order_history: result.order_history,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              bill: str,
            };
            db.collection('orders').findOneAndUpdate(
              { _id: new mongoose.mongo.ObjectID(req.body.id) },
              { $set: req.body.order_history ? updateItem2 : updateItem },
              { upsert: true },
              (err, result) => {
                if (err) {
                  res.json({
                    status: false,
                    code: 403,
                    error: err,
                  });
                } else {
                  // fs.unlinkSync(_filePath);
                  _updateKot(req, res, result.value, food_items_result);
                }
              }
            );
            // });
          }
        );
      }
    });
};

const _updateInvoice = (req, res, item) => {
  OrderModel.findOne({ _id: item._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        res.render(
          'Invoice',
          { item: result, moment: moment, host: process.env.HOST },
          function (err, str) {
            const _filePath = `./upload/bill/${Date.now()}.pdf`;
            var options = {
              border: 0,
              format: 'A4',
              path: _filePath,
            };
            // _pdf.generatePdf({ content: str }, options, (err, pdf_result) => {
            //   const contents = fs.readFileSync(_filePath, {
            //     encoding: 'base64',
            //   });
            console.log('Invoice updated');
            const updateItem = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              invoice: str,
            };
            const updateItem2 = {
              order_id: result.order_id,
              user: req.body.user
                ? new mongoose.mongo.ObjectID(req.body.user)
                : new mongoose.mongo.ObjectID(result.user),
              restaurant: req.body.restaurant
                ? new mongoose.mongo.ObjectID(req.body.restaurant)
                : new mongoose.mongo.ObjectID(result.restaurant),
              table: req.body.table
                ? new mongoose.mongo.ObjectID(req.body.table)
                : new mongoose.mongo.ObjectID(result.table),
              waiter: req.body.waiter
                ? new mongoose.mongo.ObjectID(req.body.waiter)
                : new mongoose.mongo.ObjectID(result.waiter),
              chef: req.body.chef
                ? new mongoose.mongo.ObjectID(req.body.chef)
                : new mongoose.mongo.ObjectID(result.chef),
              order_type: req.body.order_type
                ? req.body.order_type
                : result.order_type,
              food_items: req.body.food_items
                ? JSON.parse(req.body.food_items)
                : result.food_items,
              food_items_for_kot: result.food_items_for_kot,
              subtotal: Number(req.body.subtotal)
                ? Number(req.body.subtotal)
                : Number(result.subtotal),
              IGST_amount: Number(req.body.IGST_amount)
                ? Number(req.body.IGST_amount)
                : Number(result.IGST_amount),
              SGST_amount: Number(req.body.SGST_amount)
                ? Number(req.body.SGST_amount)
                : Number(result.SGST_amount),
              CGST_amount: Number(req.body.CGST_amount)
                ? Number(req.body.CGST_amount)
                : Number(result.CGST_amount),
              service_tax_amount: Number(req.body.service_tax_amount)
                ? Number(req.body.service_tax_amount)
                : Number(result.service_tax_amount),
              total: Number(req.body.total)
                ? Number(req.body.total)
                : Number(result.total),
              order_status: req.body.order_status
                ? req.body.order_status
                : result.order_status,
              order_history: result.order_history,
              payment_status: req.body.payment_status
                ? req.body.payment_status
                : result.payment_status,
              order_date_and_time: req.body.order_date_and_time
                ? req.body.order_date_and_time
                : result.order_date_and_time,
              instructions: req.body.instructions
                ? req.body.instructions
                : result.instructions,
              update_on: new Date(),
              invoice: str,
            };
            db.collection('orders').findOneAndUpdate(
              { _id: new mongoose.mongo.ObjectID(req.body.id) },
              { $set: req.body.order_history ? updateItem2 : updateItem },
              { upsert: true },
              (err, result) => {
                if (err) {
                  res.json({
                    status: false,
                    code: 403,
                    error: err,
                  });
                } else {
                  // fs.unlinkSync(_filePath);
                  res.json({
                    status: true,
                    code: 200,
                  });
                }
              }
            );
            // });
          }
        );
      }
    });
};

exports.UpdateOrder = (req, res) => {
  OrderModel.findOne({ _id: req.body.id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          status: false,
          code: 403,
        });
      } else {
        const order_result = result;
        result.order_history.push(req.body.order_history);
        if (
          req.body?.order_status?.title === 'Completed' ||
          req.body?.order_status?.title === 'Cancelled'
        ) {
          const updateItem = {
            order_id: result.order_id,
            user: req.body.user
              ? new mongoose.mongo.ObjectID(req.body.user)
              : new mongoose.mongo.ObjectID(result.user),
            restaurant: req.body.restaurant
              ? new mongoose.mongo.ObjectID(req.body.restaurant)
              : new mongoose.mongo.ObjectID(result.restaurant),
            table: req.body.table
              ? new mongoose.mongo.ObjectID(req.body.table)
              : new mongoose.mongo.ObjectID(result.table),
            waiter: req.body.waiter
              ? new mongoose.mongo.ObjectID(req.body.waiter)
              : new mongoose.mongo.ObjectID(result.waiter),
            chef: req.body.chef
              ? new mongoose.mongo.ObjectID(req.body.chef)
              : new mongoose.mongo.ObjectID(result.chef),
            order_type: req.body.order_type
              ? req.body.order_type
              : result.order_type,
            food_items: req.body.food_items
              ? JSON.parse(req.body.food_items)
              : result.food_items,
            food_items_for_kot: result.food_items_for_kot,
            subtotal: Number(req.body.subtotal)
              ? Number(req.body.subtotal)
              : Number(result.subtotal),
            IGST_amount: Number(req.body.IGST_amount)
              ? Number(req.body.IGST_amount)
              : Number(result.IGST_amount),
            SGST_amount: Number(req.body.SGST_amount)
              ? Number(req.body.SGST_amount)
              : Number(result.SGST_amount),
            CGST_amount: Number(req.body.CGST_amount)
              ? Number(req.body.CGST_amount)
              : Number(result.CGST_amount),
            service_tax_amount: Number(req.body.service_tax_amount)
              ? Number(req.body.service_tax_amount)
              : Number(result.service_tax_amount),
            total: Number(req.body.total)
              ? Number(req.body.total)
              : Number(result.total),
            order_status: req.body.order_status
              ? req.body.order_status
              : result.order_status,
            payment_status: req.body.payment_status
              ? req.body.payment_status
              : result.payment_status,
            order_date_and_time: req.body.order_date_and_time
              ? req.body.order_date_and_time
              : result.order_date_and_time,
            instructions: req.body.instructions
              ? req.body.instructions
              : result.instructions,
            update_on: new Date(),
          };
          const updateItem2 = {
            order_id: result.order_id,
            user: req.body.user
              ? new mongoose.mongo.ObjectID(req.body.user)
              : new mongoose.mongo.ObjectID(result.user),
            restaurant: req.body.restaurant
              ? new mongoose.mongo.ObjectID(req.body.restaurant)
              : new mongoose.mongo.ObjectID(result.restaurant),
            table: req.body.table
              ? new mongoose.mongo.ObjectID(req.body.table)
              : new mongoose.mongo.ObjectID(result.table),
            waiter: req.body.waiter
              ? new mongoose.mongo.ObjectID(req.body.waiter)
              : new mongoose.mongo.ObjectID(result.waiter),
            chef: req.body.chef
              ? new mongoose.mongo.ObjectID(req.body.chef)
              : new mongoose.mongo.ObjectID(result.chef),
            order_type: req.body.order_type
              ? req.body.order_type
              : result.order_type,
            food_items: req.body.food_items
              ? JSON.parse(req.body.food_items)
              : result.food_items,
            food_items_for_kot: result.food_items_for_kot,
            subtotal: Number(req.body.subtotal)
              ? Number(req.body.subtotal)
              : Number(result.subtotal),
            IGST_amount: Number(req.body.IGST_amount)
              ? Number(req.body.IGST_amount)
              : Number(result.IGST_amount),
            SGST_amount: Number(req.body.SGST_amount)
              ? Number(req.body.SGST_amount)
              : Number(result.SGST_amount),
            CGST_amount: Number(req.body.CGST_amount)
              ? Number(req.body.CGST_amount)
              : Number(result.CGST_amount),
            service_tax_amount: Number(req.body.service_tax_amount)
              ? Number(req.body.service_tax_amount)
              : Number(result.service_tax_amount),
            total: Number(req.body.total)
              ? Number(req.body.total)
              : Number(result.total),
            order_status: req.body.order_status
              ? req.body.order_status
              : result.order_status,
            order_history: result.order_history,
            payment_status: req.body.payment_status
              ? req.body.payment_status
              : result.payment_status,
            order_date_and_time: req.body.order_date_and_time
              ? req.body.order_date_and_time
              : result.order_date_and_time,
            instructions: req.body.instructions
              ? req.body.instructions
              : result.instructions,
            update_on: new Date(),
          };
          db.collection('orders').findOneAndUpdate(
            { _id: new mongoose.mongo.ObjectID(req.body.id) },
            { $set: req.body.order_history ? updateItem2 : updateItem },
            { upsert: true },
            (err, result) => {
              if (err) {
                res.json({
                  status: false,
                  code: 403,
                  error: err,
                });
              } else {
                _updateInvoice(req, res, result.value);
              }
            }
          );
        } else {
          const updateItem = {
            order_id: result.order_id,
            user: req.body.user
              ? new mongoose.mongo.ObjectID(req.body.user)
              : new mongoose.mongo.ObjectID(result.user),
            restaurant: req.body.restaurant
              ? new mongoose.mongo.ObjectID(req.body.restaurant)
              : new mongoose.mongo.ObjectID(result.restaurant),
            table: req.body.table
              ? new mongoose.mongo.ObjectID(req.body.table)
              : new mongoose.mongo.ObjectID(result.table),
            waiter: req.body.waiter
              ? new mongoose.mongo.ObjectID(req.body.waiter)
              : new mongoose.mongo.ObjectID(result.waiter),
            chef: req.body.chef
              ? new mongoose.mongo.ObjectID(req.body.chef)
              : new mongoose.mongo.ObjectID(result.chef),
            order_type: req.body.order_type
              ? req.body.order_type
              : result.order_type,
            food_items: req.body.food_items
              ? JSON.parse(req.body.food_items)
              : result.food_items,
            food_items_for_kot: result.food_items_for_kot,
            subtotal: Number(req.body.subtotal)
              ? Number(req.body.subtotal)
              : Number(result.subtotal),
            IGST_amount: Number(req.body.IGST_amount)
              ? Number(req.body.IGST_amount)
              : Number(result.IGST_amount),
            SGST_amount: Number(req.body.SGST_amount)
              ? Number(req.body.SGST_amount)
              : Number(result.SGST_amount),
            CGST_amount: Number(req.body.CGST_amount)
              ? Number(req.body.CGST_amount)
              : Number(result.CGST_amount),
            service_tax_amount: Number(req.body.service_tax_amount)
              ? Number(req.body.service_tax_amount)
              : Number(result.service_tax_amount),
            total: Number(req.body.total)
              ? Number(req.body.total)
              : Number(result.total),
            order_status: req.body.order_status
              ? req.body.order_status
              : result.order_status,
            payment_status: req.body.payment_status
              ? req.body.payment_status
              : result.payment_status,
            order_date_and_time: req.body.order_date_and_time
              ? req.body.order_date_and_time
              : result.order_date_and_time,
            instructions: req.body.instructions
              ? req.body.instructions
              : result.instructions,
            update_on: new Date(),
          };
          const updateItem2 = {
            order_id: result.order_id,
            user: req.body.user
              ? new mongoose.mongo.ObjectID(req.body.user)
              : new mongoose.mongo.ObjectID(result.user),
            restaurant: req.body.restaurant
              ? new mongoose.mongo.ObjectID(req.body.restaurant)
              : new mongoose.mongo.ObjectID(result.restaurant),
            table: req.body.table
              ? new mongoose.mongo.ObjectID(req.body.table)
              : new mongoose.mongo.ObjectID(result.table),
            waiter: req.body.waiter
              ? new mongoose.mongo.ObjectID(req.body.waiter)
              : new mongoose.mongo.ObjectID(result.waiter),
            chef: req.body.chef
              ? new mongoose.mongo.ObjectID(req.body.chef)
              : new mongoose.mongo.ObjectID(result.chef),
            order_type: req.body.order_type
              ? req.body.order_type
              : result.order_type,
            food_items: req.body.food_items
              ? JSON.parse(req.body.food_items)
              : result.food_items,
            food_items_for_kot: result.food_items_for_kot,
            subtotal: Number(req.body.subtotal)
              ? Number(req.body.subtotal)
              : Number(result.subtotal),
            IGST_amount: Number(req.body.IGST_amount)
              ? Number(req.body.IGST_amount)
              : Number(result.IGST_amount),
            SGST_amount: Number(req.body.SGST_amount)
              ? Number(req.body.SGST_amount)
              : Number(result.SGST_amount),
            CGST_amount: Number(req.body.CGST_amount)
              ? Number(req.body.CGST_amount)
              : Number(result.CGST_amount),
            service_tax_amount: Number(req.body.service_tax_amount)
              ? Number(req.body.service_tax_amount)
              : Number(result.service_tax_amount),
            total: Number(req.body.total)
              ? Number(req.body.total)
              : Number(result.total),
            order_status: req.body.order_status
              ? req.body.order_status
              : result.order_status,
            order_history: result.order_history,
            payment_status: req.body.payment_status
              ? req.body.payment_status
              : result.payment_status,
            order_date_and_time: req.body.order_date_and_time
              ? req.body.order_date_and_time
              : result.order_date_and_time,
            instructions: req.body.instructions
              ? req.body.instructions
              : result.instructions,
            update_on: new Date(),
          };
          db.collection('orders').findOneAndUpdate(
            { _id: new mongoose.mongo.ObjectID(req.body.id) },
            { $set: req.body.order_history ? updateItem2 : updateItem },
            { upsert: true },
            (err, result) => {
              if (err) {
                res.json({
                  status: false,
                  code: 403,
                  error: err,
                });
              } else {
                const food_items_body = req.body.food_items
                  ? JSON.parse(req.body.food_items)
                  : [];
                var filterUnique = food_items_body.filter(function (a) {
                  return !this.has(a.uid);
                }, new Set(order_result.food_items.map((b) => b.uid)));
                console.log(filterUnique.length);
                _updateBill(req, res, result.value, order_result.food_items);
                // if (filterUnique.length === 0) {
                //   _updateKot(req, res, result.value);
                //   res.json({
                //       status :true,
                //       code:200
                //   })
                // } else {
                //   _updateBill(req, res, result.value, order_result.food_items);
                // }
              }
            }
          );
        }
      }
    });
};

exports.DashboardDetials = async (req, res) => {
  try {
    const orderList = req.body.restaurant
      ? await OrderModel.find({ restaurant: req.body.restaurant }).exec()
      : await OrderModel.find().exec();
    const userList = req.body.restaurant
      ? await UsersModel.find({
          restaurant: new mongoose.mongo.ObjectID(req.body.restaurant),
        })
      : await UsersModel.find().exec();
    // console.log(req.body.restaurant, '---->>', userList);
    res.json({
      status: true,
      code: 200,
      data: {
        delivered_orders: orderList
          .filter((a) => a.order_status.title === 'Completed')
          .map((b) => b.order_status).length,
        received_orders: orderList.length,
        total_customer: userList.length,
        net_earning: orderList
          .map((a) => a.total)
          .reduce(function (previousValue, currentValue) {
            return previousValue + currentValue;
          }),
      },
    });
  } catch (error) {
    res.json({
      code: 403,
      status: false,
      error: error,
    });
  }
};

exports.OrderTrack = (req, res) => {
  OrderModel.findOne({ order_id: req.body.order_id }).exec((err, result) => {
    if (
      result === [] ||
      result === null ||
      result === undefined ||
      result === {} ||
      result === '[]'
    ) {
      res.json({
        code: 403,
        status: false,
      });
    } else {
      res.json({
        status: true,
        code: 200,
        data: result.order_status,
      });
    }
  });
};

exports.OrderDetails = (req, res) => {
  OrderModel.findOne({ _id: req.body._id })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          code: 403,
          status: false,
        });
      } else {
        res.json({
          status: true,
          code: 200,
          data: result,
        });
      }
    });
};

exports.ListOfOrder = async (req, res) => {
  try {
    const orderList = await OrderModel.find()
      .populate('restaurant')
      .populate('table')
      .populate('user')
      .populate('waiter')
      .populate('chef')
      .exec();
    if (req.body.search) {
      if (req.body.search.length !== 0) {
        const filterData = orderList.filter(
          (data) =>
            data.order_id.toString().includes(req.body.search) ||
            data.user.name
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data.user.phone
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data.restaurant.restaurant_name
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data.table.table_no.toString().includes(req.body.search)
        );
        res.json({
          status: true,
          code: 200,
          data: filterData,
        });
      } else {
        res.json({
          status: true,
          code: 200,
          data: orderList,
        });
      }
    } else {
      res.json({
        status: true,
        code: 200,
        data: orderList,
      });
    }
  } catch (error) {
    res.json({
      code: 403,
      status: false,
      error: error,
    });
  }
};

exports.RestaurantByOrderList = (req, res) => {
  OrderModel.find({
    restaurant: new mongoose.mongo.ObjectID(req.body.restaurant),
  })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          code: 403,
          status: false,
        });
      } else {
        res.json({
          status: true,
          code: 200,
          data: result,
        });
      }
    });
};

exports.UsersByOrderList = (req, res) => {
  OrderModel.find({ user: new mongoose.mongo.ObjectID(req.body.user) })
    .populate('restaurant')
    .populate('table')
    .populate('user')
    .populate('waiter')
    .populate('chef')
    .exec((err, result) => {
      if (
        result === [] ||
        result === null ||
        result === undefined ||
        result === {} ||
        result === '[]'
      ) {
        res.json({
          code: 403,
          status: false,
        });
      } else {
        res.json({
          status: true,
          code: 200,
          data: result,
        });
      }
    });
};

exports.DeleteOrder = (req, res) => {
  OrderModel.findOneAndDelete({ _id: req.body._id }, function (err, docs) {
    if (err) {
      res.json({
        status: false,
        code: 403,
      });
    } else {
      res.json({
        status: true,
        code: 200,
      });
    }
  });
};

exports.paginatedListOfOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const { restaurant, search } = req.body;

    const query = restaurant ? { restaurant } : {};

    const total = await OrderModel.countDocuments(query);

    const orderList = await OrderModel.find(query)
      .sort({ _id: -1  })
      .limit(search === '' ? limit : 0)
      .skip(search === '' ? page * limit : 0)
      .populate('restaurant')
      .populate('table')
      .populate('user')
      .populate('waiter')
      .populate('chef')
      .exec();
    if (req.body.search) {
      if (req.body.search.length !== 0) {
        const filterData = orderList.filter(
          (data) =>
            data.order_id.toString().includes(req.body.search) ||
            data?.user?.name?.toString()
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data?.user?.phone?.toString()
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data?.restaurant?.restaurant_name?.toString()
              .toLowerCase()
              .includes(req.body.search.toLowerCase()) ||
            data?.table?.table_no?.toString().includes(req.body.search)
        );
        res.json({
          status: true,
          code: 200,
          data: filterData,
          total,
          page,
          pageSize: filterData.length,
        });
      } else {
        res.json({
          status: true,
          code: 200,
          data: orderList,
          total,
          page,
          pageSize: orderList.length,
        });
      }
    } else {
      res.json({
        status: true,
        code: 200,
        data: orderList,
        total,
        page,
        pageSize: orderList.length,
      });
    }
  } catch (error) {
    console.log(error)
    res.json({
      code: 403,
      status: false,
      error: error,
    });
  }
};
