const{storage}=require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage: storage })
const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema}=require("../schema.js");
const router=express.Router({mergeParams:true});
const {LoggedIn,redirectUrl}=require("../middleware.js");
const { index, createNewListing, showSelectedListing, postNewListing, editListingForm, patchingEdittedData, deleteParticularListing } = require("../controllers/listings.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
//wrapAsync(postNewListing)
//req.file
router.route("/")
    .get(wrapAsync(index))
    .post(upload.single('listing[image]'),wrapAsync(postNewListing));
// router.get("/",wrapAsync(index));
router.get("/new",redirectUrl,LoggedIn,createNewListing)
router.get("/:id",wrapAsync(showSelectedListing))
// router.post("/",validateListing,wrapAsync(postNewListing));
router.get("/:id/edit",LoggedIn,wrapAsync(editListingForm))
router.patch("/:id",LoggedIn,upload.single("listing[image]"),wrapAsync(patchingEdittedData))
router.delete("/:id",LoggedIn,wrapAsync(deleteParticularListing))
module.exports=router;