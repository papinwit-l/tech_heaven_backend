const express = require('express')
const { getDashBoardData } = require('../controllers/dashboard-controller')
const router = express.Router()

router.get("/", getDashBoardData)

module.exports = router