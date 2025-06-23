const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js")
const Listing=require("../models/listing");
const { LoggedIn,isAuthor } = require("../middleware.js");
const { postNewReview, deletePost } = require("../controllers/reviews.js");
const router=express.Router({mergeParams:true});
router.use(express.urlencoded({extended:true}));
router.use(express.json());
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
router.post("/",LoggedIn,validateReview,wrapAsync(postNewReview))
router.delete("/:reviewId",LoggedIn,isAuthor,wrapAsync(deletePost))
module.exports=router;