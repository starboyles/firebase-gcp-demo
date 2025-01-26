const TaskModel = require("../models/task.model");
const TeamModel = require("../models/team.model");

class TaskController {
  static async createTask(req, res) {
    try {
      const { title, description, teamId, assignee, priority, dueDate } =
        req.body;

      // Verify team membership
      const team = await TeamModel.getTeamById(teamId);
      if (
        !team ||
        !team.members.some((member) => member.userId === req.user.uid)
      ) {
        return res.status(403).json({ error: "Not a team member" });
      }

      const taskData = {
        title,
        description,
        status: "todo",
        priority,
        assignee,
        teamId,
        dueDate,
        createdBy: req.user.uid,
        comments: [],
      };

      const taskRef = await TaskModel.createTask(taskData);
      res.status(201).json({ id: taskRef.id, ...taskData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      const task = await TaskModel.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const team = await TeamModel.getTeamById(task.teamId);
      if (!team.members.some((member) => member.userId === req.user.uid)) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this task" });
      }

      await TaskModel.updateTask(taskId, { status });
      res.json({ message: "Task updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addComment(req, res) {
    try {
      const { taskId } = req.params;
      const { content } = req.body;

      const task = await TaskModel.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const comment = {
        content,
        author: req.user.uid,
      };

      await TaskModel.addComment(taskId, comment);
      res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TaskController;
