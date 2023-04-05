const express = require("express");
const taskController = require("../controllers/task");
const router = express.Router();

//GET /task/getTasks/<userId>
router.get("/getTasks/:userId", taskController.getTasks);

//POST /task/addTask
router.post("/addTask", taskController.addTask);

//DELETE /task/deleteTask/<taskId>
router.delete("/deleteTask/:taskId", taskController.deleteTask);
module.exports = router;
