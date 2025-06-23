const User = require("../models/user.js"); 
module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.renderLogingIn=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newData=new User({username:username,email:email});
        let registeredData=await User.register(newData,password); 
        console.log(registeredData);
        req.login(registeredData,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","signed in successfully");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error","User already exists");
        res.redirect("/signup");
    }
}