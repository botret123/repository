const path = require('path')
import express from "express";
let viewEngine =require("./src/config/viewEngine");
let bodyparser = require ("body-parser");
require("dotenv").config();
let port = process.env.PORT || 8080;
const ZingMp3Router = require('./src/routes/web')

const app = express()

viewEngine(app);


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
ZingMp3Router(app);
app.listen(port, ()=>{

    console.log("chat bot đang chạy ở cổng "+ port);
});