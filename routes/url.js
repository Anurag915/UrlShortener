const express =require("express");
const router=express.Router();
const {handleGenerateShortId,handleGetAnalytics}=require("../controllers/url");

router.post("/",handleGenerateShortId);

router.get("/analytics/:shortId",handleGetAnalytics);

module.exports=router;