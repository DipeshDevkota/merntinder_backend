const rateLimit = require('express-rate-limit');
const RateLimitMongo = require('rate-limit-mongo');

const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 5 minutes in milliseconds
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts. Please try again after 5 minutes.',
    statusCode: 429, // HTTP status code to return when rate-limited
    headers: true, // Include rate limit headers in the response
    store: new RateLimitMongo({
        uri: process.env.MONGO_URI, // MongoDB connection string
        collectionName: 'rateLimit', // Name of the MongoDB collection
        expireTimeMs: 5 * 60 * 1000, // Expiration time for records
    }),
});

module.exports = { loginRateLimiter };
