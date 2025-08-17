const express = require("express");
const app = express();
const URL = require("./models/url.js");
const PORT = 8001;
const urlRouter = require("./routes/url");
const { connectToMongoDb } = require("./connect.js");
const { default: mongoose } = require("mongoose");
const path = require("path");
const staticRoutes=require("./routes/staticRoutes.js");

connectToMongoDb("mongodb://127.0.0.1:27017/ShortUrl").then(() =>
  console.log("db connection successful")
);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use("/api/url", urlRouter);

app.use("/",staticRoutes);

app.get("/api/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // returns updated doc
    );

    if (!entry) return res.status(404).send("URL not found");

    res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/test", async (req, res) => {
  const allUrls = await URL.find();
  return res.render("home", {
    url: allUrls,
  });
});

app.listen(PORT, () => console.log(`server started at ${PORT}`));
