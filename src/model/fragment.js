// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!id) {
      id = randomUUID();
    }
    if (!ownerId || !type) {
      throw new Error(
        `ownerId and type required, got ownerId=${ownerId}, type=${type}`
      );
    }
    if (!size) {
      size = 0
    }
    if (typeof size !== 'number' || size < 0) {
      throw new Error(
        `size cannot be a string or a negative number`
      );
    }
    if (!created) created = new Date().toISOString();
    if (!updated) updated = new Date().toISOString();


    const parsedType = contentType.parse(type);
    if (!Fragment.isSupportedType(parsedType.type)) {
      throw new Error(
        `Invalid type, got type=${type}`
      );
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.size = size;
    this.type = type;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {

    const data = await listFragments(ownerId, expand);
    return data;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const data = await readFragment(ownerId, id);
    if (!data) {
      throw new Error(
        `Could not find any fragment data for ${ownerId} and ${id}`
      )
    }
    return new Fragment(data)
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return Promise.resolve(deleteFragment(ownerId, id));
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.updated = new Date().toISOString();
    const data = {
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      type: this.type,
      size: this.size,
    }
    return await writeFragment(data);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    const data = await readFragmentData(this.ownerId, this.id);
    if (!data) {
      throw new Error(
        `No data found of ${this.ownerId} and ${this.id}.`
      );
    }

    try {
      return Buffer.from(data);
    } catch (err) {
      throw new Error(`Failed to convert data to Buffer: ${err.message}`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data || !Buffer.byteLength(data)) {
      throw new Error(`Cannot set empty or undefined data for fragment`);
    }
    await writeFragmentData(this.ownerId, this.id, data);
    this.size = Buffer.byteLength(data);

    return this.save();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const { type } = contentType.parse(this.type);

    const formatConversions = {
      'text/plain': ['text/plain'],
      'text/html': ['text/html', 'text/plain'],
      'application/json': ['application/json', 'text/plain'],
      'image/png': ['image/png', 'image/jpeg'],
      'image/jpeg': ['image/jpeg', 'image/png'],
    };
    return formatConversions[type] || [type];
  }



  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = [
      `text/plain`,
      `text/markdown`,
      `text/html`,
      'text/csv',
      `application/json`,
      'application/yaml',
      `image/png`,
      `image/jpeg`,
      `image/webp`,
      `image/gif`,
    ];
    const Value_without_charset = value.split(';')[0].trim();
    return validTypes.includes(Value_without_charset);

  }
}

module.exports.Fragment = Fragment;
