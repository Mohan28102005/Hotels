const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wanderlist').then((res)=>{
    console.log("everything with the database is fine");
}).catch((err)=>{
    console.log("error");
})
const Listing=require("../models/listing");
const initData=require("./data");
const initDB=async ()=>{
    await Listing.deleteMany({});
    try {
        const ListingsWithOwner=initData.data.map((el)=>({
            ...el,owner:"68429d673c110733b53a0d5e"
        }))
    await Listing.insertMany(ListingsWithOwner);
    console.log("data inserted");
    } catch (err) {
    console.error(err);
    }

}
initDB();