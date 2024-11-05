// src/routes/api/get.js
const mdToHtml = require('markdown-it')();
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');


/**
 * Get a list of fragments for the current user
 */
module.exports.getall = async (req, res) => {
  try {
    const expand = req.query.expand === '1';

    const result = await Fragment.byUser(req.user, expand);
    const data = { fragments: result ? [result] : [] };

    logger.debug(data);

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.set('Location', baseUrl);
    const successResponse = createSuccessResponse(data);
    return res.status(200).json({ ...successResponse });
  } catch (err) {
    const error = createErrorResponse(500, err.message);
    logger.error(error);
    return res.status(500).json(error);
  }
};

/**
 * Get a fragment data by fragments id for the current user
 */
module.exports.getById = async (req, res) => {
  const parts = req.params.id.split('.');
  const id = parts[0];
  const ext = parts[1];

  logger.debug(`Fetching fragment with ID: ${id}`);

  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
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

  if (ext) {
    if (fragment.type === "text/markdown" && ext === "html") {
      data = mdToHtml.render(data.toString())
      fragment.type = 'text/html'
    }
  }

  res.setHeader('Content-Type', fragment.type);
  return res.status(200).send(data);
};


/**
 * Get a fragment metadata by fragments id for the current user
 */
module.exports.getInfoById = async (req, res) => {

  const { id } = req.params;
  logger.debug(`Fetching fragment with ID: ${id}`);

  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id);
    const data = createSuccessResponse({ code: 200, fragment: fragment });
    return res.status(200).json({ ...data });
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};
