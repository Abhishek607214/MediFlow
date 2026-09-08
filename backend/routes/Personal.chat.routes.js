const express = require("express");

const {
    getChatMessages,
    sendChatMessage,
    markMessagesAsRead
} = require(
    "../controllers/Personal.chat.controller"
);

const {
    protect
} = require(
    "../middleware/auth.middleware"
);

const {
    authorize
} = require(
    "../middleware/role.middleware"
);


const router = express.Router();


// Get messages
router.get(
    "/:appointmentId",
    protect,
    authorize("patient", "doctor"),
    getChatMessages
);


// Send message
router.post(
    "/:appointmentId/message",
    protect,
    authorize("patient", "doctor"),
    sendChatMessage
);


// Mark messages as read
router.put(
    "/:appointmentId/read",
    protect,
    authorize("patient", "doctor"),
    markMessagesAsRead
);


module.exports = router;