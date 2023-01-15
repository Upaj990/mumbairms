require('dotenv').config();
require('./connection')
const express = require('express');
var cors = require('cors');
const app = express();
// const admin = require("firebase-admin");
app.set('view engine', 'ejs');

app.use(cors())
const port = process.env.PORT;
const bodyParser = require('body-parser');

// const serviceAccount = require("D:/OneDrive/Desktop/Service-account-sdk.json");
// var FCM = require('fcm-node');
// var serverKey = '	AAAA8kfYD00:APA91bFLC_SXtUauC5OEQD0gcSkBk1HWsXdW6OzBwj7wUFkMG-tTinVd2r3WacEdjW28ps05Ir_DbEgfkCtuHBUdrX-jKeH2MXuXJ0eradvcAlgDrcYPwCIO4iBJvArn5n-SzQAXF0cE'
// var fcm = new FCM(serverKey);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/rm.bohfy.com/privkey.pem', 'utf8'); // key
const certificate = fs.readFileSync('/etc/letsencrypt/live/rm.bohfy.com/cert.pem', 'utf8'); // certificate
const ca = fs.readFileSync('/etc/letsencrypt/live/rm.bohfy.com/chain.pem', 'utf8'); // chain
const credentials = {
   key: privateKey,
   cert: certificate,
   ca: ca
};

app.get('/', (req, res) => res.send('Welcome to Express'));

// app.get("/notify", async (req, res) => {
//   const message = {
//     topic: "MyNews",
//     notification: {
//       title: "Test Notification",
//       body: "Here is the Notification Description",
//     },
//     data: {
//       name: "AboutReact",
//       url: "https://aboutreact.com",
//       writter: "Snehal Agrawal",
//     },
//     android: {
//       notification: {
//         image:
//           "https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png",
//       },
//       ttl: 4500,
//       priority: "normal",
//     },
//     apns: {
//       headers: {
//         "apns-priority": "5",
//         "apns-expiration": "1604750400",
//       },
//     },
//   };

//   admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       res.send(`Successfully sent message: ${response}`);
//     })
//     .catch((error) => {
//       res.send(`Error sending message: ${error}`);
//     });
// });
app.use(express.static('public'));
const httpsServer = https.createServer(credentials, app);
httpsServer.listen('8443', () => {
    console.log('listening on https://rm.bohfy.com:8443');
});


var path = require('path')
app.use('/files/images', express.static(path.join(__dirname,'images')));
app.set('views', path.join(__dirname,'views'));



app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());



const users = require('./routers/app/Users');
const mobile = require('./routers/app/Mobile');

app.use(process.env['API_V1'] + "user", users);
app.use(process.env['API_V1'] + "mobile", mobile);

const admins = require('./routers/admin/Admins');
const Category = require('./routers/admin/Category');
const Cuisines = require('./routers/admin/Cuisines');
const AddOns = require('./routers/admin/AddOns');
const Banner = require('./routers/admin/Banner');
const Restaurant = require('./routers/admin/Restaurant');
const Weeks = require('./routers/admin/Weeks');
const Menu = require('./routers/admin/Menu');
const CmsType = require('./routers/admin/CmsType');
const CMS = require('./routers/admin/CMS');
const Coupons = require('./routers/admin/Coupons');
const Table = require('./routers/admin/Table');
const Order = require('./routers/admin/Order');
const SystemOptions = require('./routers/admin/SystemOptions');
const Cart = require('./routers/admin/Cart');
const Rating = require('./routers/admin/Rating');
const StockType=require('./routers/admin/StockType');
const Inventory=require('./routers/admin/Inventory');
const { connection } = require('mongoose');

app.use(process.env['API_V1'] + "admin/admins", admins);
app.use(process.env['API_V1'] + "admin/category", Category);
app.use(process.env['API_V1'] + "admin/cuisines", Cuisines);
app.use(process.env['API_V1'] + "admin/addons", AddOns);
app.use(process.env['API_V1'] + "admin/banner", Banner);
app.use(process.env['API_V1'] + "admin/restaurant", Restaurant);
app.use(process.env['API_V1'] + "admin/weeks", Weeks);
app.use(process.env['API_V1'] + "admin/menu", Menu);
app.use(process.env['API_V1'] + "admin/cms_type", CmsType);
app.use(process.env['API_V1'] + "admin/cms", CMS);
app.use(process.env['API_V1'] + "admin/coupons", Coupons);
app.use(process.env['API_V1'] + "admin/table", Table);
app.use(process.env['API_V1'] + "admin/order", Order);
app.use(process.env['API_V1'] + "admin/system_options", SystemOptions);
app.use(process.env['API_V1'] + "admin/cart", Cart);
app.use(process.env['API_V1'] + "admin/rating", Rating);
app.use(process.env['API_V1'] + "admin/stock_type", StockType);
app.use(process.env['API_V1'] + "admin/inventory", Inventory);
