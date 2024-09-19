// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...

  const data = { fragments: [] };
  const successResponse = createSuccessResponse(data)

  res.status(200).json(successResponse);
};
