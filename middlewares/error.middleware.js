const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === "permission-denied") {
    return res.status(403).json({ error: "Permission denied" });
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = { errorHandler };
