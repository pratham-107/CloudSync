const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Unexpected server error';

  console.error(`[${req.method}] ${req.path} - ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      details: err.details || undefined,
    },
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      status: 404,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { errorHandler, notFound };
