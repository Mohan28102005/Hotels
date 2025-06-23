const Review=require("./models/review.js")
LoggedIn=(req,res,next)=>{
    // console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.originalUrl=req.originalUrl;
        req.flash("error","You need to login to create listing");
        return res.redirect("/login");
    }
    next();
}
redirectUrl=(req,res,next)=>{
    // console.log(req.originalUrl);
    if(req.session.originalUrl){
        // console.log("from redirect url ",req.session.originalUrl);
        res.locals.originalUrl=req.session.originalUrl;
    }
    next();
}
isAuthor=async(req,res,next)=>{
    const {reviewId}=req.params;
    const review=await Review.findById(reviewId);
    console.log("middleware");
    console.log("Logged in user:", req.user._id);
// console.log("Review author:", review.author);

    if(!review.author.equals(req.user._id)){
        req.flash("error","you don't have permission to do that");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
    
}
module.exports={LoggedIn,redirectUrl,isAuthor};