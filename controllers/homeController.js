exports.home = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Hello from the API',
  });
};
