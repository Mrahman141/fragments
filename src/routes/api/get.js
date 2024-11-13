// src/routes/api/get.js
const mdToHtml = require('markdown-it')();
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const sharp = require('sharp');  // Import sharp for image processing


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
  let ext = parts[1];

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
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }

  if (ext) {
    if (fragment.type === "text/plain" && ["txt"].includes(ext)) {
      // Do nothing
    }
    else if (fragment.type === "text/markdown" && ["md", "html", "txt"].includes(ext)) {
      if (ext === "md") {
        // Do nothing
      }
      else if (ext === "html") {
        data = mdToHtml.render(data.toString())
        fragment.type = 'text/html'
      }
      else if (ext === "txt") {
        const htmlContent = mdToHtml.render(data.toString());

        data = htmlContent.replace(/<[^>]*>/g, '');
        fragment.type = 'text/plain'
      }
    }
    else if (fragment.type === "text/html" && ["html", "txt"].includes(ext)) {
      if (ext === "html") {
        // Do nothing
      }
      else if (ext === "txt") {
        data = data.toString().replace(/<[^>]*>/g, '');
        fragment.type = 'text/plain'
      }
    }
    else if (fragment.type === "text/csv" && ["csv", "txt", "json"].includes(ext)) {
      if (ext === "csv") {
        // Do nothing
      } else if (ext === "txt") {
        data = data.toString().replace(/,/g, ' ');
        fragment.type = 'text/plain'
      } else if (ext === "json") {
        const csvContent = data.toString();
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
        });
        fragment.type = 'application/json'
      }
    }
    else if (fragment.type === "application/json" && ["json", "yaml", "yml", "txt"].includes(ext)) {
      if (ext === "json") {
        // Do nothing
      } else if (ext === "yaml" || ext === "yml") {
        const jsonContent = data.toString();

        const parsedJson = JSON.parse(jsonContent);
        const yaml = require('js-yaml');
        data = yaml.dump(parsedJson);
        fragment.type = 'application/yaml'
      } else if (ext === "txt") {
        data = data.toString();
        fragment.type = 'text/plain'
      }
    }
    else if (fragment.type === "application/yaml" && ["yaml", "txt"].includes(ext)) {
      if (ext === "yaml") {
        // Do nothing
      } else if (ext === "txt") {
        const yamlContent = data.toString();
        const yaml = require('js-yaml');
        const parsedYaml = yaml.load(yamlContent);
        data = JSON.stringify(parsedYaml, null, 2);
        fragment.type = 'text/plain'
      }
    }
    else if (fragment.type.startsWith('image/') && ["png", "jpg", "jpeg", "webp", "gif", "avif"].includes(ext)) {
      if (ext === 'gif') {
        data = await sharp(data, { animated: true }).gif().toBuffer();
      } else {
        if (ext === "jpeg" || ext === "jpg") {
          ext = "jpeg";
        }
        let img = sharp(data);
        data = await img.toFormat(ext).toBuffer();
      }
      fragment.type = `image/${ext}`;
    }
    else {
      const error = createErrorResponse(415, `Unsupported file extension/conversion`);
      logger.error(error);
      return res.status(415).json(error);
    }
  }

  res.setHeader('Content-Type', fragment.mimeType);
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
