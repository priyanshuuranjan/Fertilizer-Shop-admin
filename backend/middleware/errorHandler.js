export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
