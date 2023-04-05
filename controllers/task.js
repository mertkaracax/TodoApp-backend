const Task = require("../models/task");
const User = require("../models/user");

exports.getTasks = async (req, res, next) => {
  const userId = req.params.userId;
  Task.find({ creator: userId })
    .then((tasks) => {
      console.log(tasks);
      return res.status(200).json({ tasks: tasks });
    })
    .catch((err) => console.log(err));
  // User.findById(req.params.userId)
  //   .then((user) => {
  //     if (!user) {
  //       return res
  //         .status(401)
  //         .send({ message: "Username could not be found." });
  //     }
  //     console.log(user.tasks);
  //     console.log("REQUEST PARAMETER => ", req.params.userId);
  //     return res.status(200).json({ tasks: user.tasks });
  //   })

  //   .catch((err) => console.log(err));
};

exports.addTask = (req, res, next) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const task = new Task({
    title: title,
    description: description,
    creator: userId,
  });
  return task
    .save()
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      user.tasks.push(task);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Task created!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;
  const userId = req.body.userId;
  console.log(userId);
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task");
        error.statusCode = 404;
        throw error;
      }
      // if (task.creator.toString() !== req.userId) {
      //   const error = new Error("Not authorized.");
      //   error.statusCode = 403;
      //   throw error;
      // }

      //Check logged in user
      return Task.findByIdAndRemove(taskId);
    })
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      user.tasks.pull(taskId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted successfully!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
