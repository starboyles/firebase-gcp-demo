const TeamModel = require("../models/team.model");

class TeamController {
  static async createTeam(req, res) {
    try {
      const { name, description } = req.body;
      const teamData = {
        name,
        description,
        owner: req.user.uid,
        members: [{ userId: req.user.uid, role: "leader" }],
      };

      const teamRef = await TeamModel.createTeam(teamData);
      res.status(201).json({ id: teamRef.id, ...teamData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addTeamMember(req, res) {
    try {
      const { teamId } = req.params;
      const { userId, role } = req.body;

      const team = await TeamModel.getTeamById(teamId);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      if (team.owner !== req.user.uid) {
        return res
          .status(403)
          .json({ error: "Only team owner can add members" });
      }

      await TeamModel.addTeamMember(teamId, userId, role);
      res.json({ message: "Team member added successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TeamController;
