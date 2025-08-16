const URL = require("../models/url");
const shortid= require("shortid");
async function handleGenerateShortId(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "No url is provided" });
  }
  const shortId = shortid();
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });
  return res.json({ id: shortId });
}

async function handleGetAnalytics(req,res) {
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}
module.exports = { handleGenerateShortId ,handleGetAnalytics};
