
const express = require("express");
const router = express.Router();

const {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation
} = require("../controllers/quotationController");

router.get("/", getQuotations);
router.get("/:id", getQuotationById);
router.post("/", createQuotation);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

module.exports = router;
