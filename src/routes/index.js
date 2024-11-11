// src/routes/index.js

const { createSuccessResponse } = require('../response');

const express = require('express');

// Our authentication middleware
const { authenticate } = require('../auth/index');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const data = {
    author,
    githubUrl: 'https://github.com/mrahman141/fragments',
    version,
  };
  const successResponse = createSuccessResponse(data);
  res.status(200).json(successResponse);
});

module.exports = router;
