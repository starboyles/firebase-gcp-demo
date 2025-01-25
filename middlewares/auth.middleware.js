const { admin } = require("../config/firebase.config");

const authenticateUser = async (req, res, next) => {
  const authenticateUser = async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "No token provided" });
      }
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = { authenticateUser };
