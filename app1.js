// npm init -y
// npm i express
require('dotenv').config();
const express = require("express");
const nodemon = require("nodemon");
const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const userRouter = require('./Router/userRouter');
const authRouter = require('./Router/authRouter');
const planRouter = require('./Router/planRouter');
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
// Server: // route  -> request -> response/file 
// File system// path -> interact/type -> file /folder
// server init
const app = express();
// this line 
// post -> /
// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("before", body);
//     next();
// })
// inbuilt methods of express has next already implmeneted
// always use me
//  express json -> req.body add
// reserve a folder only from which client can acces the files 

// protection against DoS
// only {max} queries can be made per ip address
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter);

// to allow only specified parameters in query
// preotection against http parameter polluting
app.use(hpp({
    whitelist : [
        'select',
        'sort',
        'page',
        'myQuery'
    ]
}));

// to set http header
// protection against packet sniffing
app.use(helmet());

app.use(express.static("Frontend_folder/build"));
app.use(express.json());
app.use(cookieParser());
// protection against cross site atteck
app.use(xss());
// protection against mongoDB query injection
app.use(mongoSanitize());
// // function -> route  path
// // frontend -> req -> /
// read data storage
// localhost/user/10 -> post 
// let content = JSON.parse(fs.readFileSync("./data.json"));
// // localhost / auth / 10-> patch
app.use('/api/user', userRouter);
app.use("/api/plan", planRouter);
app.use('/api/auth', authRouter);
app.use('/api/review', reviewRouter);
app.use('/api/booking', bookingRouter);
// heroku physical -> multiple server run
app.listen(process.env.PORT||8081, function () {
    console.log("server started");
})
// 404 page
app.use(function (req, res) {
    // console.log("fullPath", fullPath);
    res.status(404).json({
        message: "page Not found"
    })
})




// app.get("/", function (req, res) {
//     console.log("hello from home page")
//     // res.send("<h1>Hello from Backend</h1>");
//     res.status(200).json(
//         { message: content }
//     )
// })
// app.put("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.update("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.delete("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.get("/user", function (req, res) {
//     console.log("users")
//     // for sending key value pair
//     res.json(obj);
// })
// //localhost:8080 ??
// / port, ip,localhost
// app.post("/", function (req, res, next) {
        //     let body = req.body;
        //     console.log("inside first post", body);
        //     next();
        // })
        // app.use(function (req, res, next) {
        //     console.log("inside app.use",)
        //     next();
        // })
        // app.get("/", function (req, res) {
        //     let body = req.body;
        //     console.log("inside first get", body);

        // })
        // app.post("/", function (req, res, next) {
        //     let body = req.body;
        //     console.log("inside second post ", body);
        //     res.send("tested next");
        // })