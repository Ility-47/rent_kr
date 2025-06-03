module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
};