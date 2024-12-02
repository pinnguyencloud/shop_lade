class ValidationError extends Error {
    constructor(message, details) {
      super(message);
      this.name = 'ValidationError';
      this.details = details;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.details
      });
    }
    
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  };
  
  module.exports = {
    ValidationError,
    errorHandler
  };