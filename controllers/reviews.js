const Review=require("../models/review.js")
const Listing=require("../models/listing");
module.exports.postNewReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully!!");
    res.redirect(`/listings/${listing._id}`);
    console.log("data saved ");
}
module.exports.deletePost=async (req,res)=>{
    const {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted Successfully!!");
    res.redirect(`/listings/${id}`);
}