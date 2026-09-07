const express = require("express");

const { chatWithAI } = require("../controllers/chat.controller");

const router = express.Router();

// AI chatbot
router.post("/", chatWithAI);

module.exports = router;