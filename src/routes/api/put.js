const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {

    let fragment = await Fragment.byId(req.user, id);
    const contentType = req.get('Content-type');
    if (contentType != fragment.mimeType) {
      const error = createErrorResponse(400, "Cannot update type of the fragment");
      logger.error(error);
      return res.status(400).json(error);
    }
  

    let data;
    if (Buffer.isBuffer(req.body)) {
      data = req.body;
    } else {
      const error = createErrorResponse(415, 'Media type not supported');
      logger.error(error);
      return res.status(415).json(error);
    }

    await fragment.setData(data);
    fragment = await Fragment.byId(req.user, id);

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    const contentLength = Buffer.byteLength(req.body);
    res.set('Location', baseUrl + fragment.id);
    res.set('Content-Length', contentLength);

    const success = createSuccessResponse({ fragments: fragment });
    return res.status(200).json({ ...success });

  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};
