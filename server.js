const express = require("express");
const { admin, db } = require("./config/firebase.config");

// Initialize Express app
const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signup route
app.post("/api/v1/signup", async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const userResponse = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false,
    });
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
app.post("/api/v1/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await admin.auth().getUserByEmail(email);

    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.status(200).json({ token: customToken });
  } catch (error) {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

// verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Create new task
app.post("/api/v1/tasks", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    const newTask = {
      title,
      description,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
    };
    const taskRef = await db.collection("tasks").add(newTask);
    res.status(201).json({ id: taskRef.id, ...newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all tasks
app.get("/api/v1/tasks", verifyToken, async (req, res) => {
  try {
    const tasksSnapshot = await db
      .collection("tasks")
      .where("createdBy", "==", req.user.id)
      .get();
    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put("/api/v1/tasks/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        error:
          "At least one field (title or description) is required to update",
      });
    }

    const taskRef = db.collection("tasks").doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskDoc.data().createdBy !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "You don't have permission to update this task" });
    }

    const updatedTask = {
      ...(title && { title }),
      ...(description && { description }),
      updatedAt: new Date().toISOString(),
    };

    await taskRef.update(updatedTask);
    res.status(200).json({ id, ...updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete("/api/v1/tasks/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskRef = db.collection("tasks").doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskDoc.data().createdBy !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this task" });
    }

    await taskRef.delete();
    res
      .status(200)
      .json({ message: `Task with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
