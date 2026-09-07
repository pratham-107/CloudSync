const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = {};
      result.error.errors.forEach((e) => {
        const field = e.path.join('.');
        if (!details[field]) details[field] = [];
        details[field].push(e.message);
      });

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          status: 400,
          timestamp: new Date().toISOString(),
          path: req.path,
          details,
        },
      });
    }

    req.body = result.data;
    next();
  };
};

module.exports = { validate };
