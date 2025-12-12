function sendSuccessResponse(res, code, data) {
  res.status(code).json({
    ...data,
  });
}

export default sendSuccessResponse;
