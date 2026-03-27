const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  chat,
  getSuggestions,
  getQuickHelp,
  analyzeJobMatch,
  getInterviewPrep,
  analyzeSkillGaps,
} = require("../controllers/chatbotController");

router.post("/chat", auth, chat);
router.get("/suggestions", auth, getSuggestions);
router.post("/quick-help", auth, getQuickHelp);
router.post("/analyze-job", auth, analyzeJobMatch);
router.post("/interview-prep", auth, getInterviewPrep);
router.post("/skill-gaps", auth, analyzeSkillGaps);

module.exports = router;