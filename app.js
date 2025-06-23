if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// console.log(process.env.CLOUD_NAME);
const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
var methodOverride = require('method-override')
app.set("view engine","ejs");
app.use(express.static("public"));
const engine = require('ejs-mate');
var flash = require('express-flash');
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
app.engine('ejs', engine);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { redirectUrl } = require("./middleware.js");
const Listing = require("./models/listing.js");
app.use(methodOverride('_method'))
app.listen(port,()=>{
    console.log("listening to port 8080");
})
const dataUrl=process.env.ATLASDB_URL;
const mongoUrl='mongodb://127.0.0.1:27017/wanderlist';
mongoose.connect(dataUrl).then((res)=>{
    console.log("everything with the database is fine");
}).catch((err)=>{
    console.log("error");
})
const store=MongoStore.create({
    mongoUrl:dataUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",()=>{
    console.log("error from mongo-store");
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",(req,res)=>{
    res.send("from root");
})
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/signup",userRoute);
app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listings");
    })
})
app.get("/search/api",async(req,res)=>{
    const {query}=req.query;
    const regex=new RegExp(query,"i");
    const listings=await Listing.find({$or:[
        {title:regex},
        {location:regex},
        {country:regex}
    ]});
    res.json(listings);
})
app.post("/search",async(req,res)=>{
    const query=req.body.query;
    const regex=new RegExp(query,"i");
    const allListings=await Listing.find({$or:[
        {title:regex},
        {location:regex},
        {country:regex}
    ]})
    res.render("listings/index.ejs",{allListings});
})
app.post("/login",redirectUrl,passport.authenticate("local",{failureRedirect:"/signup",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back again!!");
    console.log(res.locals);
    const redirectPath=res.locals.originalUrl||"/listings";
    res.redirect(redirectPath);
})
app.use((req,res,next)=>{
    const err=new Error("Page not found");
    err.statusCode=404;
    next(err);
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    console.log("something went wrong");
})