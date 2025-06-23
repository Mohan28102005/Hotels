const Listing=require("../models/listing");
module.exports.index=async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}
module.exports.createNewListing=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showSelectedListing=async (req,res)=>{
    let {id}=req.params;
    let allData=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(allData);
    if(!allData){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(allData.reviews);
    res.render("listings/show.ejs",{allData});
}
module.exports.postNewListing=async(req,res,next)=>{
        console.log(req.body);
        let data=req.body.listing;
        console.log("data");
        console.log(data);
        const location=req.body.location;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        const newListing=new Listing({
            ...data,
            image:{
                url:req.file.path,
                filename:req.file.filename
            }
        });
        // console.log(req.user._id);
        newListing.owner=req.user._id;
        try{
            const response=await fetch(url,{headers:{"User-Agent":"MapFetcher"}});
            const data=await response.json();
            if(data.length!=0){
                newListing.latitude=parseFloat(data[0].lat);
                newListing.longitude=parseFloat(data[0].lon);
            }
        }catch(e){
            console.error(e.message);
        }
        await newListing.save();
        req.flash("success","New Place Added Successfully!!");
        res.redirect("/listings");
        
};
module.exports.editListingForm=async(req,res)=>{
    let {id}=req.params;
    let allData=await Listing.findById(id);
    console.log(res.locals);
    if(!allData){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{allData});
}
module.exports.patchingEdittedData=async (req,res)=>{
    let data=req.body.listing;
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Updated Data Added Successfully!!");
    res.redirect("/listings");
}
module.exports.deleteParticularListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully!!");
    res.redirect("/listings");
}