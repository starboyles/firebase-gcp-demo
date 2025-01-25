const { db } = require("../config/firebase.config");
const { COLLECTIONS } = require("../config/constants");

class UserModel {
  static async createUser(uid, userData) {
    const userRef = db.collection(COLLECTIONS.USERS).doc(uid);
    await userRef.set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return userRef;
  }

  static async getUserById(uid) {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();
    return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
  }

  static async updateUser(uid, updates) {
    const userRef = db.collection(COLLECTIONS.USERS).doc(uid);
    await userRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return userRef;
  }
}

module.exports = UserModel;
