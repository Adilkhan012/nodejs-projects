// dependencies
const fs = require("fs");
const express = require("express");
const router = express.Router();

const { getContractNft } = require("./smart-contracts-config");

router.get("/", async (req, res) => {
  res.send({ message: "Assalamo Alaikum" });
});

router.get("/metadata/:tokenId", async (req, res) => {
  const totalSupply = await getContractNft().methods.totalSupply().call();

  if (Number(req.params.tokenId) < Number(totalSupply)) {
    const metadata = fs.readFileSync("./metadata/" + req.params.tokenId, "utf8");
    res.send(JSON.parse(metadata));
  } else {
    const metadata = fs.readFileSync("./metadata/pre_reveal", "utf8");
    res.send(JSON.parse(metadata));
  }
});

router.get("/images/:tokenId", async (req, res) => {
  const totalSupply = await getContractNft().methods.totalSupply().call();

  if (Number(req.params.tokenId) < Number(totalSupply)) {
    const imagePath = __dirname + "/images/" + req.params.tokenId + ".jpg";
    res.sendFile(imagePath);
  } else {
    const imagePath = __dirname + "/images/pre_reveal.jpeg";
    res.sendFile(imagePath);
  }
});

module.exports = router;
