// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');


/**
 * Get a list of fragments for the current user
 */
module.exports.getall = async (req, res) => {
  try {
    const expand = req.query.expand === '0' ? true : false;


    const result = await Fragment.byUser(req.user, expand);
    const data = { fragments: result ? [result] : [] };

    logger.debug(data)

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.set('Location', baseUrl);
    const successResponse = createSuccessResponse(data)
    return res.status(200).json({ ...successResponse });


  } catch (err) {
    const error = createErrorResponse(500, err.message);
    logger.error(error)
    return res.status(500).json(error)
  }
};


/**
 * Get a fragment data by fragments id for the current user
 */
module.exports.getById = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Fetching fragment with ID: ${id}`);

  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id)
  } catch (err) {
    const error = createErrorResponse(404, err.message)
    logger.error(error)
    return res.status(404).json(error);
  }

  let data;
  try {
    data = await fragment.getData();
    logger.debug(data);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }

  return res.status(200).send(data);
};
