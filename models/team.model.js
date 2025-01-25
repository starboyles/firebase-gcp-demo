const { db } = require("../config/firebase.config");
const { COLLECTIONS } = require("../config/constants");

class TeamModel {
  static async createTeam(teamData) {
    const teamRef = db.collection(COLLECTIONS.TEAMS).doc();
    await teamRef.set({
      ...teamData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return teamRef;
  }

  static async getTeamById(teamId) {
    const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(teamId).get();
    return teamDoc.exists ? { id: teamDoc.id, ...teamDoc.data() } : null;
  }

  static async addTeamMember(teamId, userId, role) {
    const teamRef = db.collection(COLLECTIONS.TEAMS).doc(teamId);
    await teamRef.update({
      members: admin.firestore.FieldValue.arrayUnion({ userId, role }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return teamRef;
  }
}

module.exports = TeamModel;
