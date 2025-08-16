const express = require("express");
const app = express();
const URL = require("./models/url.js");
const PORT = 8001;
const urlRouter = require("./routes/url");
const { connectToMongoDb } = require("./connect.js");
const { default: mongoose } = require("mongoose");

connectToMongoDb("mongodb://127.0.0.1:27017/ShortUrl").then(() =>
  console.log("db connection successful")
);

app.use(express.json());

app.use("/api/url", urlRouter);
app.get("/:shortId", async (req, res) => {
  const shortId = String(req.params.shortId);
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`server started at ${PORT}`));
