const UserModel = require("../models/user.model");
const { admin } = require("../config/firebase.config");

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, displayName } = req.body;

      // Create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      // Create user document in Firestore
      await UserModel.createUser(userRecord.uid, {
        email,
        displayName,
        role: "user",
      });

      res
        .status(201)
        .json({ message: "User created successfully", uid: userRecord.uid });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserModel.getUserById(req.user.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
