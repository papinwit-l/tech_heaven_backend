const express = require("express");
const router = express.Router();
const Authenticate = require("../middlewares/authenticate");
const {
  getProductByCategoryId,
  createPCBuild,
  getPCBuildList,
} = require("../controllers/pcbuild-controller");

// FOR PC Build
router.post("/products-by-category/:categoryId", getProductByCategoryId);
router.post("/create-build", Authenticate.auth, createPCBuild);
router.get("/get-build-list", Authenticate.auth, getPCBuildList);

module.exports = router;
