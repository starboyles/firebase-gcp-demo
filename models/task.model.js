const { db } = require("../config/firebase.config");
const { COLLECTIONS } = require("../config/constants");

class TaskModel {
  static async createTask(taskData) {
    const taskRef = db.collection(COLLECTIONS.TASKS).doc();
    await taskRef.set({
      ...taskData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return taskRef;
  }

  static async getTaskById(taskId) {
    const taskDoc = await db.collection(COLLECTIONS.TASKS).doc(taskId).get();
    return taskDoc.exists ? { id: taskDoc.id, ...taskDoc.data() } : null;
  }

  static async updateTask(taskId, updates) {
    const taskRef = db.collection(COLLECTIONS.TASKS).doc(taskId);
    await taskRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return taskRef;
  }

  static async addComment(taskId, comment) {
    const taskRef = db.collection(COLLECTIONS.TASKS).doc(taskId);
    await taskRef.update({
      comments: admin.firestore.FieldValue.arrayUnion({
        ...comment,
        id: Date.now().toString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });
    return taskRef;
  }
}

module.exports = TaskModel;
