const MemoryDB = require('./memory-db');

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
function writeFragment(fragment) {
  if (!fragment) {
    throw new Error(
      `Fragment metadata must be provided, got fragment=${fragment}`
    );
  }
  if (!fragment.ownerId || !fragment.id || !fragment.data) {
    throw new Error(
      `Fragments ownerId, Id and data metadata must be provided, , got ownerId=${fragment.ownerId}, Id=${fragment.id}, data=${fragment.data}`
    );
  }
  return metadata.put(fragment.ownerId, fragment.id, fragment);
}

// Read a fragment's metadata from memory db. Returns a Promise
function readFragment(ownerId, id) {
  if (!ownerId || !id) {
    throw new Error(
      `ownerId and Id must be provided, , got ownerId=${ownerId}, Id=${id}`
    );
  }
  return metadata.get(ownerId, id);
}

// Write a fragment's data buffer to memory db. Returns a Promise
function writeFragmentData(ownerId, id, buffer) {
  if (!ownerId || !id || !buffer) {
    throw new Error(
      `ownerId, Id and buffer must be provided, , got ownerId=${ownerId}, Id=${id}, buffer=${buffer}`
    );
  }
  return data.put(ownerId, id, buffer);
}

// Read a fragment's data from memory db. Returns a Promise
function readFragmentData(ownerId, id) {
  if (!ownerId || !id) {
    throw new Error(
      `ownerId and Id must be provided, , got ownerId=${ownerId}, Id=${id}`
    );
  }
  return data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  if (!ownerId) {
    throw new Error(
      `ownerId must be provided, , got ownerId=${ownerId}`
    );
  }
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) {
    return fragments;
  }

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
function deleteFragment(ownerId, id) {
  if (!ownerId || !id) {
    throw new Error(
      `ownerId and Id must be provided, , got ownerId=${ownerId}, Id=${id}`
    );
  }
  return Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);
}

module.exports.listFragments = listFragments;
module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentData = writeFragmentData;
module.exports.readFragmentData = readFragmentData;
module.exports.deleteFragment = deleteFragment;
