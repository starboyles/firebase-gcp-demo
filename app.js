const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const teamRoutes = require("./routes/team.routes");
const taskRoutes = require("./routes/tasks.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
