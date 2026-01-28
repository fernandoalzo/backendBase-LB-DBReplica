const express = require("express");
const router = express.Router();

const SetUpServices = require("../../SERVICES/setUp/setUp.service");
const service = new SetUpServices();
const validatorHandler = require("../../MIDDLEWARES/validators/validator.handler");
const { setUpSchema } = require("../../SCHEMAS/setUp/setUp.schema");

router.get(
  "/",
  validatorHandler(setUpSchema, "query"),
  async (req, res, next) => {
    try {
      const { step } = req.query;
      if (step === "initial") {
        const rtaInitialSetUp = await service.InitialSetUp();
        res.status(200).json(rtaInitialSetUp);
      } else {
        res.status(400).json({ message: "Step not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
