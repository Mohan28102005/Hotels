const express=require("express");
const router=express.Router({mergeParams:true});
const User = require("../models/user.js"); 
const { renderSignUp, renderLogingIn } = require("../controllers/users.js");

router.get("/",renderSignUp)
router.post("/",renderLogingIn);

module.exports = router;
