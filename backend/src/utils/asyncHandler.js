const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next); // ✅ Properly calling the passed function
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

export { asyncHandler };