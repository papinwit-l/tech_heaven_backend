const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat-controller");
const authenticate = require("../middlewares/authenticate");

router.get("/getallchat", authenticate.auth, chatController.getAllChats);
router.get("/getchat", authenticate.auth, chatController.getChat);
router.get("/getchat/:id", authenticate.auth, chatController.getChatById);
router.get(
  "/getnotification",
  authenticate.auth,
  chatController.getNotification
);
router.get(
  "/admingetnotification",
  authenticate.auth,
  chatController.adminGetNotification
);
router.get(
  "/getmoremessage/:id/:skip",
  authenticate.auth,
  chatController.getMoreMessage
);

module.exports = router;
