const mongoose = require('mongoose')
const mongodbURI = process.env.MONGODB_URI
mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI,{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() =>{
  console.log("MongoDB connected..!!")
}).catch((err) =>{
  console.log(err)
})