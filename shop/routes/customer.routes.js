const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");

router.get("/", async (req, res) => {
  await CustomerController.getAllCustomers(req, res);
});

router.get("/:id", async (req, res) => {
  await CustomerController.getCustomerById(req, res);
});

router.post("/", async (req, res) => {
  await CustomerController.createCustomer(req, res);
});

router.put("/:id", async (req, res) => {
  await CustomerController.updateCustomer(req, res);
});

router.delete("/:id", async (req, res) => {
  await CustomerController.deleteCustomer(req, res);
});

module.exports = router;
