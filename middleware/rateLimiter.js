const createRateLimiter = ({ getTimestamp, durationMs, message }) => {

    return (req, res, next) => {
      const clientIdentifier = req.ip;
      const currentTime = Date.now();
  
      getTimestamp(clientIdentifier, (err, row) => {
        if (err) {
          return res.status(500).send('Server error');
        }
  
        if (row && (currentTime - row.timestamp < durationMs)) {
          const timeLeft = Math.ceil((durationMs - (currentTime - row.timestamp)) / 1000);
          const errorMessage = message.replace('{timeLeft}', timeLeft);
          
          return res.status(429).send(errorMessage);
        }
  
        next();
      });
    };
  };
  
  module.exports = createRateLimiter;
  