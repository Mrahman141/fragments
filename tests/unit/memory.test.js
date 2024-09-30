// Fix this path to point to your project's `index.js` source file
const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment
} = require('../../src/model/data/memory/index');

describe('Fragment operations', () => {
  let fragment, ownerId, fragmentId, buffer;

  beforeEach(() => {
    fragment = { ownerId: 'user1', id: 'fragment1', data: 'Hello World' };
    ownerId = 'user1';
    fragmentId = 'fragment1';
    buffer = Buffer.from('Hello Buffer!');
  });

  test('writeFragment() stores fragment metadata', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('readFragment() retrieves fragment metadata', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('writeFragmentData() stores fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('readFragmentData() retrieves fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('listFragments() returns fragment ids when expand is false', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId, false);
    expect(result).toEqual([fragmentId]);
  });

  test('listFragments() returns expanded fragments when expand is true', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId, true);
    expect(result).toEqual([fragment]);
  });

  test('deleteFragment() removes fragment metadata and data', async () => {
    await writeFragment(fragment);
    await writeFragmentData(ownerId, fragmentId, buffer);
    await deleteFragment(ownerId, fragmentId);

    const metadataResult = await readFragment(ownerId, fragmentId);
    const dataResult = await readFragmentData(ownerId, fragmentId);

    expect(metadataResult).toBe(undefined);
    expect(dataResult).toBe(undefined);
  });


  test('writeFragment() expects arguments', async () => {
    expect(async () => await writeFragment()).rejects.toThrow();
    expect(async () => await writeFragment({ id: '', data: '' })).rejects.toThrow();
  });
  
  test('readFragment() expects arguments', async () => {
    expect(async () => await readFragment()).rejects.toThrow();
    expect(async () => await readFragment(null, 'id')).rejects.toThrow();
    expect(async () => await readFragment('ownerId', null)).rejects.toThrow();
  });
  
  test('writeFragmentData() expects arguments', async () => {
    let buffer = Buffer.from('Hello');
    expect(async () => await writeFragmentData()).rejects.toThrow();
    expect(async () => await writeFragmentData('ownerId', null, buffer)).rejects.toThrow();
    expect(async () => await writeFragmentData('ownerId', 'id', null)).rejects.toThrow();
  });
  
  test('readFragmentData() expects arguments', async () => {
    expect(async () => await readFragmentData()).rejects.toThrow();
    expect(async () => await readFragmentData('ownerId', null)).rejects.toThrow();
  });
  
  test('listFragments() expects arguments', async () => {
    expect(async () => await listFragments()).rejects.toThrow();
  });
  
  test('deleteFragment() expects arguments', async () => {
    expect(async () => await deleteFragment()).rejects.toThrow();
    expect(async () => await deleteFragment('ownerId', null)).rejects.toThrow();
  });
  
});
