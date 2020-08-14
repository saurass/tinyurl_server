var redis = require("redis").createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
var lru = require('redis-lru');

var cache = lru(redis, parseInt(process.env.CACHE_SIZE));

module.exports = cache;