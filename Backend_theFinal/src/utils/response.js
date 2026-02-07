export const successResponse = (res, data) => {
    return res.json({
      success: true,
      data
    });
  };
  
  export const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  };