const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl}` || req.url;
    const cachedBody = cache.get(key);
    
    if (cachedBody) {
      return res.send(cachedBody);
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

module.exports = {
  cacheMiddleware,
  cache
};