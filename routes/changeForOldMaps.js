const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlist').then((res)=>{
    console.log("everything with the database is fine");
}).catch((err)=>{
    console.log("error");
})
const Listing=require("../models/listing.js");
async function geocodeLocation(location){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const response=await fetch(url,{headers:{"User-Agent":"BatchGeocoder"}});
    const data=await response.json();
    if(data.length>0){
        return{
            latitude:parseFloat(data[0].lat),
            longitude:parseFloat(data[0].lon)
        };
    }else{
        return null;
    }
}
async function updateListing(){
    const listings=await Listing.find({$or:[{latitude:{$exists:false}},{longitude:{$exists:false}}]});
    for(let listing of listings){
        const location=listing.location;
        try{
            const cords=await geocodeLocation(location);
            if(cords){
                listing.latitude=cords.latitude;
                listing.longitude=cords.longitude;
                await listing.save();
            }
        }catch(err){
            console.error("error in co ordinates");
        }
    }
    console.log("updated with co-ordinates");
    mongoose.connection.close();
}
updateListing();