import fs from 'fs';
import path from 'path';

const MONTHS_TO_MILLISECONDS = 30 * 24 * 60 * 60 * 1000; // 1 month

export const shouldUpdateMetadata = (timestamp, months = 1) => {
  const currentTime = new Date().getTime();
  return currentTime - timestamp > months * MONTHS_TO_MILLISECONDS;
};

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

export const readCache = (cacheFileName) => {
  const cacheFilePath = path.resolve(`src/seo/meta-data/${cacheFileName}.json`);
  ensureDirectoryExistence(cacheFilePath);
  try {
    const data = fs.readFileSync(cacheFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Cache file '${cacheFileName}.json' does not exist. Creating new cache.`);
      return {};
    }
    return {};
  }
};

export const writeCache = (cacheFileName, cache) => {
  const cacheFilePath = path.resolve(`src/seo/meta-data/${cacheFileName}.json`);
  try {
    ensureDirectoryExistence(cacheFilePath);
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error writing to cache file:', error);
    return {};
  }
};

export const clearCache = (cacheFileName) => {
  const cacheFilePath = path.resolve(`src/seo/meta-data/${cacheFileName}.json`);
  try {
    ensureDirectoryExistence(cacheFilePath);
    fs.writeFileSync(cacheFilePath, JSON.stringify({}, null, 2));
  } catch (error) {
    console.error('Error clearing cache file:', error);
    return {};
  }
};
