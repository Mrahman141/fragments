// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

/**
 * POST a fragment data for the current user
 */
module.exports = async (req, res) => {
  try {
    let data;
    if (Buffer.isBuffer(req.body)) {
      data = req.body;
      logger.info(`in the post route witht the data: ${data}`);
    } else {
      const error = createErrorResponse(415, 'Media type not supported');
      logger.error(error);
      return res.status(415).json(error);
    }

    const contentType = req.get('Content-type');
    const size = Buffer.byteLength(req.body);
    const fragment_data = {
      ownerId: req.user,
      size: size,
      type: contentType,
    };

    const new_fragment = new Fragment(fragment_data);
    logger.info('Created a new fragment');
    logger.debug(new_fragment);

    await new_fragment.setData(data);

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    const contentLength = Buffer.byteLength(req.body);
    res.set('Location', baseUrl + new_fragment.id);
    res.set('Content-Length', contentLength);


    const success = createSuccessResponse({ fragments: new_fragment });
    logger.info(success);
    return res.status(201).json({ ...success });
  } catch (err) {
    const error = createErrorResponse(500, err.message);
    logger.error(error);
    return res.status(500).json(error);
  }
};
